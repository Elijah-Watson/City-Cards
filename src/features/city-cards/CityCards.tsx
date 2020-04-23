import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectJob, selectAdjustedMonthlyCOL } from '../personal/personalSlice';
import styles from './CityCards.module.css';
import { CityCard } from './CityCard';
import { NewCityCard } from './NewCityCard';
import { useQuery } from '@apollo/react-hooks';
import { CITY_DATA } from '../../queries';
import { CityWithDetails } from '../../types';

export function CityCards() {
	const [cityIds, setCityIds] = useState<string[]>([]);
	const addCity = (cityId: string) => setCityIds(cityIds => [...cityIds, cityId]);
	const removeCity = (cityId: string) => setCityIds(cityIds => cityIds.filter(city => city !== cityId));
	const cardsContainer = cityIds.length > 0 ? <CardsContainer cityIds={cityIds} removeCity={removeCity} /> : null;
	return (
		<div className={styles.container}>
			{cardsContainer}
			<NewCityCard existingCityIds={cityIds} handleChange={addCity} />
		</div>
	);
}

function getAdjustedMinMax(values: number[], scale?: number): [number, number] {
	values = values.filter(values => !!values);
	switch (values.length) {
		case 1:
			scale = 0.5;
			break;
		case 2:
			scale = 0.4;
			break;
		case 3:
			scale = 0.2;
			break;
		case 4:
			scale = 0.1;
			break;
		default:
			scale = 0.05;
	}
	const min = Math.min(...values);
	const max = Math.max(...values);
	const range = max - min || 1;
	const buffer = range * scale > min ? min : range * scale;
	const adjustedMin = min - buffer;
	const adjustedMax = max + buffer;
	return [adjustedMin, adjustedMax];
}

interface CardsContainerProps {
	cityIds: string[];
	removeCity: Function;
}

function CardsContainer({ cityIds, removeCity }: CardsContainerProps) {
	const jobTitle = useSelector(selectJob);
	const adjustedMonthlyCOL = useSelector(selectAdjustedMonthlyCOL);
	const [citiesData, setCitiesData] = useState<CityWithDetails[]>([]);
	const { error, data } = useQuery(CITY_DATA, { variables: { ids: cityIds, title: jobTitle } });
	useEffect(() => {
		if (error) console.error(error);
		if (data && data.cities) setCitiesData(data.cities);
	}, [error, data]);
	const cities = citiesData
					.filter(city => cityIds.includes(city.id))
					.sort((a, b) => cityIds.indexOf(a.id) - cityIds.indexOf(b.id));
	const [populationMin, populationMax] = getAdjustedMinMax(cities.map(city => city.population));
	const [costOfLivingsMin, costOfLivingsMax] = getAdjustedMinMax(cities.map(city => city.costOfLiving * adjustedMonthlyCOL));
	const [crimeMin, crimeMax] = getAdjustedMinMax([...cities.map(city => city.violentCrime), ...cities.map(city => city.propertyCrime)]);
	const [happinessMin, happinessMax] = getAdjustedMinMax(cities.map(city => city.happiness));
	const [averageAnnualSalaryMin, averageAnnualSalaryMax] = getAdjustedMinMax(cities.map(city => city.job.averageAnnualSalary));
	const [totalJobsMin, totalJobsMax] = getAdjustedMinMax(cities.map(city => city.job.totalJobs));
	return (
		<>
			{
				cities.map(city => (
					<CityCard
						key={city.id}
						cityFullName={city.name + ', ' + city.state.code}
						removeSelf={() => () => removeCity(city.id)}
						cityData={{
							population: {
								min: populationMin,
								max: populationMax,
								value: city.population,
								innerColor: '#0067a7'
							},
							costOfLiving: {
								min: costOfLivingsMin,
								max: costOfLivingsMax,
								value: Math.round(city.costOfLiving * adjustedMonthlyCOL),
								innerColor: '#e97600'
							},
							violentCrime: {
								min: crimeMin,
								max: crimeMax,
								value: city.violentCrime,
								innerColor: '#bd1e24'
							},
							propertyCrime: {
								min: crimeMin,
								max: crimeMax,
								value: city.propertyCrime,
								innerColor: '#bd1e24'
							},
							happiness: {
								min: happinessMin,
								max: happinessMax,
								value: city.happiness,
								innerColor: '#007256'
							},
							annualSalary: {
								min: averageAnnualSalaryMin,
								max: averageAnnualSalaryMax,
								value: city.job.averageAnnualSalary,
								innerColor: '#964f8e'
							},
							availableJobs: {
								min: totalJobsMin,
								max: totalJobsMax,
								value: city.job.totalJobs,
								innerColor: '#964f8e'
							}
						}}
					/>
				))
			}
		</>
	)
}