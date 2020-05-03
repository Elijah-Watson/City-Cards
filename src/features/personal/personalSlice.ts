import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export const slice = createSlice({
	name: 'personal',
	initialState: {
		job: 'All Occupations' as string,
		adjustedMonthlyCOL: 6000 as number
	},
	reducers: {
		updateJob: (state, action: PayloadAction<{ job: string }>) => {
			state.job = action.payload.job;
		},
		updateAdjustedMonthlyCOL: (state, action: PayloadAction<{ adjustedMonthlyCOL: number }>) => {
			state.adjustedMonthlyCOL = action.payload.adjustedMonthlyCOL;
		}
	},
});

export const selectJob = (state: RootState) => state.personal.job;
export const selectAdjustedMonthlyCOL = (state: RootState) => state.personal.adjustedMonthlyCOL;
export const { updateJob, updateAdjustedMonthlyCOL } = slice.actions;

export default slice.reducer;
