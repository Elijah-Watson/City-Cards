import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export const slice = createSlice({
	name: 'formVisibility',
	initialState: false as boolean,
	reducers: {
		toggleForm: state => !state,
		hideForm: () => false,
		showForm: () => true
	},
});

export const selectFormVisibility = (state: RootState) => state.formVisibility;
export const { toggleForm, hideForm, showForm } = slice.actions;

export default slice.reducer;