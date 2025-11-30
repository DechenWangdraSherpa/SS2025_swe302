import authReducer from './auth';
import {
  LOGIN,
  REGISTER,
  LOGIN_PAGE_UNLOADED,
  REGISTER_PAGE_UNLOADED,
  ASYNC_START,
  UPDATE_FIELD_AUTH
} from '../constants/actionTypes';

describe('auth Reducer', () => {
  test('returns initial state', () => {
    const state = authReducer(undefined, {});
    expect(state).toEqual({});
  });

  test('handles UPDATE_FIELD_AUTH action', () => {
    const action = {
      type: UPDATE_FIELD_AUTH,
      key: 'email',
      value: 'test@example.com'
    };
    const state = authReducer({}, action);
    expect(state.email).toBe('test@example.com');
  });

  test('handles UPDATE_FIELD_AUTH for password', () => {
    const action = {
      type: UPDATE_FIELD_AUTH,
      key: 'password',
      value: 'secretpassword'
    };
    const state = authReducer({}, action);
    expect(state.password).toBe('secretpassword');
  });

  test('handles LOGIN action on success', () => {
    const action = {
      type: LOGIN,
      error: false,
      payload: { user: { email: 'test@example.com', token: 'jwt-token' } }
    };
    const state = authReducer({ email: 'test@example.com', password: 'pass', inProgress: true }, action);
    expect(state.inProgress).toBe(false);
    expect(state.errors).toBeNull();
  });

  test('handles LOGIN action on error', () => {
    const action = {
      type: LOGIN,
      error: true,
      payload: { errors: { 'email or password': ['is invalid'] } }
    };
    const state = authReducer({ email: 'test@example.com', password: 'pass', inProgress: true }, action);
    expect(state.inProgress).toBe(false);
    expect(state.errors).toBeTruthy();
  });

  test('handles REGISTER action on success', () => {
    const action = {
      type: REGISTER,
      error: false,
      payload: { user: { email: 'new@example.com', token: 'jwt-token' } }
    };
    const state = authReducer({ inProgress: true }, action);
    expect(state.inProgress).toBe(false);
    expect(state.errors).toBeNull();
  });

  test('handles REGISTER action on error', () => {
    const action = {
      type: REGISTER,
      error: true,
      payload: { errors: { username: ['has already been taken'] } }
    };
    const state = authReducer({ inProgress: true }, action);
    expect(state.inProgress).toBe(false);
    expect(state.errors).toBeTruthy();
  });

  test('handles LOGIN_PAGE_UNLOADED action', () => {
    const action = { type: LOGIN_PAGE_UNLOADED };
    const state = authReducer({ email: 'test@example.com', password: 'pass' }, action);
    expect(state).toEqual({});
  });

  test('handles REGISTER_PAGE_UNLOADED action', () => {
    const action = { type: REGISTER_PAGE_UNLOADED };
    const state = authReducer({ email: 'test@example.com', password: 'pass' }, action);
    expect(state).toEqual({});
  });

  test('handles ASYNC_START for LOGIN', () => {
    const action = { type: ASYNC_START, subtype: LOGIN };
    const state = authReducer({}, action);
    expect(state.inProgress).toBe(true);
  });

  test('handles ASYNC_START for REGISTER', () => {
    const action = { type: ASYNC_START, subtype: REGISTER };
    const state = authReducer({}, action);
    expect(state.inProgress).toBe(true);
  });

  test('multiple UPDATE_FIELD_AUTH calls accumulate', () => {
    let state = authReducer({}, { type: UPDATE_FIELD_AUTH, key: 'email', value: 'test@example.com' });
    state = authReducer(state, { type: UPDATE_FIELD_AUTH, key: 'password', value: 'pass' });
    expect(state.email).toBe('test@example.com');
    expect(state.password).toBe('pass');
  });

  test('errors property is set correctly on error', () => {
    const errors = { 'email or password': ['is invalid'] };
    const action = { type: LOGIN, error: true, payload: { errors } };
    const state = authReducer({}, action);
    expect(state.errors).toEqual(errors);
  });

  test('inProgress is set to false after async operation', () => {
    const startState = authReducer({}, { type: ASYNC_START, subtype: LOGIN });
    const endState = authReducer(startState, { type: LOGIN, error: false, payload: {} });
    expect(endState.inProgress).toBe(false);
  });
});
