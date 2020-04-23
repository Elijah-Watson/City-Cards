import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export const slice = createSlice({
	name: 'personal',
	initialState: {
		job: 'All Occupations',
		monthlyCOL: 3000,
		currentCityId: '0',
		adjustedMonthlyCOL: 6000
	},
	reducers: {
		updateJob: (state, action) => {
			state.job = action.payload.job;
		},
		updateMonthlyCOL: (state, action) => {
			state.monthlyCOL = Number(action.payload.monthlyCOL);
		},
		updateCurrentCityId: (state, action) => {
			state.currentCityId = action.payload.currentCityId;
		},
		updateAdjustedMonthlyCOL: (state, action) => {
			state.adjustedMonthlyCOL = Number(action.payload.adjustedMonthlyCOL);
		}
	},
});

export const selectJob = (state: RootState) => state.personal.job;
export const selectMonthlyCOL = (state: RootState) => state.personal.monthlyCOL;
export const selectCurrentCityId = (state: RootState) => state.personal.currentCityId;
export const selectAdjustedMonthlyCOL = (state: RootState) => state.personal.adjustedMonthlyCOL;
export const { updateJob, updateMonthlyCOL, updateCurrentCityId, updateAdjustedMonthlyCOL } = slice.actions;

export default slice.reducer;
