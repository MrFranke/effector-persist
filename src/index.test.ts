import { withPersist } from "./index";
import { createEvent, createStore } from "effector";

const TEST_STATE = {name: 'test'};
const STORE_NAME = 'test_store';

beforeAll(() => {
  localStorage.clear();
});

test('Put new store to LocalStorage', () => {
  withPersist(createStore(TEST_STATE, {name: STORE_NAME}));
  expect(localStorage.__STORE__['persist:test_store']).toBe(JSON.stringify(TEST_STATE));
});

test('Put store without name', () => {
  const persistedStore = withPersist(createStore(TEST_STATE));

  expect(localStorage.__STORE__[`persist:${persistedStore.shortName}`]).toBe(JSON.stringify(TEST_STATE));
});

test('Init store with snapshot', () => {
  localStorage.setItem(`persist:${STORE_NAME}`, JSON.stringify(TEST_STATE));

  const persistedStore = withPersist(createStore(TEST_STATE));

  expect(persistedStore.getState()).toBe(TEST_STATE);
});

test('Update LocalStorage', () => {
  const persistedStore = withPersist(createStore(TEST_STATE));
  const event = createEvent<string>();
  const randomString = String(Math.random());

  persistedStore.on(event, (state, payload) => ({name: payload}));
  expect(localStorage.__STORE__[`persist:${persistedStore.shortName}`]).toBe(JSON.stringify(TEST_STATE));

  event(randomString);

  expect(localStorage.__STORE__[`persist:${persistedStore.shortName}`]).toBe(JSON.stringify({name: randomString}));
});

test('Config LS prefix', () => {
  const testKey = 'test_key';
  const persistedStore = withPersist(createStore(TEST_STATE), {key: 'test_key'});

  expect(localStorage.__STORE__[`${testKey}:${persistedStore.shortName}`]).toBe(JSON.stringify(TEST_STATE));
});
