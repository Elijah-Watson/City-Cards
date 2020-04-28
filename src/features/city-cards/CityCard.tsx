import React, { useState, useEffect } from 'react';
import styles from './CityCard.module.css';
import { useSelector } from 'react-redux';
import { selectJob, selectAdjustedMonthlyCOL } from '../personal/personalSlice';
import { SearchableSelect } from '../../helpers/searchable-select/SearchableSelect';
import { Blanker } from '../../helpers/blanker/Blanker';
import { StatusIndicator } from '../../helpers/status-indicator/StatusIndicator';
import { useQuery } from '@apollo/react-hooks';
import { CITIES, CITY_DATA_BY_ID } from '../../queries';
import { City, CityWithDetails, Status, Ranges, FormattedCity } from '../../types';

import { XCircle } from 'react-feather';

type CityList = { text: string; value: string }[];

interface CityCardProps {
	addCityId: Function;
	addCity: Function;
	removeCity: Function;
	cityIds: string[];
	ranges: Ranges;
	removeSelf: Function;
}

export function CityCard({ addCityId, addCity, removeCity, cityIds, ranges, removeSelf }: CityCardProps) {
	const [newCard, setNewCard] = useState<boolean>(true);
	const [currentCityId, setCurrentCityId] = useState<string>('');
	const handleChange = (cityId: string) => {
		setNewCard(false);
		setCurrentCityId(cityId);
		addCityId(cityId);
	}
	useEffect(() => () => removeCity(currentCityId), [currentCityId, removeCity]);
	return (
		<div className={styles.card} >
			{newCard ? <NewCityCard cityIds={cityIds} handleChange={handleChange} /> : <LoadedCityCard cityId={currentCityId} addCity={addCity} ranges={ranges} />}
			<button onClick={removeSelf()} className={styles.button}><XCircle color='hsl(0, 0%, 90%)' /></button>
		</div>
	);
}

interface NewCityCardProps {
	cityIds: string[];
	handleChange: Function;
}

function NewCityCard({ cityIds, handleChange }: NewCityCardProps) {
	const { loading, error, data } = useQuery(CITIES);
	const [status, setStatus] = useState<Status>('loading');
	const [cityList, setCityList] = useState<CityList>([]);

	useEffect(
		() => {
			if (loading) setStatus('loading');
			if (error) {
				console.error(error);
				setStatus('error');
			}
			if (data && data.cities) {
				setStatus('complete');
				const newCityList = data.cities
					.filter((city: City) => !cityIds.includes(city.id))
					.map((city: City) => ({ value: city.id, text: city.name + ', ' + city.state.code }));
				setCityList(newCityList);
			}
		},
		[loading, error, data, cityIds]
	);
	const indicator = (
		<div className={styles.indicatorWrapper} >
			<div className={styles.indicatorParent} >
				<StatusIndicator status={status} showComplete={false} />
			</div>
		</div>
	);
	return (
		<>
			{!cityList.length && indicator}
			<Blanker blank={!cityList.length} >
				<div className={styles.cardHeader}>
					<div className={styles.formItem}>
						<SearchableSelect options={cityList} handleChange={handleChange} buttonText="Choose a city..." />
					</div>
				</div>
				<CityCardData empty={true} />
			</Blanker>
		</>
	)
}

function formatCity(city: CityWithDetails, ranges: Ranges): FormattedCity {
	return {
		fullName: city.name + ', ' + city.state.code,
		population: {
			min: ranges.population.min,
			max: ranges.population.max,
			value: city.population
		},
		costOfLiving: {
			min: ranges.costOfLiving.min,
			max: ranges.costOfLiving.max,
			value: city.costOfLiving
		},
		violentCrime: {
			min: ranges.violentCrime.min,
			max: ranges.violentCrime.max,
			value: city.violentCrime
		},
		propertyCrime: {
			min: ranges.propertyCrime.min,
			max: ranges.propertyCrime.max,
			value: city.propertyCrime
		},
		happiness: {
			min: ranges.happiness.min,
			max: ranges.happiness.max,
			value: city.happiness
		},
		job: {
			averageAnnualSalary: {
				min: ranges.job.averageAnnualSalary.min,
				max: ranges.job.averageAnnualSalary.max,
				value: city.job.averageAnnualSalary
			},
			totalJobs: {
				min: ranges.job.totalJobs.min,
				max: ranges.job.totalJobs.max,
				value: city.job.totalJobs
			},
		}
	}
}

interface LoadedCityCardProps {
	cityId: string;
	addCity: Function;
	ranges: Ranges;
}

function LoadedCityCard({ cityId, addCity, ranges }: LoadedCityCardProps) {
	const [status, setStatus] = useState<Status>('loading');
	const [city, setCity] = useState<CityWithDetails>();
	const jobTitle = useSelector(selectJob);
	const { loading, error, data } = useQuery(CITY_DATA_BY_ID, { variables: { id: cityId, title: jobTitle } });
	useEffect(() => {
		if (loading) setStatus('loading');
		if (error) {
			console.error(error);
			setStatus('error');
		}
		if (data && data.city) {
			addCity(data.city);
			setCity(data.city);
			setStatus('complete');
		}
	}, [loading, error, data, addCity]);
	const formattedCity = city ? formatCity(city, ranges) : undefined;
	const cityFullName = formattedCity ? formattedCity.fullName : 'Loading...';
	const indicator = (
		<div className={styles.indicatorWrapper} >
			<div className={styles.indicatorParent} >
				<StatusIndicator status={status} showComplete={false} />
			</div>
		</div>
	);
	return (
		<>
			{!formattedCity && indicator}
			<Blanker blank={!formattedCity}>
				<div className={styles.cardHeader}>
					<h2 className={styles.cityName} >{cityFullName}</h2>
				</div>
				<CityCardData city={formattedCity} />
			</Blanker>
		</>
	);
}

interface CityCardDataProps {
	city?: FormattedCity;
	ranges?: Ranges;
	empty?: boolean;
}

function CityCardData({ city, empty }: CityCardDataProps) {
	empty = empty === undefined ? false : true;
	const defaultValue = empty ? '???' : 'No Data';
	const adjustedMonthlyCOL = useSelector(selectAdjustedMonthlyCOL);
	return (
		<>
			<div>
				<div>
					<div>Population: {city?.population.value ? city.population.value.toLocaleString('en-US', { useGrouping: true }) : defaultValue}</div>
					<StatBar
						outerColor={'hsl(0, 0%, 90%)'}
						innerColor={'#0067a7'}
						min={city && city.population.min ? city.population.min : 0}
						value={city && city.population.value ? city.population.value : 0}
						max={city && city.population.max ? city.population.max : 0}
					/>
				</div>
				<div>
					<div>Cost of Living: {city?.costOfLiving.value ? Math.round(city.costOfLiving.value * adjustedMonthlyCOL).toLocaleString('en-US', { style: 'currency', currency: 'USD', useGrouping: true, minimumFractionDigits: 0 }) : defaultValue}</div>
					<StatBar
						outerColor={'hsl(0, 0%, 90%)'}
						innerColor={'#e97600'}
						min={city && city.costOfLiving.min ? city.costOfLiving.min : 0}
						value={city && city.costOfLiving.value ? city.costOfLiving.value : 0}
						max={city && city.costOfLiving.max ? city.costOfLiving.max : 0}
					/>
				</div>
				<div>
					<div>Violent Crime: {city?.violentCrime.value ? city.violentCrime.value.toLocaleString('en-US', { useGrouping: true }) : defaultValue}</div>
					<StatBar
						outerColor={'hsl(0, 0%, 90%)'}
						innerColor={'#bd1e24'}
						min={city && city.violentCrime.min ? city.violentCrime.min : 0}
						value={city && city.violentCrime.value ? city.violentCrime.value : 0}
						max={city && city.violentCrime.max ? city.violentCrime.max : 0}
					/>
				</div>
				<div>
					<div>Property Crime: {city?.propertyCrime.value ? city.propertyCrime.value.toLocaleString('en-US', { useGrouping: true }) : defaultValue}</div>
					<StatBar
						outerColor={'hsl(0, 0%, 90%)'}
						innerColor={'#bd1e24'}
						min={city && city.propertyCrime.min ? city.propertyCrime.min : 0}
						value={city && city.propertyCrime.value ? city.propertyCrime.value : 0}
						max={city && city.propertyCrime.max ? city.propertyCrime.max : 0}
					/>
				</div>
				<div>
					<div>Happiness: {city?.happiness.value ? city.happiness.value.toLocaleString('en-US', { useGrouping: true }) : defaultValue}</div>
					<StatBar
						outerColor={'hsl(0, 0%, 90%)'}
						innerColor={'#007256'}
						min={city && city.happiness.min ? city.happiness.min : 0}
						value={city && city.happiness.value ? city.happiness.value : 0}
						max={city && city.happiness.max ? city.happiness.max : 0}
					/>
				</div>
			</div>
			<div>
				<div>
					<div>Annual Salary: {city?.job.averageAnnualSalary.value ? city.job.averageAnnualSalary.value.toLocaleString('en-US', { style: 'currency', currency: 'USD', useGrouping: true, minimumFractionDigits: 0 }) : defaultValue}</div>
					<StatBar
						outerColor={'hsl(0, 0%, 90%)'}
						innerColor={'#964f8e'}
						min={city && city.job.averageAnnualSalary.min ? city.job.averageAnnualSalary.min : 0}
						value={city && city.job.averageAnnualSalary.value ? city.job.averageAnnualSalary.value : 0}
						max={city && city.job.averageAnnualSalary.max ? city.job.averageAnnualSalary.max : 0}
					/>
				</div>
				<div>
					<div>Available Jobs: {city?.job.totalJobs.value ? city.job.totalJobs.value.toLocaleString('en-US', { useGrouping: true }) : defaultValue}</div>
					<StatBar
						outerColor={'hsl(0, 0%, 90%)'}
						innerColor={'#964f8e'}
						min={city && city.job.totalJobs.min ? city.job.totalJobs.min : 0}
						value={city && city.job.totalJobs.value ? city.job.totalJobs.value : 0}
						max={city && city.job.totalJobs.max ? city.job.totalJobs.max : 0}
					/>
				</div>
			</div>
		</>
	);
}

interface CityDataValue {
	value: number;
	min: number;
	max: number;
	innerColor?: string;
	outerColor?: string;
}

function StatBar({ value, min, max, innerColor, outerColor }: CityDataValue) {
	const outerColorScheme = {
		backgroundColor: outerColor
	}
	const innerColorScheme = {
		backgroundColor: innerColor,
		width: Math.max((value - min) / (max - min) * 100, 0) + '%'
	}
	return (
		<div className={styles.barOuter} style={outerColorScheme}>
			<div className={styles.barInner} style={innerColorScheme}>
			</div>
		</div>
	);
}