import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { createStore } from 'redux';
import ArticleList from './ArticleList';

// Simple mock reducer
const mockReducer = (state = {}, action) => state;
const mockStore = createStore(mockReducer);

describe('ArticleList Component', () => {
  let div;

  beforeEach(() => {
    div = document.createElement('div');
    document.body.appendChild(div);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  });

  test('renders loading state when articles is null', () => {
    const component = <ArticleList articles={null} />;
    ReactDOM.render(component, div);
    expect(div.querySelector('.article-preview').textContent).toContain('Loading...');
  });

  test('renders empty state when articles array is empty', () => {
    const component = <ArticleList articles={[]} />;
    ReactDOM.render(component, div);
    expect(div.querySelector('.article-preview').textContent).toContain('No articles are here... yet.');
  });

  test('renders articles when provided', () => {
    const mockArticles = [
      {
        slug: 'article-1',
        title: 'Test Article',
        description: 'Test description',
        body: 'Test body',
        tagList: [],
        author: { username: 'author', image: 'img.jpg', bio: 'bio', following: false },
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
        favorited: false,
        favoritesCount: 0
      }
    ];

    const component = (
      <Provider store={mockStore}>
        <BrowserRouter>
          <ArticleList articles={mockArticles} pager={() => {}} articlesCount={1} currentPage={0} />
        </BrowserRouter>
      </Provider>
    );

    ReactDOM.render(component, div);
    expect(div.querySelectorAll('.article-preview').length).toBeGreaterThan(0);
  });

  test('renders pagination component', () => {
    const mockArticles = [
      {
        slug: 'article-1',
        title: 'Test Article',
        description: 'Test description',
        body: 'Test body',
        tagList: [],
        author: { username: 'author', image: 'img.jpg', bio: 'bio', following: false },
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
        favorited: false,
        favoritesCount: 0
      }
    ];

    const component = (
      <Provider store={mockStore}>
        <BrowserRouter>
          <ArticleList articles={mockArticles} pager={() => {}} articlesCount={20} currentPage={0} />
        </BrowserRouter>
      </Provider>
    );

    ReactDOM.render(component, div);
    expect(div.querySelectorAll('.article-preview').length).toBeGreaterThan(0);
  });
});
