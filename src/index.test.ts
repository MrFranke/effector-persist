import { withPersist } from './index';
import { createEvent, createStore } from 'effector';

const TEST_STATE = { name: 'test' };
const STORE_NAME = 'test_store';

beforeAll(() => {
  localStorage.clear();
});

test('Put new store to LocalStorage', () => {
  withPersist(createStore(TEST_STATE, { name: STORE_NAME }));
  expect(localStorage.__STORE__[`persist:${STORE_NAME}`]).toBe(
    JSON.stringify(TEST_STATE)
  );
});

test('Put store without name', () => {
  const persistedStore = withPersist(createStore(TEST_STATE));

  expect(localStorage.__STORE__[`persist:${persistedStore.shortName}`]).toBe(
    JSON.stringify(TEST_STATE)
  );
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

  persistedStore.on(event, (state, payload) => ({ name: payload }));
  expect(localStorage.__STORE__[`persist:${persistedStore.shortName}`]).toBe(
    JSON.stringify(TEST_STATE)
  );

  event(randomString);

  expect(localStorage.__STORE__[`persist:${persistedStore.shortName}`]).toBe(
    JSON.stringify({ name: randomString })
  );
});

test('Config LS prefix', () => {
  const key = 'test_key';
  const persistedStore = withPersist(createStore(TEST_STATE), { key });

  expect(localStorage.__STORE__[`${key}:${persistedStore.shortName}`]).toBe(
    JSON.stringify(TEST_STATE)
  );
});

test('delete ls item if it has expired', () => {
  const key = 'test_key';
  const storeName = '1pk';
  const expire = Date.now() - 2000;

  localStorage.setItem(
    `${key}:${storeName}`,
    JSON.stringify({ surname: 'surname' })
  );

  const persistedStore = withPersist(
    createStore(TEST_STATE, { name: storeName }),
    {
      key,
      expire
    }
  );

  expect(persistedStore.getState()).toEqual(TEST_STATE);
});
