// MSW (Mock Service Worker) server for API mocking
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Define request handlers
export const handlers = [
  // Auth endpoints
  http.post('/api/auth/login', () => {
    return HttpResponse.json({
      success: true,
      data: {
        user: {
          id: '1',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
        },
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      },
    });
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ 
      success: true, 
      message: 'Logged out successfully' 
    });
  }),

  // Flight endpoints
  http.get('/api/flights/search', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: '1',
          airline: 'Test Airways',
          departure: {
            airport: 'JFK',
            time: '2024-01-15T10:00:00Z',
          },
          arrival: {
            airport: 'LAX',
            time: '2024-01-15T14:00:00Z',
          },
          price: 350,
          currency: 'USD',
        },
      ],
      meta: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      },
    });
  }),

  // User endpoints
  http.get('/api/user/profile', () => {
    return HttpResponse.json({
      success: true,
      data: {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        preferences: {
          theme: 'light',
          language: 'en',
          timezone: 'UTC',
        },
      },
    });
  }),

  // AI Chat endpoints
  http.post('/api/ai-chat/message', () => {
    return HttpResponse.json({
      success: true,
      data: {
        id: 'msg-1',
        content: 'This is a mock AI response',
        role: 'assistant',
        timestamp: new Date().toISOString(),
      },
    });
  }),

  // Error handler for unhandled requests
  http.all('*', ({ request }) => {
    console.error(`Unhandled request: ${request.method} ${request.url}`);
    return HttpResponse.json(
      { error: 'Unhandled request in MSW' },
      { status: 500 }
    );
  }),
];

// Setup server with handlers
export const server = setupServer(...handlers);