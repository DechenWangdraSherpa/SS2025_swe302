import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';

describe('Header Component', () => {
  let div;

  beforeEach(() => {
    div = document.createElement('div');
    document.body.appendChild(div);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  });

  test('renders navbar with app name', () => {
    const component = (
      <BrowserRouter>
        <Header appName="conduit" currentUser={null} />
      </BrowserRouter>
    );

    ReactDOM.render(component, div);
    const navbar = div.querySelector('.navbar');
    expect(navbar).toBeTruthy();
  });

  test('renders navbar brand with app name', () => {
    const component = (
      <BrowserRouter>
        <Header appName="conduit" currentUser={null} />
      </BrowserRouter>
    );

    ReactDOM.render(component, div);
    const brand = div.querySelector('.navbar-brand');
    expect(brand.textContent).toBe('conduit');
  });

  test('renders logged out view when no current user', () => {
    const component = (
      <BrowserRouter>
        <Header appName="conduit" currentUser={null} />
      </BrowserRouter>
    );

    ReactDOM.render(component, div);
    const homeLink = div.querySelector('a[href="/"]');
    const loginLink = div.querySelector('a[href="/login"]');
    const registerLink = div.querySelector('a[href="/register"]');

    expect(homeLink).toBeTruthy();
    expect(loginLink).toBeTruthy();
    expect(registerLink).toBeTruthy();
  });

  test('renders login link in logged out view', () => {
    const component = (
      <BrowserRouter>
        <Header appName="conduit" currentUser={null} />
      </BrowserRouter>
    );

    ReactDOM.render(component, div);
    const loginLink = div.querySelector('a[href="/login"]');
    expect(loginLink.textContent).toContain('Sign in');
  });

  test('renders register link in logged out view', () => {
    const component = (
      <BrowserRouter>
        <Header appName="conduit" currentUser={null} />
      </BrowserRouter>
    );

    ReactDOM.render(component, div);
    const registerLink = div.querySelector('a[href="/register"]');
    expect(registerLink.textContent).toContain('Sign up');
  });

  test('renders logged in view when current user exists', () => {
    const currentUser = {
      username: 'testuser',
      image: 'https://example.com/user.jpg',
      email: 'test@example.com'
    };

    const component = (
      <BrowserRouter>
        <Header appName="conduit" currentUser={currentUser} />
      </BrowserRouter>
    );

    ReactDOM.render(component, div);
    const editorLink = div.querySelector('a[href="/editor"]');
    const settingsLink = div.querySelector('a[href="/settings"]');

    expect(editorLink).toBeTruthy();
    expect(settingsLink).toBeTruthy();
  });

  test('renders new post link for logged in user', () => {
    const currentUser = {
      username: 'testuser',
      image: 'https://example.com/user.jpg',
      email: 'test@example.com'
    };

    const component = (
      <BrowserRouter>
        <Header appName="conduit" currentUser={currentUser} />
      </BrowserRouter>
    );

    ReactDOM.render(component, div);
    const newPostLink = div.querySelector('a[href="/editor"]');
    expect(newPostLink.textContent).toContain('New Post');
  });

  test('renders settings link for logged in user', () => {
    const currentUser = {
      username: 'testuser',
      image: 'https://example.com/user.jpg',
      email: 'test@example.com'
    };

    const component = (
      <BrowserRouter>
        <Header appName="conduit" currentUser={currentUser} />
      </BrowserRouter>
    );

    ReactDOM.render(component, div);
    const settingsLink = div.querySelector('a[href="/settings"]');
    expect(settingsLink.textContent).toContain('Settings');
  });

  test('renders user profile link for logged in user', () => {
    const currentUser = {
      username: 'testuser',
      image: 'https://example.com/user.jpg',
      email: 'test@example.com'
    };

    const component = (
      <BrowserRouter>
        <Header appName="conduit" currentUser={currentUser} />
      </BrowserRouter>
    );

    ReactDOM.render(component, div);
    const profileLink = div.querySelector('a[href="/@testuser"]');
    expect(profileLink).toBeTruthy();
    expect(profileLink.textContent).toContain('testuser');
  });

  test('renders user image for logged in user', () => {
    const currentUser = {
      username: 'testuser',
      image: 'https://example.com/user.jpg',
      email: 'test@example.com'
    };

    const component = (
      <BrowserRouter>
        <Header appName="conduit" currentUser={currentUser} />
      </BrowserRouter>
    );

    ReactDOM.render(component, div);
    const userImg = div.querySelector('.user-pic');
    expect(userImg).toBeTruthy();
    expect(userImg.src).toContain('user.jpg');
  });

  test('does not render editor and settings links for logged out users', () => {
    const component = (
      <BrowserRouter>
        <Header appName="conduit" currentUser={null} />
      </BrowserRouter>
    );

    ReactDOM.render(component, div);
    const editorLink = div.querySelector('a[href="/editor"]');
    const settingsLink = div.querySelector('a[href="/settings"]');

    expect(editorLink).toBeFalsy();
    expect(settingsLink).toBeFalsy();
  });

  test('home link is always present', () => {
    const component = (
      <BrowserRouter>
        <Header appName="conduit" currentUser={null} />
      </BrowserRouter>
    );

    ReactDOM.render(component, div);
    const links = div.querySelectorAll('a[href="/"]');
    // Should have at least navbar brand and nav link
    expect(links.length).toBeGreaterThan(0);
  });
});
