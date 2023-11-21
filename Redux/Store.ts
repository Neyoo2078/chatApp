import { configureStore } from '@reduxjs/toolkit';
import { compose } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { applyMiddleware } from '@reduxjs/toolkit';
import UserSlice from './Slices/Users';
import MessageSlice from './Slices/Messages';

export const store = configureStore({
  reducer: { Users: UserSlice, Messages: MessageSlice },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
