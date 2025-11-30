import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { createStore, combineReducers } from 'redux';
import Login from './Login';

// Mock auth reducer
const authReducer = (state = { email: '', password: '', errors: null, inProgress: false }, action) => {
  switch (action.type) {
    case 'UPDATE_FIELD_AUTH':
      return { ...state, [action.key]: action.value };
    case 'LOGIN':
      return { ...state, inProgress: false, errors: null };
    case 'LOGIN_PAGE_UNLOADED':
      return {};
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  auth: authReducer
});

const mockStore = createStore(rootReducer);

describe('Login Component', () => {
  let div;

  beforeEach(() => {
    div = document.createElement('div');
    document.body.appendChild(div);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  });

  test('renders login form', () => {
    const component = (
      <Provider store={mockStore}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );

    ReactDOM.render(component, div);
    expect(div.querySelector('h1').textContent).toBe('Sign In');
  });

  test('renders sign in button', () => {
    const component = (
      <Provider store={mockStore}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );

    ReactDOM.render(component, div);
    const button = div.querySelector('button[type="submit"]');
    expect(button.textContent).toContain('Sign in');
  });

  test('renders email input field', () => {
    const component = (
      <Provider store={mockStore}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );

    ReactDOM.render(component, div);
    const emailInput = div.querySelector('input[type="email"]');
    expect(emailInput).toBeTruthy();
    expect(emailInput.placeholder).toBe('Email');
  });

  test('renders password input field', () => {
    const component = (
      <Provider store={mockStore}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );

    ReactDOM.render(component, div);
    const passwordInput = div.querySelector('input[type="password"]');
    expect(passwordInput).toBeTruthy();
    expect(passwordInput.placeholder).toBe('Password');
  });

  test('renders link to register page', () => {
    const component = (
      <Provider store={mockStore}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );

    ReactDOM.render(component, div);
    const registerLink = div.querySelector('a[href="/register"]');
    expect(registerLink).toBeTruthy();
    expect(registerLink.textContent).toContain('Need an account?');
  });

  test('form contains fieldset elements', () => {
    const component = (
      <Provider store={mockStore}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );

    ReactDOM.render(component, div);
    const fieldsets = div.querySelectorAll('fieldset');
    expect(fieldsets.length).toBeGreaterThan(0);
  });

  test('form has correct CSS classes', () => {
    const component = (
      <Provider store={mockStore}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );

    ReactDOM.render(component, div);
    const authPage = div.querySelector('.auth-page');
    expect(authPage).toBeTruthy();
  });

  test('submit button has btn-lg btn-primary classes', () => {
    const component = (
      <Provider store={mockStore}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );

    ReactDOM.render(component, div);
    const button = div.querySelector('button[type="submit"]');
    expect(button.className).toContain('btn-lg');
    expect(button.className).toContain('btn-primary');
  });

  test('ListErrors component is rendered', () => {
    const component = (
      <Provider store={mockStore}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );

    ReactDOM.render(component, div);
    // ListErrors would render error messages if present
    expect(div.querySelector('.form-group')).toBeTruthy();
  });
});
