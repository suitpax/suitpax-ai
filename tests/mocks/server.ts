// MSW (Mock Service Worker) server for API mocking
import { setupServer } from 'msw/node';
import { rest } from 'msw';

// Define request handlers
export const handlers = [
  // Auth endpoints
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
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
      })
    );
  }),

  rest.post('/api/auth/logout', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ success: true, message: 'Logged out successfully' })
    );
  }),

  // Flight endpoints
  rest.get('/api/flights/search', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
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
      })
    );
  }),

  // User endpoints
  rest.get('/api/user/profile', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
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
      })
    );
  }),

  // AI Chat endpoints
  rest.post('/api/ai-chat/message', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          id: 'msg-1',
          content: 'This is a mock AI response',
          role: 'assistant',
          timestamp: new Date().toISOString(),
        },
      })
    );
  }),

  // Error handler for unhandled requests
  rest.all('*', (req, res, ctx) => {
    console.error(`Unhandled request: ${req.method} ${req.url}`);
    return res(
      ctx.status(500),
      ctx.json({ error: 'Unhandled request in MSW' })
    );
  }),
];

// Setup server with handlers
export const server = setupServer(...handlers);