import React from 'react';
import { SearchableSelect } from '../../helpers/searchable-select/SearchableSelect';
import { useDispatch, useSelector } from 'react-redux';
import { updateJob, updateMonthlyCOL, updateCurrentCityId, updateAdjustedMonthlyCOL,
	selectJob, selectMonthlyCOL, selectCurrentCityId } from './personalSlice';
import { useQuery } from '@apollo/react-hooks';
import { JOB_TITLES_AND_CITIES } from '../../queries';
import styles from './PersonalForm.module.css';
import { Job, CityWithCOL } from '../../types';

import { XCircle } from 'react-feather';

interface PersonalFormContainerProps {
	hideForm: Function;
}

export function PersonalFormContainer({ hideForm }: PersonalFormContainerProps) {
	const { loading, error, data } = useQuery(JOB_TITLES_AND_CITIES);

	let content = null;

	if (loading) content = <div>Loading...</div>;
	if (error) {
		content = <div>Error!</div>;
		console.error(error);
	}
	if (data) {
		const cities = data.cities;
		const jobs = data.jobs;
		content = (
			<PersonalForm
				cities={cities}
				jobs={jobs}
			/>
		);
	}

	return (
		<div className={styles.formContainer}>
			<div className={styles.form}>
				{content}
				<button onClick={() => hideForm()} className={styles.button} ><XCircle color='hsl(0, 0%, 90%)' /></button>
			</div>
		</div>
	);
}

interface PersonalFormProps {
	jobs: Job[];
	cities: CityWithCOL[]; 
}

function PersonalForm({ jobs, cities }: PersonalFormProps) {
	const job = useSelector(selectJob);
	const monthlyCOL = useSelector(selectMonthlyCOL);
	const currentCityId = useSelector(selectCurrentCityId);
	const dispatch = useDispatch();

	const jobTitles = jobs
						.map(job => job.title)
						.filter((job, index, self) => self.indexOf(job) === index);			
	const jobTitleOptions = jobTitles.map(title => ({ text: title, value: title}));

	const cityOptions = cities.map(city => ({ text: city.name + ', ' + city.state.code, value: city.id }));

	const jobHandler = (value: string) => dispatch(updateJob({ job: value }));
	const monthlyCOLHandler = (newMonthlyCOL: number) => {
		newMonthlyCOL = Number(newMonthlyCOL) || 0;
		const currentCity = cities.find(city => city.id === currentCityId);
		const currentCityCOL = currentCity ? currentCity.costOfLiving : 0.5;
		const adjustedMonthlyCOL = newMonthlyCOL / currentCityCOL;
		dispatch(updateMonthlyCOL({ monthlyCOL: newMonthlyCOL }));
		dispatch(updateAdjustedMonthlyCOL({ adjustedMonthlyCOL }));
	}
	const currentCityHandler = (cityId: string) => {
		const currentCity = cities.find(city => city.id === cityId);
		const currentCityCOL = currentCity ? currentCity.costOfLiving : 0.5;
		dispatch(updateCurrentCityId({ currentCityId: cityId }));
		dispatch(updateAdjustedMonthlyCOL({ adjustedMonthlyCOL: monthlyCOL / currentCityCOL }));
	}

	return (
		<div>
			<div className={styles.formItem} >
				<label>
					<span>Occupation:</span>
					<SearchableSelect options={jobTitleOptions} handleChange={jobHandler} buttonText={job} />
				</label>
			</div>
			<div className={styles.formItem} >
				<label>
					<span>Current Monthly Budget:</span>
					<input name="monthly-col" type="text" pattern="\d+" value={monthlyCOL} onChange={e => monthlyCOLHandler(Number(e.target.value))} className={styles.input} />
				</label>
			</div>
			<div className={styles.formItem} >
				<label>
					<span>Current City:</span>
					<SearchableSelect options={cityOptions} handleChange={currentCityHandler} buttonValue={currentCityId} />
				</label>
			</div>
		</div>
	)
}