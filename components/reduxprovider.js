'use client';

import { Provider } from 'react-redux';

import { store } from '../lib/reduxstore';

export default function Store({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
