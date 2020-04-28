import React, { useState, useCallback } from 'react';
import styles from './CityCards.module.css';
import { CityCard } from './CityCard';
import { CityWithDetails, Ranges } from '../../types';

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

function calculateRanges(cities: CityWithDetails[]): Ranges {
	const [populationMin, populationMax] = getAdjustedMinMax(cities.map(city => city.population));
	const [costOfLivingsMin, costOfLivingsMax] = getAdjustedMinMax(cities.map(city => city.costOfLiving));
	const [crimeMin, crimeMax] = getAdjustedMinMax([...cities.map(city => city.violentCrime), ...cities.map(city => city.propertyCrime)]);
	const [happinessMin, happinessMax] = getAdjustedMinMax(cities.map(city => city.happiness));
	const [averageAnnualSalaryMin, averageAnnualSalaryMax] = getAdjustedMinMax(cities.map(city => city.job.averageAnnualSalary));
	const [totalJobsMin, totalJobsMax] = getAdjustedMinMax(cities.map(city => city.job.totalJobs));
	return {
		population: {
			min: populationMin,
			max: populationMax
		},
		costOfLiving: {
			min: costOfLivingsMin,
			max: costOfLivingsMax
		},
		violentCrime: {
			min: crimeMin,
			max: crimeMax
		},
		propertyCrime: {
			min: crimeMin,
			max: crimeMax
		},
		happiness: {
			min: happinessMin,
			max: happinessMax
		},
		job: {
			averageAnnualSalary: {
				min: averageAnnualSalaryMin,
				max: averageAnnualSalaryMax
			},
			totalJobs: {
				min: totalJobsMin,
				max: totalJobsMax
			},
		}
	}

}

export function CityCards() {
	const [cityIds, setCityIds] = useState<string[]>([]);
	const [cities, setCities] = useState<CityWithDetails[]>([]);
	const [cards, setCards] = useState<number[]>([]);
	const [cardCount, setCardCount] = useState<number>(0);
	const addCityId = (nCityId: string) => setCityIds(cityIds => [...cityIds, nCityId]);
	const addCity = useCallback((nCity: CityWithDetails) => setCities(cities => cities.filter(city => city.id !== nCity.id).concat(nCity)), []);
	const removeCity = useCallback((xCityId: string) => {
		setCityIds(cityIds => cityIds.filter(cityId => cityId !== xCityId));
		setCities(cities => cities.filter(city => city.id !== xCityId));
	}, []);
	const incrementCardCount = () => setCardCount(cardCount => cardCount + 1);
	const addCard = () => {
		setCards(cards => [...cards, cardCount]);
		incrementCardCount();
	}
	const removeCard = (id: number) => setCards(cards => cards.filter(card => card !== id));
	return (
		<div className={styles.container} >
			{
				cards.map(card => (
					<CityCard
						key={card}
						addCityId={addCityId}
						addCity={addCity}
						removeCity={removeCity}
						cityIds={cityIds}
						ranges={calculateRanges(cities)}
						removeSelf={() => () => removeCard(card)}
					/>
				))
			}
			<button onClick={() => addCard()} >Click Me</button>
		</div>
	);
}