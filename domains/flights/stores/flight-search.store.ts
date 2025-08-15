// Flight search store using Zustand with TypeScript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import {
  FlightSearchParams,
  FlightSearchResult,
  FlightSearchFilters,
  Flight,
  FlightError,
  SortOption,
  Airport,
} from '../types';
import { FlightSearchService } from '../services/flight-search.service';

// Store state interface
interface FlightSearchState {
  // Search state
  isSearching: boolean;
  searchParams: FlightSearchParams | null;
  searchResults: FlightSearchResult | null;
  recentSearches: FlightSearchParams[];
  
  // Selected flight
  selectedFlight: Flight | null;
  
  // Filters and sorting
  filters: FlightSearchFilters;
  sortBy: SortOption;
  filteredFlights: Flight[];
  
  // Airports and destinations
  airports: Airport[];
  popularDestinations: Airport[];
  
  // UI state
  error: FlightError | null;
  lastSearchTimestamp: number | null;
  
  // Actions
  searchFlights: (params: FlightSearchParams) => Promise<void>;
  selectFlight: (flight: Flight | null) => void;
  updateFilters: (filters: Partial<FlightSearchFilters>) => void;
  updateSorting: (sortBy: SortOption) => void;
  clearSearch: () => void;
  clearError: () => void;
  searchAirports: (query: string) => Promise<void>;
  loadPopularDestinations: (origin?: string) => Promise<void>;
  
  // Computed values
  hasSearchResults: () => boolean;
  getFilteredAndSortedFlights: () => Flight[];
  canClearFilters: () => boolean;
}

// Default filters
const defaultFilters: FlightSearchFilters = {
  airlines: [],
  maxStops: 2,
  priceRange: { min: 0, max: 10000 },
  departureTimeRange: { start: '00:00', end: '23:59' },
  arrivalTimeRange: { start: '00:00', end: '23:59' },
  duration: { min: 0, max: 1440 }, // 24 hours
  amenities: [],
};

// Create the store
export const useFlightSearchStore = create<FlightSearchState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        isSearching: false,
        searchParams: null,
        searchResults: null,
        recentSearches: [],
        selectedFlight: null,
        filters: defaultFilters,
        sortBy: 'price_asc',
        filteredFlights: [],
        airports: [],
        popularDestinations: [],
        error: null,
        lastSearchTimestamp: null,

        // Actions
        searchFlights: async (params: FlightSearchParams) => {
          const flightService = get().getFlightService();
          
          set((state) => {
            state.isSearching = true;
            state.error = null;
            state.searchParams = params;
          });

          try {
            const results = await flightService.search(params);
            
            set((state) => {
              state.isSearching = false;
              state.searchResults = results;
              state.filteredFlights = results.flights;
              state.lastSearchTimestamp = Date.now();
              
              // Add to recent searches (keep last 5)
              const existingIndex = state.recentSearches.findIndex(
                search => search.origin === params.origin && 
                         search.destination === params.destination &&
                         search.departureDate === params.departureDate
              );
              
              if (existingIndex >= 0) {
                state.recentSearches.splice(existingIndex, 1);
              }
              
              state.recentSearches.unshift(params);
              state.recentSearches = state.recentSearches.slice(0, 5);
              
              // Reset filters for new search
              state.filters = defaultFilters;
              state.sortBy = 'price_asc';
            });

            // Apply initial filtering and sorting
            get().applyFiltersAndSorting();
            
          } catch (error) {
            set((state) => {
              state.isSearching = false;
              state.error = error as FlightError;
            });
          }
        },

        selectFlight: (flight: Flight | null) => {
          set((state) => {
            state.selectedFlight = flight;
          });
        },

        updateFilters: (newFilters: Partial<FlightSearchFilters>) => {
          set((state) => {
            state.filters = { ...state.filters, ...newFilters };
          });
          
          get().applyFiltersAndSorting();
        },

        updateSorting: (sortBy: SortOption) => {
          set((state) => {
            state.sortBy = sortBy;
          });
          
          get().applyFiltersAndSorting();
        },

        clearSearch: () => {
          set((state) => {
            state.searchParams = null;
            state.searchResults = null;
            state.selectedFlight = null;
            state.filteredFlights = [];
            state.filters = defaultFilters;
            state.sortBy = 'price_asc';
            state.error = null;
            state.lastSearchTimestamp = null;
          });
        },

        clearError: () => {
          set((state) => {
            state.error = null;
          });
        },

        searchAirports: async (query: string) => {
          const flightService = get().getFlightService();
          
          try {
            const airports = await flightService.searchAirports(query);
            set((state) => {
              state.airports = airports;
            });
          } catch (error) {
            console.warn('Failed to search airports:', error);
          }
        },

        loadPopularDestinations: async (origin?: string) => {
          const flightService = get().getFlightService();
          
          try {
            const destinations = await flightService.getPopularDestinations(origin);
            set((state) => {
              state.popularDestinations = destinations;
            });
          } catch (error) {
            console.warn('Failed to load popular destinations:', error);
          }
        },

        // Computed values
        hasSearchResults: () => {
          const state = get();
          return state.searchResults !== null && state.searchResults.flights.length > 0;
        },

        getFilteredAndSortedFlights: () => {
          return get().filteredFlights;
        },

        canClearFilters: () => {
          const { filters } = get();
          return JSON.stringify(filters) !== JSON.stringify(defaultFilters);
        },

        // Private helper methods (not part of the public API)
        getFlightService: () => {
          // This would be injected in a real app
          // For now, we'll assume it's available globally
          return (globalThis as any).flightService as FlightSearchService;
        },

        applyFiltersAndSorting: () => {
          const { searchResults, filters, sortBy } = get();
          if (!searchResults) return;

          const flightService = get().getFlightService();
          
          // Apply filters
          const filtered = flightService.filterFlights(searchResults.flights, filters);
          
          // Apply sorting
          const sorted = flightService.sortFlights(filtered, sortBy);
          
          set((state) => {
            state.filteredFlights = sorted;
          });
        },
      })),
      {
        name: 'flight-search-store',
        partialize: (state) => ({
          recentSearches: state.recentSearches,
          filters: state.filters,
          sortBy: state.sortBy,
        }),
      }
    ),
    {
      name: 'flight-search-store',
    }
  )
);

// Selectors for better performance
export const useFlightSearchSelectors = {
  // Basic selectors
  isSearching: () => useFlightSearchStore(state => state.isSearching),
  searchParams: () => useFlightSearchStore(state => state.searchParams),
  searchResults: () => useFlightSearchStore(state => state.searchResults),
  selectedFlight: () => useFlightSearchStore(state => state.selectedFlight),
  error: () => useFlightSearchStore(state => state.error),
  
  // Filtered and sorted flights
  flights: () => useFlightSearchStore(state => state.getFilteredAndSortedFlights()),
  hasResults: () => useFlightSearchStore(state => state.hasSearchResults()),
  
  // Filters and sorting
  filters: () => useFlightSearchStore(state => state.filters),
  sortBy: () => useFlightSearchStore(state => state.sortBy),
  canClearFilters: () => useFlightSearchStore(state => state.canClearFilters()),
  
  // Airports and destinations
  airports: () => useFlightSearchStore(state => state.airports),
  popularDestinations: () => useFlightSearchStore(state => state.popularDestinations),
  recentSearches: () => useFlightSearchStore(state => state.recentSearches),
  
  // Computed values
  flightCount: () => useFlightSearchStore(state => state.filteredFlights.length),
  totalFlights: () => useFlightSearchStore(state => state.searchResults?.totalCount || 0),
  
  // Price range from current results
  priceRange: () => useFlightSearchStore(state => {
    const flights = state.filteredFlights;
    if (flights.length === 0) return { min: 0, max: 0 };
    
    const prices = flights.map(f => f.price.totalAmount);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }),
  
  // Available airlines from current results
  availableAirlines: () => useFlightSearchStore(state => {
    const flights = state.searchResults?.flights || [];
    const airlines = flights.map(f => f.airline);
    
    // Remove duplicates by airline code
    const uniqueAirlines = airlines.filter(
      (airline, index, arr) => arr.findIndex(a => a.code === airline.code) === index
    );
    
    return uniqueAirlines.sort((a, b) => a.name.localeCompare(b.name));
  }),
};

// Actions for use in components
export const useFlightSearchActions = () => {
  return useFlightSearchStore(state => ({
    searchFlights: state.searchFlights,
    selectFlight: state.selectFlight,
    updateFilters: state.updateFilters,
    updateSorting: state.updateSorting,
    clearSearch: state.clearSearch,
    clearError: state.clearError,
    searchAirports: state.searchAirports,
    loadPopularDestinations: state.loadPopularDestinations,
  }));
};