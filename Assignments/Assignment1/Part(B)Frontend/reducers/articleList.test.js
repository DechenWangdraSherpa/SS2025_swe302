import articleListReducer from './articleList';
import {
  ARTICLE_FAVORITED,
  ARTICLE_UNFAVORITED,
  SET_PAGE,
  APPLY_TAG_FILTER,
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  CHANGE_TAB,
  PROFILE_PAGE_LOADED,
  PROFILE_PAGE_UNLOADED
} from '../constants/actionTypes';

describe('articleList Reducer', () => {
  test('returns initial state', () => {
    const state = articleListReducer(undefined, {});
    expect(state).toEqual({});
  });

  test('handles ARTICLE_FAVORITED action', () => {
    const initialState = {
      articles: [
        { slug: 'article-1', title: 'Article 1', favorited: false, favoritesCount: 5 },
        { slug: 'article-2', title: 'Article 2', favorited: false, favoritesCount: 3 }
      ]
    };
    const action = {
      type: ARTICLE_FAVORITED,
      payload: { article: { slug: 'article-1', favorited: true, favoritesCount: 6 } }
    };
    const state = articleListReducer(initialState, action);
    expect(state.articles[0].favorited).toBe(true);
    expect(state.articles[0].favoritesCount).toBe(6);
    expect(state.articles[1].favorited).toBe(false);
  });

  test('handles ARTICLE_UNFAVORITED action', () => {
    const initialState = {
      articles: [
        { slug: 'article-1', title: 'Article 1', favorited: true, favoritesCount: 6 }
      ]
    };
    const action = {
      type: ARTICLE_UNFAVORITED,
      payload: { article: { slug: 'article-1', favorited: false, favoritesCount: 5 } }
    };
    const state = articleListReducer(initialState, action);
    expect(state.articles[0].favorited).toBe(false);
    expect(state.articles[0].favoritesCount).toBe(5);
  });

  test('handles SET_PAGE action', () => {
    const action = {
      type: SET_PAGE,
      page: 1,
      payload: {
        articles: [{ slug: 'article-1' }],
        articlesCount: 10
      }
    };
    const state = articleListReducer({}, action);
    expect(state.currentPage).toBe(1);
    expect(state.articles).toHaveLength(1);
    expect(state.articlesCount).toBe(10);
  });

  test('handles APPLY_TAG_FILTER action', () => {
    const action = {
      type: APPLY_TAG_FILTER,
      tag: 'javascript',
      pager: jest.fn(),
      payload: {
        articles: [{ slug: 'article-1', tagList: ['javascript'] }],
        articlesCount: 5
      }
    };
    const state = articleListReducer({}, action);
    expect(state.tag).toBe('javascript');
    expect(state.currentPage).toBe(0);
    expect(state.articlesCount).toBe(5);
    expect(state.tab).toBeNull();
  });

  test('handles HOME_PAGE_LOADED action with tags and articles', () => {
    const action = {
      type: HOME_PAGE_LOADED,
      pager: jest.fn(),
      tab: 'all',
      payload: [
        { tags: ['javascript', 'react', 'testing'] },
        { articles: [{ slug: 'article-1' }], articlesCount: 5 }
      ]
    };
    const state = articleListReducer({}, action);
    expect(state.tags).toHaveLength(3);
    expect(state.articles).toHaveLength(1);
    expect(state.articlesCount).toBe(5);
    expect(state.currentPage).toBe(0);
    expect(state.tab).toBe('all');
  });

  test('handles HOME_PAGE_LOADED action with null payload', () => {
    const action = {
      type: HOME_PAGE_LOADED,
      pager: jest.fn(),
      tab: 'all',
      payload: null
    };
    const state = articleListReducer({}, action);
    expect(state.tags).toEqual([]);
    expect(state.articles).toEqual([]);
    expect(state.articlesCount).toBe(0);
  });

  test('handles HOME_PAGE_UNLOADED action', () => {
    const initialState = {
      articles: [{ slug: 'article-1' }],
      tags: ['javascript'],
      articlesCount: 5
    };
    const action = { type: HOME_PAGE_UNLOADED };
    const state = articleListReducer(initialState, action);
    expect(state).toEqual({});
  });

  test('does not mutate articles when favoriting', () => {
    const article = { slug: 'article-1', favorited: false, favoritesCount: 5 };
    const initialState = { articles: [article] };
    const originalFavorited = article.favorited;

    const action = {
      type: ARTICLE_FAVORITED,
      payload: { article: { slug: 'article-1', favorited: true, favoritesCount: 6 } }
    };
    articleListReducer(initialState, action);

    expect(article.favorited).toBe(originalFavorited);
  });

  test('preserves other articles when favoriting one', () => {
    const initialState = {
      articles: [
        { slug: 'article-1', favorited: false },
        { slug: 'article-2', favorited: false },
        { slug: 'article-3', favorited: false }
      ]
    };
    const action = {
      type: ARTICLE_FAVORITED,
      payload: { article: { slug: 'article-2', favorited: true, favoritesCount: 1 } }
    };
    const state = articleListReducer(initialState, action);
    expect(state.articles).toHaveLength(3);
    expect(state.articles[0].favorited).toBe(false);
    expect(state.articles[2].favorited).toBe(false);
  });

  test('handles unknown action type', () => {
    const initialState = { articles: [{ slug: 'article-1' }] };
    const state = articleListReducer(initialState, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });
});
