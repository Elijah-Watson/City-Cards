import React from 'react';
import { SearchableSelect } from '../../helpers/searchable-select/SearchableSelect';
import { StatusIndicator } from '../../helpers/status-indicator/StatusIndicator';
import { useDispatch, useSelector } from 'react-redux';
import { updateJob, updateMonthlyCOL, updateCurrentCityId, updateAdjustedMonthlyCOL,
	selectJob, selectMonthlyCOL, selectCurrentCityId } from './personalSlice';
import { hideForm } from './formVisibilitySlice';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { queryResponsetoStatus } from '../../helpers/status-indicator/queryResponseToStatus';
import styles from './PersonalForm.module.css';
import { Job, CityWithCOL, Status } from '../../types';

import { XCircle } from 'react-feather';

interface JobTitlesAndCitiesData {
	jobs: Job[];
	cities: CityWithCOL[];
}

const JOB_TITLES_AND_CITIES = gql`
	query JobTitlesAndCities {
		jobs {
			title
		}
		cities {
			id
			name
			state {
				code
			}
			costOfLiving
		}
	}
`;

export function PersonalFormContainer() {
	const dispatch = useDispatch();
	const { loading, error, data } = useQuery<JobTitlesAndCitiesData>(JOB_TITLES_AND_CITIES);
	const status = queryResponsetoStatus(loading, error);
	const cities = data?.cities ? data.cities: [];
	const jobs = data?.jobs ? data.jobs : [];
	const clickHandler = () => dispatch(hideForm());
	return (
		<div className={styles.formContainer}>
			<div className={styles.form}>
				<PersonalForm cities={cities} jobs={jobs} status={status} />
				<button onClick={clickHandler} className={styles.button} ><XCircle color='hsl(0, 0%, 90%)' className={styles.buttonIcon} /></button>
			</div>
		</div>
	);
}

interface PersonalFormProps {
	jobs: Job[];
	cities: CityWithCOL[]; 
	status: Status;
}

function PersonalForm({ jobs, cities, status }: PersonalFormProps) {
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
				<label className={styles.formItemText} htmlFor='job-select' >Occupation:</label>
				<SearchableSelect options={jobTitleOptions} handleChange={jobHandler} buttonText={job} id='job-select' />
				{status !== Status.Complete && <span className={styles.formItemIndicator}><StatusIndicator status={status} /></span>}
			</div>
			<div className={styles.formItem} >
				<label className={styles.formItemText} htmlFor='col-input' >Current Monthly Budget:</label>
				<input name='monthly-col' type='text' pattern='\d+' value={monthlyCOL} onChange={e => monthlyCOLHandler(Number(e.target.value))} className={styles.input} id='col-input' />
			</div>
			<div className={styles.formItem} >
				<label className={styles.formItemText} htmlFor='city-select' >Current City:</label>
				<SearchableSelect options={cityOptions} handleChange={currentCityHandler} buttonValue={currentCityId} id='city-select' />
				{status !== Status.Complete && <span className={styles.formItemIndicator}><StatusIndicator status={status} /></span>}
			</div>
		</div>
	)
}