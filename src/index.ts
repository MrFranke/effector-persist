import { createEvent, Store } from 'effector';

type PersistConfig = {
  key?: string;
  expire?: number;
};

const defaultConfig = {
  key: 'persist'
};

export const withPersist = <State>(
  store: Store<State>,
  config: PersistConfig = defaultConfig
) => {
  const name = store.shortName;
  const { key, expire } = config;
  const persistKey = `${key}:${name}`;
  const rehydrate = createEvent('@PERSIST/REHYDRATE');

  if (expire && isExpired(expire)) {
    localStorage.removeItem(persistKey);
  }

  const snapshot = localStorage.getItem(persistKey);

  if (snapshot) {
    store.on(rehydrate, () => JSON.parse(snapshot));
    rehydrate();
  }

  store.watch((state) => {
    localStorage.setItem(persistKey, JSON.stringify(state));
  });

  return store;
};

const isExpired = (expire: number) => expire < Date.now();
