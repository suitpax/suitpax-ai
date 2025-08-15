# Brave Search Integration

Suitpax AI integrates with Brave Search API to provide real-time web intelligence and news search capabilities, enhancing travel decision-making with up-to-date information about destinations, disruptions, and travel conditions.

## Overview

The Brave Search integration provides two main functionalities:
- **News Search**: Get real-time news relevant to travel and business
- **Web Search**: General web search for research and information gathering

## Configuration

### Environment Variables

Add your Brave Search API key to your environment configuration:

```env
BRAVE_API_KEY=your_brave_search_api_key
```

### API Endpoints

- `POST /api/brave/news` - News search endpoint
- `POST /api/brave/search` - General web search endpoint

## Features

### News Search

Real-time news search with customizable freshness periods for travel-related intelligence.

**Parameters:**
- `query` (string): Search query
- `count` (number): Number of results (default: 6)
- `freshness` (BraveFreshness): Time period - "d1", "d7", "m1"

**Example Usage:**
```typescript
import { fetchNews } from "@/lib/web-search"

const news = await fetchNews("airline strikes europe", 10, "d1")
```

### Web Search

General web search with language and location customization.

**Parameters:**
- `query` (string): Search query
- `count` (number): Number of results (default: 10)
- `search_lang` (BraveSearchLang): Language code (default: "en")
- `country` (BraveCountry): Country code (default: "US")
- `safesearch` (BraveSafeSearch): Safety level - "strict", "moderate", "off"

**Example Usage:**
```typescript
import { fetchWebSearch } from "@/lib/web-search"

const results = await fetchWebSearch("business travel paris", 5, "en", "FR", "moderate")
```

## Use Cases

### Travel Intelligence Radar

The Travel Intel Radar widget uses Brave News to:
- Monitor airline strikes and disruptions
- Track weather-related travel impacts
- Identify destination-specific advisories
- Provide real-time travel condition updates

### AI-Powered Research

Integration with AI agents for:
- Destination research and recommendations
- Policy compliance verification
- Market intelligence gathering
- Competitive analysis

## Implementation Examples

### Basic News Search
```typescript
"use client"

import { fetchNews, formatNewsForAI } from "@/lib/web-search"

export function TravelNewsWidget() {
  const [news, setNews] = useState([])
  
  useEffect(() => {
    const loadNews = async () => {
      const results = await fetchNews("business travel alerts", 6, "d1")
      setNews(results.results)
    }
    loadNews()
  }, [])

  return (
    <div>
      {news.map((item, index) => (
        <NewsItem key={index} {...item} />
      ))}
    </div>
  )
}
```

### AI Integration
```typescript
import { formatNewsForAI, formatWebSearchForAI } from "@/lib/web-search"

// Format search results for AI processing
const formattedNews = formatNewsForAI(newsResults)
const formattedWeb = formatWebSearchForAI(webResults)

// Send to AI for analysis
const aiResponse = await fetch("/api/ai-core", {
  method: "POST",
  body: JSON.stringify({
    message: `Analyze these travel insights: ${formattedNews}`,
    includeReasoning: true
  })
})
```

## Error Handling

The integration includes comprehensive error handling:

- **API Key Missing**: Returns 500 error with clear message
- **Invalid Query**: Returns 400 error for missing queries
- **API Failures**: Graceful fallback with empty results
- **Rate Limiting**: Automatic retry logic (future enhancement)

## Data Types

### News Result
```typescript
interface NewsResult {
  title: string
  url: string
  description: string
  published?: string
  outlet?: string
  image?: string
}
```

### Web Search Result
```typescript
interface WebSearchResult {
  title: string
  url: string
  description: string
  published?: string
  language?: string
  is_source_local?: boolean
  is_source_both?: boolean
}
```

## Best Practices

1. **Query Optimization**: Use specific, travel-related keywords
2. **Freshness Selection**: Choose appropriate time periods for relevance
3. **Result Limiting**: Use reasonable count limits to avoid rate limiting
4. **Caching**: Implement client-side caching for repeated queries
5. **Error Handling**: Always handle API failures gracefully

## Rate Limits

Brave Search API has usage limits based on your subscription plan. Monitor usage and implement:
- Request throttling
- Result caching
- Fallback mechanisms

## Future Enhancements

- **Image Search**: Integration with Brave Image Search API
- **Location Search**: Geographic-specific search capabilities
- **Video Search**: Travel-related video content discovery
- **Advanced Filtering**: Custom filters for business travel relevance
- **Caching Layer**: Redis-based caching for improved performance

## Security

- API keys are server-side only
- All requests go through internal API routes
- No direct client-to-Brave communication
- Input validation and sanitization

## Monitoring

Track usage and performance:
- API response times
- Error rates
- Query patterns
- Usage quotas

This integration provides Suitpax AI with real-time web intelligence capabilities, enabling smarter travel decisions and enhanced user experiences.