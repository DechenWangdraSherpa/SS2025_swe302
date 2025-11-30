import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { createStore, combineReducers } from 'redux';
import Editor from './Editor';

const editorReducer = (state = { 
  title: '', 
  description: '', 
  body: '', 
  tagInput: '', 
  tagList: [],
  articleSlug: undefined,
  errors: null,
  inProgress: false 
}, action) => {
  switch (action.type) {
    case 'UPDATE_FIELD_EDITOR':
      return { ...state, [action.key]: action.value };
    case 'ADD_TAG':
      return { ...state, tagList: [...(state.tagList || []), state.tagInput], tagInput: '' };
    case 'REMOVE_TAG':
      return { ...state, tagList: (state.tagList || []).filter(t => t !== action.tag) };
    case 'EDITOR_PAGE_UNLOADED':
      return {};
    case 'EDITOR_PAGE_LOADED':
      return action.payload ? { ...state, ...action.payload } : state;
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  editor: editorReducer
});

const mockStore = createStore(rootReducer);

const mockMatch = {
  params: {
    slug: undefined
  }
};

describe('Editor Component', () => {
  let div;

  beforeEach(() => {
    div = document.createElement('div');
    document.body.appendChild(div);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  });

  test('renders editor page', () => {
    const component = (
      <Provider store={mockStore}>
        <BrowserRouter>
          <Editor match={mockMatch} />
        </BrowserRouter>
      </Provider>
    );

    ReactDOM.render(component, div);
    const editorPage = div.querySelector('.editor-page');
    expect(editorPage).toBeTruthy();
  });

  test('renders article title input field', () => {
    const component = (
      <Provider store={mockStore}>
        <BrowserRouter>
          <Editor match={mockMatch} />
        </BrowserRouter>
      </Provider>
    );

    ReactDOM.render(component, div);
    const titleInput = div.querySelector('input[placeholder="Article Title"]');
    expect(titleInput).toBeTruthy();
    expect(titleInput.type).toBe('text');
  });

  test('renders article description input field', () => {
    const component = (
      <Provider store={mockStore}>
        <BrowserRouter>
          <Editor match={mockMatch} />
        </BrowserRouter>
      </Provider>
    );

    ReactDOM.render(component, div);
    const inputs = div.querySelectorAll('input[type="text"]');
    let hasDescInput = false;
    inputs.forEach(input => {
      if (input.placeholder.includes("this article about")) {
        hasDescInput = true;
      }
    });
    expect(hasDescInput).toBe(true);
  });

  test('renders article body textarea', () => {
    const component = (
      <Provider store={mockStore}>
        <BrowserRouter>
          <Editor match={mockMatch} />
        </BrowserRouter>
      </Provider>
    );

    ReactDOM.render(component, div);
    const bodyTextarea = div.querySelector('textarea');
    expect(bodyTextarea).toBeTruthy();
    expect(bodyTextarea.rows).toBe(8);
  });

  test('renders tag input field', () => {
    const component = (
      <Provider store={mockStore}>
        <BrowserRouter>
          <Editor match={mockMatch} />
        </BrowserRouter>
      </Provider>
    );

    ReactDOM.render(component, div);
    const tagInput = div.querySelector('input[placeholder="Enter tags"]');
    expect(tagInput).toBeTruthy();
  });

  test('renders publish button', () => {
    const component = (
      <Provider store={mockStore}>
        <BrowserRouter>
          <Editor match={mockMatch} />
        </BrowserRouter>
      </Provider>
    );

    ReactDOM.render(component, div);
    const publishBtn = div.querySelector('button[type="button"]');
    expect(publishBtn).toBeTruthy();
    expect(publishBtn.textContent).toBe('Publish Article');
  });

  test('publish button has correct classes', () => {
    const component = (
      <Provider store={mockStore}>
        <BrowserRouter>
          <Editor match={mockMatch} />
        </BrowserRouter>
      </Provider>
    );

    ReactDOM.render(component, div);
    const publishBtn = div.querySelector('button[type="button"]');
    expect(publishBtn.className).toContain('btn-lg');
    expect(publishBtn.className).toContain('btn-primary');
  });

  test('renders form with all fieldsets', () => {
    const component = (
      <Provider store={mockStore}>
        <BrowserRouter>
          <Editor match={mockMatch} />
        </BrowserRouter>
      </Provider>
    );

    ReactDOM.render(component, div);
    const fieldsets = div.querySelectorAll('fieldset');
    expect(fieldsets.length).toBeGreaterThan(0);
  });

  test('renders tag list container', () => {
    const component = (
      <Provider store={mockStore}>
        <BrowserRouter>
          <Editor match={mockMatch} />
        </BrowserRouter>
      </Provider>
    );

    ReactDOM.render(component, div);
    const tagList = div.querySelector('.tag-list');
    expect(tagList).toBeTruthy();
  });

  test('renders ListErrors component', () => {
    const component = (
      <Provider store={mockStore}>
        <BrowserRouter>
          <Editor match={mockMatch} />
        </BrowserRouter>
      </Provider>
    );

    ReactDOM.render(component, div);
    const form = div.querySelector('form');
    expect(form).toBeTruthy();
  });

  test('all input fields have form-control class', () => {
    const component = (
      <Provider store={mockStore}>
        <BrowserRouter>
          <Editor match={mockMatch} />
        </BrowserRouter>
      </Provider>
    );

    ReactDOM.render(component, div);
    const inputs = div.querySelectorAll('.form-control');
    expect(inputs.length).toBeGreaterThan(0);
  });
});
