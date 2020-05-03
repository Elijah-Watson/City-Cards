import React, { useState, useEffect } from 'react';
import styles from './CityCard.module.css';
import { useSelector } from 'react-redux';
import { selectJob, selectAdjustedMonthlyCOL } from '../personal/personalSlice';
import { SearchableSelect } from '../../helpers/searchable-select/SearchableSelect';
import { Blanker } from '../../helpers/blanker/Blanker';
import { StatusIndicator } from '../../helpers/status-indicator/StatusIndicator';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { queryResponsetoStatus } from '../../helpers/status-indicator/queryResponseToStatus';
import { City, Status, FormattedCity, CityWithDetailsandRanges } from '../../types';

import { XCircle } from 'react-feather';

interface CityCardProps {
	addCityId: Function;
	removeCityId: Function;
	cityIds: string[];
	removeSelf: Function;
}

export function CityCard({ addCityId, removeCityId, cityIds, removeSelf }: CityCardProps) {
	const [newCard, setNewCard] = useState<boolean>(true);
	const [currentCityId, setCurrentCityId] = useState<string>('');
	const handleChange = (cityId: string) => {
		setNewCard(false);
		setCurrentCityId(cityId);
		addCityId(cityId);
	}
	useEffect(() => () => removeCityId(currentCityId), [currentCityId, removeCityId]);
	return newCard ? <NewCityCard cityIds={cityIds} handleChange={handleChange} removeSelf={removeSelf} /> : <LoadedCityCard cityId={currentCityId} removeSelf={removeSelf} />;
}

interface CitiesData {
	cities: City[];
}

const CITIES = gql`
	query Cities {
		cities {
			id
			name
			state {
				code
			}
		}
	}
`;

interface NewCityCardProps {
	cityIds: string[];
	handleChange: Function;
	removeSelf: Function;
}

function NewCityCard({ cityIds, handleChange, removeSelf }: NewCityCardProps) {
	const { loading, error, data } = useQuery<CitiesData>(CITIES);
	const status = queryResponsetoStatus(loading, error);
	const cityList = data?.cities ? data.cities
						.filter((city: City) => !cityIds.includes(city.id))
						.map((city: City) => ({ value: city.id, text: city.name + ', ' + city.state.code })) : [];

	return (
		<div className={styles.card} >
			{!cityList.length && <LargeIndicator status={status} />}
			<Blanker blank={!cityList.length} >
				<button onClick={removeSelf()} className={styles.button}><XCircle color='hsl(0, 0%, 90%)' /></button>
				<div className={styles.cardHeader}>
					<div className={styles.formItem}>
						<SearchableSelect options={cityList} handleChange={handleChange} buttonText="Choose a city..." />
					</div>
				</div>
				<CityCardData empty={true} />
			</Blanker>
		</div>
	)
}

function formatCity(city: CityWithDetailsandRanges): FormattedCity {
	return {
		fullName: city.name + ', ' + city.state.code,
		population: {
			min: 0,
			max: city.populationRange.max,
			value: city.population
		},
		costOfLiving: {
			min: city.costOfLivingRange.min,
			max: city.costOfLivingRange.max,
			value: city.costOfLiving
		},
		violentCrime: {
			min: 0,
			max: Math.max(city.violentCrimeRange.max, city.propertyCrimeRange.max),
			value: city.violentCrime
		},
		propertyCrime: {
			min: 0,
			max: Math.max(city.violentCrimeRange.max, city.propertyCrimeRange.max),
			value: city.propertyCrime
		},
		happiness: {
			min: city.happinessRange.min,
			max: city.happinessRange.max,
			value: city.happiness
		},
		job: {
			averageAnnualSalary: {
				min: city.job.averageAnnualSalaryRange.min,
				max: city.job.averageAnnualSalaryRange.max,
				value: city.job.averageAnnualSalary
			},
			totalJobs: {
				min: 0,
				max: city.job.totalJobsRange.max,
				value: city.job.totalJobs
			},
		}
	}
}

interface CityWithDetailsAndRangesQueryData {
	city: CityWithDetailsandRanges;
}

interface CityWithDetailsAndRangesQueryVars {
	id: string;
	title: string;
}

const CITY_WITH_DETAILS_AND_RANGES = gql`
	query CityDataByID($id: ID!, $title: String!) {
    	city(input: {id: $id}) {
      		id
			name
			state {
				name
				code
			}
			population
			populationRange {
				min
				max
			}
			costOfLiving
			costOfLivingRange {
				min
				max
			}
			violentCrime
			violentCrimeRange {
				min
				max
			}
			propertyCrime
			propertyCrimeRange {
				min
				max
			}
			happiness
			happinessRange {
				min
				max
			}
			job(title: $title) {
				title
				averageAnnualSalary
				averageAnnualSalaryRange {
					min
					max
				}
				totalJobs
				totalJobsRange {
					min
					max
				}
			}
    	}
  	}
`;

interface LoadedCityCardProps {
	cityId: string;
	removeSelf: Function;
}

function LoadedCityCard({ cityId, removeSelf }: LoadedCityCardProps) {
	const jobTitle = useSelector(selectJob);
	const { loading, error, data } = useQuery<CityWithDetailsAndRangesQueryData, CityWithDetailsAndRangesQueryVars>(CITY_WITH_DETAILS_AND_RANGES, { variables: { id: cityId, title: jobTitle } });
	const status = queryResponsetoStatus(loading, error);
	const formattedCity = data?.city ? formatCity(data.city) : undefined;
	const cityFullName = formattedCity ? formattedCity.fullName : 'Loading...';
	return (
		<div className={styles.card} >
			{!formattedCity && <LargeIndicator status={status} />}
			<Blanker blank={!formattedCity}>
				<SmallIndicator status={status} />
				<button onClick={removeSelf()} className={styles.button}><XCircle color='hsl(0, 0%, 90%)' /></button>
				<div className={styles.cardHeader} >
					<h2 className={styles.cityName} >{cityFullName}</h2>
				</div>
				<CityCardData city={formattedCity} />
			</Blanker>
		</div>
	);
}

interface LargeIndicatorPropTypes {
	status: Status;
}

function LargeIndicator({ status }: LargeIndicatorPropTypes) {
	return (
		<div className={styles.largeIndicatorWrapper} >
			<div className={styles.largeIndicatorParent} >
				<StatusIndicator status={status} showComplete={false} />
			</div>
		</div>
	)
}

interface SmallIndicatorPropTypes {
	status: Status;
}

function SmallIndicator({ status }: SmallIndicatorPropTypes) {
	return (
		<div className={styles.smallIndicatorParent} >
			<StatusIndicator status={status} showComplete={false} />
		</div>
	)
}

interface CityCardDataProps {
	city?: FormattedCity;
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

interface StatBarProps {
	value: number;
	min: number;
	max: number;
	innerColor?: string;
	outerColor?: string;
}

function StatBar({ value, min, max, innerColor, outerColor }: StatBarProps) {
	const outerColorScheme = {
		backgroundColor: outerColor
	}
	const innerColorScheme = {
		backgroundColor: innerColor,
		width: max - min > 0 ? Math.max((value - min) / (max - min) * 100, 0) + '%' : '0%'
	}
	return (
		<div className={styles.barOuter} style={outerColorScheme}>
			<div className={styles.barInner} style={innerColorScheme}>
			</div>
		</div>
	);
}