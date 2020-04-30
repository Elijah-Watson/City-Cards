import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export const slice = createSlice({
	name: 'cityCards',
	initialState: {
		cards: [1, 2] as number[],
		idCounter: 2 as number
	},
	reducers: {
		addCard: (state) => {
			state.idCounter = state.idCounter + 1;
			state.cards = [...state.cards, state.idCounter];
		},
		removeCard: (state, action: PayloadAction<{ id: number }>) => {
			state.cards = state.cards.filter(card => card !== action.payload.id);
		}
	},
});

export const selectCards = (state: RootState) => state.cityCards.cards;
export const { addCard, removeCard } = slice.actions;

export default slice.reducer;