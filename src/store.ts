import { configureStore } from '@reduxjs/toolkit';
import personalReducer from './features/personal/personalSlice';

const store = configureStore({
  reducer: {
	personal: personalReducer
  },
});
export type RootState = ReturnType<typeof store.getState>
export default store;