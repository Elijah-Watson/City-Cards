import React from 'react';
import styles from './CityCard.module.css';

import { XCircle } from 'react-feather';

interface CityDataValue {
	value: number;
	min: number;
	max: number;
	innerColor?: string;
	outerColor?: string;
}

interface CityData {
	population: CityDataValue;
	costOfLiving: CityDataValue;
	violentCrime: CityDataValue;
	propertyCrime: CityDataValue;
	happiness: CityDataValue;
	annualSalary: CityDataValue;
	availableJobs: CityDataValue;
}

interface CityCardProps {
	cityFullName: string;
	cityData: CityData;
	removeSelf: Function;
}

export function CityCard({ cityFullName, cityData, removeSelf }: CityCardProps) {
	const defaultOuterColor = 'hsl(0, 0%, 90%)';
	const defaultInnerColor = '#FF4500';
	return (
		<div className={styles.card}>
			<div className={styles.cardHeader}>
				<h2 className={styles.cityName} >{cityFullName}</h2>
			</div>
			<div>
				<div>
					<div>Population: {cityData.population.value ? cityData.population.value.toLocaleString('en-US', { useGrouping: true }) : 'No Data'}</div>
					<StatBar
						outerColor={cityData.population.outerColor || defaultOuterColor}
						innerColor={cityData.population.innerColor || defaultInnerColor}
						min={cityData.population.min || 0}
						value={cityData.population.value || 0}
						max={cityData.population.max || 0}
					/>
				</div>
				<div>
					<div>Cost of Living: {cityData.costOfLiving.value ? cityData.costOfLiving.value.toLocaleString('en-US', { style: 'currency', currency: 'USD', useGrouping: true, minimumFractionDigits: 0 }) : 'No Data'}</div>
					<StatBar
						outerColor={cityData.costOfLiving.outerColor || defaultOuterColor}
						innerColor={cityData.costOfLiving.innerColor || defaultInnerColor}
						min={cityData.costOfLiving.min || 0}
						value={cityData.costOfLiving.value || 0}
						max={cityData.costOfLiving.max || 0}
					/>
				</div>
				<div>
					<div>Violent Crime: {cityData.violentCrime.value ? cityData.violentCrime.value.toLocaleString('en-US', { useGrouping: true }) : 'No Data'}</div>
					<StatBar
						outerColor={cityData.violentCrime.outerColor || defaultOuterColor}
						innerColor={cityData.violentCrime.innerColor || defaultInnerColor}
						min={cityData.violentCrime.min || 0}
						value={cityData.violentCrime.value || 0}
						max={cityData.violentCrime.max || 0}
					/>
				</div>
				<div>
					<div>Property Crime: {cityData.propertyCrime.value ? cityData.propertyCrime.value.toLocaleString('en-US', { useGrouping: true }) : 'No Data'}</div>
					<StatBar
						outerColor={cityData.propertyCrime.outerColor || defaultOuterColor}
						innerColor={cityData.propertyCrime.innerColor || defaultInnerColor}
						min={cityData.propertyCrime.min || 0}
						value={cityData.propertyCrime.value || 0}
						max={cityData.propertyCrime.max || 0}
					/>
				</div>
				<div>
					<div>Happiness: {cityData.happiness.value ? cityData.happiness.value.toLocaleString('en-US', { useGrouping: true }) : 'No Data'}</div>
					<StatBar
						outerColor={cityData.happiness.outerColor || defaultOuterColor}
						innerColor={cityData.happiness.innerColor || defaultInnerColor}
						min={cityData.happiness.min || 0}
						value={cityData.happiness.value || 0}
						max={cityData.happiness.max || 0}
					/>
				</div>
			</div>
			<div>
				<div>
					<div>Annual Salary: {cityData.annualSalary.value ? cityData.annualSalary.value.toLocaleString('en-US', { style: 'currency', currency: 'USD', useGrouping: true, minimumFractionDigits: 0 }) : 'No Data'}</div>
					<StatBar
						outerColor={cityData.annualSalary.outerColor || defaultOuterColor}
						innerColor={cityData.annualSalary.innerColor || defaultInnerColor}
						min={cityData.annualSalary.min || 0}
						value={cityData.annualSalary.value || 0}
						max={cityData.annualSalary.max || 0}
					/>
				</div>
				<div>
					<div>Available Jobs: {cityData.availableJobs.value ? cityData.availableJobs.value.toLocaleString('en-US', { useGrouping: true }) : 'No Data'}</div>
					<StatBar
						outerColor={cityData.availableJobs.outerColor || defaultOuterColor}
						innerColor={cityData.availableJobs.innerColor || defaultInnerColor}
						min={cityData.availableJobs.min || 0}
						value={cityData.availableJobs.value || 0}
						max={cityData.availableJobs.max || 0}
					/>
				</div>
			</div>
			<button onClick={removeSelf()} className={styles.button}><XCircle color='hsl(0, 0%, 90%)' /></button>
		</div>
	);
}

function StatBar({ value, min, max, innerColor, outerColor }: CityDataValue) {
	const outerColorScheme = {
		backgroundColor: outerColor
	}
	const innerColorScheme = {
		backgroundColor: innerColor,
		width: (value-min)/(max-min)*100 + '%'
	}
	return (
		<div className={styles.barOuter} style={outerColorScheme}>
			<div className={styles.barInner} style={innerColorScheme}>
			</div>
		</div>
	);
}