import React, { useState, useEffect } from 'react';
import { SearchableSelect } from '../../helpers/searchable-select/SearchableSelect';
import { StatusIndicator } from '../../helpers/status-indicator/StatusIndicator';
import { useDispatch, useSelector } from 'react-redux';
import { updateJob, updateMonthlyCOL, updateCurrentCityId, updateAdjustedMonthlyCOL,
	selectJob, selectMonthlyCOL, selectCurrentCityId } from './personalSlice';
import { useQuery } from '@apollo/react-hooks';
import { JOB_TITLES_AND_CITIES } from '../../queries';
import styles from './PersonalForm.module.css';
import { Job, CityWithCOL, Status } from '../../types';

import { XCircle } from 'react-feather';

interface PersonalFormContainerProps {
	hideForm: Function;
}

export function PersonalFormContainer({ hideForm }: PersonalFormContainerProps) {
	const { loading, error, data } = useQuery(JOB_TITLES_AND_CITIES);
	const [ status, setStatus ] = useState<Status>('loading');
	const [ cities, setCities ] = useState([]);
	const [ jobs, setJobs ] = useState([]);

	useEffect(
		() => {
			if (loading) setStatus('loading');
			if (error) {
				console.error(error);
				setStatus('error');
			}
			if (data && data.cities) {
				setStatus('complete');
				setCities(data.cities);
				setJobs(data.jobs);
			}
		},
		[ loading, error, data ]
	);

	return (
		<div className={styles.formContainer}>
			<div className={styles.form}>
				<PersonalForm cities={cities} jobs={jobs} status={status} />
				<button onClick={() => hideForm()} className={styles.button} ><XCircle color='hsl(0, 0%, 90%)' className={styles.buttonIcon} /></button>
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
				{status !== 'complete' && <span className={styles.formItemIndicator}><StatusIndicator status={status} /></span>}
			</div>
			<div className={styles.formItem} >
				<label className={styles.formItemText} htmlFor='col-input' >Current Monthly Budget:</label>
				<input name='monthly-col' type='text' pattern='\d+' value={monthlyCOL} onChange={e => monthlyCOLHandler(Number(e.target.value))} className={styles.input} id='col-input' />
			</div>
			<div className={styles.formItem} >
				<label className={styles.formItemText} htmlFor='city-select' >Current City:</label>
				<SearchableSelect options={cityOptions} handleChange={currentCityHandler} buttonValue={currentCityId} id='city-select' />
				{status !== 'complete' && <span className={styles.formItemIndicator}><StatusIndicator status={status} /></span>}
			</div>
		</div>
	)
}