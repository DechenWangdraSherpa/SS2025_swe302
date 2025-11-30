import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { createStore } from 'redux';
import ArticlePreview from './ArticlePreview';

// Simple mock reducer
const mockReducer = (state = {}, action) => state;
const mockStore = createStore(mockReducer);

const mockArticle = {
  slug: 'test-article-slug',
  title: 'Test Article Title',
  description: 'Test article description',
  body: 'Test article body content',
  tagList: ['react', 'testing', 'javascript'],
  author: {
    username: 'testauthor',
    image: 'https://example.com/author.jpg',
    bio: 'Test author bio',
    following: false
  },
  createdAt: '2025-01-15T10:30:00Z',
  updatedAt: '2025-01-15T10:30:00Z',
  favorited: false,
  favoritesCount: 42
};

describe('ArticlePreview Component', () => {
  let div;

  beforeEach(() => {
    div = document.createElement('div');
    document.body.appendChild(div);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  });

  test('renders article title', () => {
    const component = (
      <Provider store={mockStore}>
        <BrowserRouter>
          <ArticlePreview article={mockArticle} />
        </BrowserRouter>
      </Provider>
    );

    ReactDOM.render(component, div);
    expect(div.querySelector('h1').textContent).toBe('Test Article Title');
  });

  test('renders article description', () => {
    const component = (
      <Provider store={mockStore}>
        <BrowserRouter>
          <ArticlePreview article={mockArticle} />
        </BrowserRouter>
      </Provider>
    );

    ReactDOM.render(component, div);
    const description = div.querySelector('.preview-link p');
    expect(description.textContent).toBe('Test article description');
  });

  test('renders author information', () => {
    const component = (
      <Provider store={mockStore}>
        <BrowserRouter>
          <ArticlePreview article={mockArticle} />
        </BrowserRouter>
      </Provider>
    );

    ReactDOM.render(component, div);
    const authorLink = div.querySelector('.author');
    expect(authorLink.textContent).toBe('testauthor');
  });

  test('renders author image', () => {
    const component = (
      <Provider store={mockStore}>
        <BrowserRouter>
          <ArticlePreview article={mockArticle} />
        </BrowserRouter>
      </Provider>
    );

    ReactDOM.render(component, div);
    const authorImg = div.querySelector('.article-meta img');
    expect(authorImg.src).toContain('author.jpg');
  });

  test('renders tag list', () => {
    const component = (
      <Provider store={mockStore}>
        <BrowserRouter>
          <ArticlePreview article={mockArticle} />
        </BrowserRouter>
      </Provider>
    );

    ReactDOM.render(component, div);
    const tags = div.querySelectorAll('.tag-pill');
    expect(tags.length).toBe(3);
    expect(tags[0].textContent).toBe('react');
    expect(tags[1].textContent).toBe('testing');
    expect(tags[2].textContent).toBe('javascript');
  });

  test('renders favorites count', () => {
    const component = (
      <Provider store={mockStore}>
        <BrowserRouter>
          <ArticlePreview article={mockArticle} />
        </BrowserRouter>
      </Provider>
    );

    ReactDOM.render(component, div);
    const favoriteBtn = div.querySelector('.pull-xs-right button');
    expect(favoriteBtn.textContent).toContain('42');
  });

  test('renders favorite button with correct class when not favorited', () => {
    const component = (
      <Provider store={mockStore}>
        <BrowserRouter>
          <ArticlePreview article={mockArticle} />
        </BrowserRouter>
      </Provider>
    );

    ReactDOM.render(component, div);
    const favoriteBtn = div.querySelector('.pull-xs-right button');
    expect(favoriteBtn.className).toContain('btn-outline-primary');
  });

  test('renders favorite button with correct class when favorited', () => {
    const favoritedArticle = { ...mockArticle, favorited: true };
    const component = (
      <Provider store={mockStore}>
        <BrowserRouter>
          <ArticlePreview article={favoritedArticle} />
        </BrowserRouter>
      </Provider>
    );

    ReactDOM.render(component, div);
    const favoriteBtn = div.querySelector('.pull-xs-right button');
    expect(favoriteBtn.className).toContain('btn-primary');
  });

  test('renders article preview container', () => {
    const component = (
      <Provider store={mockStore}>
        <BrowserRouter>
          <ArticlePreview article={mockArticle} />
        </BrowserRouter>
      </Provider>
    );

    ReactDOM.render(component, div);
    const preview = div.querySelector('.article-preview');
    expect(preview).toBeTruthy();
  });

  test('renders read more link', () => {
    const component = (
      <Provider store={mockStore}>
        <BrowserRouter>
          <ArticlePreview article={mockArticle} />
        </BrowserRouter>
      </Provider>
    );

    ReactDOM.render(component, div);
    const readMore = div.querySelector('.preview-link span');
    expect(readMore.textContent).toBe('Read more...');
  });
});
