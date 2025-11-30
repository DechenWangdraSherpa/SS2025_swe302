import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { createStore } from 'redux';

// Simple root reducer for testing
const rootReducer = (state = {}, action) => {
  return state;
};

// Custom render function that includes Redux Provider and Router
function render(
  ui,
  {
    initialState = {},
    store = createTestStore(initialState),
    route = '/',
    ...renderOptions
  } = {}
) {
  if (typeof window !== 'undefined') {
    window.history.pushState({}, 'Test page', route);
  }

  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </Provider>
    );
  }
  return { ...rtlRender(ui, { wrapper: Wrapper, ...renderOptions }), store };
}

// Create a test store
function createTestStore(initialState = {}) {
  return createStore(rootReducer, initialState);
}

// Mock data helpers
export const mockArticle = {
  slug: 'test-article',
  title: 'Test Article',
  description: 'Test article description',
  body: 'Test article body',
  tagList: ['test', 'article'],
  author: {
    username: 'testuser',
    image: 'https://api.example.com/images/demo.jpg',
    bio: 'Test bio',
    following: false
  },
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
  favorited: false,
  favoritesCount: 0
};

export const mockUser = {
  email: 'test@example.com',
  token: 'test-jwt-token',
  username: 'testuser',
  bio: 'Test bio',
  image: 'https://api.example.com/images/demo.jpg'
};

export const mockComment = {
  id: 1,
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
  body: 'Test comment',
  author: {
    username: 'commentauthor',
    image: 'https://api.example.com/images/demo.jpg',
    bio: 'Comment author bio',
    following: false
  }
};

// Re-export everything from React Testing Library
export * from '@testing-library/react';

// Override render method
export { render, createTestStore };
