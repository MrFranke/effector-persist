import { createEvent, Store } from "effector";

type PersistConfig = {
  key?: string;
}

const defaultConfig = {
  key: 'persist'
};

export const withPersist = <State>(store: Store<State>, config: PersistConfig = defaultConfig) => {
  const name = store.shortName;
  const persistKey = `${config.key}:${name}`;
  const snapshot = localStorage.getItem(persistKey);
  const rehydrate = createEvent('@PERSIST/REHYDRATE');

  if (snapshot) {
    store.on(rehydrate, () => JSON.parse(snapshot));
    rehydrate();
  }


  store.watch(state => {
    localStorage.setItem(persistKey, JSON.stringify(state));
  });

  return store;
};
