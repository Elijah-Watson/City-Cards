import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export const slice = createSlice({
	name: 'personal',
	initialState: {
		job: 'All Occupations' as string,
		monthlyCOL: 3000 as number,
		currentCityId: '0' as string,
		adjustedMonthlyCOL: 6000 as number
	},
	reducers: {
		updateJob: (state, action: PayloadAction<{ job: string }>) => {
			state.job = action.payload.job;
		},
		updateMonthlyCOL: (state, action: PayloadAction<{ monthlyCOL: number }>) => {
			state.monthlyCOL = Number(action.payload.monthlyCOL);
		},
		updateCurrentCityId: (state, action: PayloadAction<{ currentCityId: string }>) => {
			state.currentCityId = action.payload.currentCityId;
		},
		updateAdjustedMonthlyCOL: (state, action: PayloadAction<{ adjustedMonthlyCOL: number }>) => {
			state.adjustedMonthlyCOL = action.payload.adjustedMonthlyCOL;
		}
	},
});

export const selectJob = (state: RootState) => state.personal.job;
export const selectMonthlyCOL = (state: RootState) => state.personal.monthlyCOL;
export const selectCurrentCityId = (state: RootState) => state.personal.currentCityId;
export const selectAdjustedMonthlyCOL = (state: RootState) => state.personal.adjustedMonthlyCOL;
export const { updateJob, updateMonthlyCOL, updateCurrentCityId, updateAdjustedMonthlyCOL } = slice.actions;

export default slice.reducer;
