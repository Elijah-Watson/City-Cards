import { configureStore } from '@reduxjs/toolkit';
import personalReducer from './features/personal/personalSlice';
import formVisibilityReducer from './features/personal/formVisibilitySlice';
import cityCardsReducer from './features/city-cards/cityCardsSlice';

const store = configureStore({
  reducer: {
	personal: personalReducer,
	formVisibility: formVisibilityReducer,
	cityCards: cityCardsReducer
  },
});
export type RootState = ReturnType<typeof store.getState>
export default store;