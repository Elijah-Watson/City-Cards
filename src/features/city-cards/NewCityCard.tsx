import React, { useState, useEffect } from 'react';
import { SearchableSelect } from '../../helpers/searchable-select/SearchableSelect';
import { StatusIndicator } from '../../helpers/status-indicator/StatusIndicator';
import { Blanker } from '../../helpers/blanker/Blanker';
import { useQuery } from '@apollo/react-hooks';
import { CITIES } from '../../queries';
import styles from './NewCityCard.module.css';
import { City, Status } from '../../types';

interface NewCityCardProps {
	existingCityIds: string[];
	handleChange: Function;
}

type CityList = { text: string; value: string }[];

export function NewCityCard({ existingCityIds, handleChange }: NewCityCardProps) {
	const { loading, error, data } = useQuery(CITIES);
	const [ status, setStatus ] = useState<Status>('loading');
	const [ cityList, setCityList ] = useState<CityList>([]);

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
					.filter((city: City) => !existingCityIds.includes(city.id))
					.map((city: City) => ({ value: city.id, text: city.name + ', ' + city.state.code }));
				setCityList(newCityList);
			}
		},
		[ loading, error, data, existingCityIds ]
	);

	return (
		<div className={styles.newCard}>
			<div className={styles.indicatorWrapper} >
				<div className={styles.indicatorParent} >
					<StatusIndicator status={status} showComplete={false} />
				</div>
			</div>
			<Blanker blank={!cityList.length} >
				<div className={styles.cardHeader}>
					<div className={styles.formItem}>
						<SearchableSelect options={cityList} handleChange={handleChange} buttonText="Choose a city..." />
					</div>
				</div>
				<div>
					<div>
						<div>Population: ???</div>
						<div className={styles.barOuter}>
							<div className={styles.barInner} />
						</div>
					</div>
					<div>
						<div>Cost of Living: ???</div>
						<div className={styles.barOuter}>
							<div className={styles.barInner} />
						</div>
					</div>
					<div>
						<div>Violent Crime: ???</div>
						<div className={styles.barOuter}>
							<div className={styles.barInner} />
						</div>
					</div>
					<div>
						<div>Property Crime: ???</div>
						<div className={styles.barOuter}>
							<div className={styles.barInner} />
						</div>
					</div>
					<div>
						<div>Happiness: ???</div>
						<div className={styles.barOuter}>
							<div className={styles.barInner} />
						</div>
					</div>
				</div>
				<div>
					<div>
						<div>Annual Salary: ???</div>
						<div className={styles.barOuter}>
							<div className={styles.barInner} />
						</div>
					</div>
					<div>
						<div>Available Jobs: ???</div>
						<div className={styles.barOuter}>
							<div className={styles.barInner} />
						</div>
					</div>
				</div>
			</Blanker>
		</div>
	);
}
