import React from 'react';
import { SearchableSelect } from '../../helpers/searchable-select/SearchableSelect';
import { useQuery } from '@apollo/react-hooks';
import { CITIES } from '../../queries';
import styles from './NewCityCard.module.css';
import { City } from '../../types';

interface NewCityCardProps {
	existingCityIds: string[];
	handleChange: Function;
}

export function NewCityCard({ existingCityIds, handleChange }: NewCityCardProps) {
	const { loading, error, data } = useQuery(CITIES);

	let content = null;
	if (loading) content = <div>Loading...</div>;
	if (error) {
		content = <div>Error!</div>;
		console.error(error);
	}
	
	if (data) {
		const cities = loading ? [] : data.cities.filter((city: City) => !existingCityIds.includes(city.id));
		const cityOptions = cities.map((city: City) => ({ value: city.id, text: city.name + ', ' + city.state.code }));

		content = (
			<>
				<div className={styles.cardHeader}>
					<div className={styles.formItem}>
						<SearchableSelect options={cityOptions} handleChange={handleChange} buttonText="Choose a city..." />
					</div>
				</div>
				<div>
					<div>
						<div>Population: ???</div>
						<div className={styles.barOuter}>
							<div className={styles.barInner}>
							</div>
						</div>
					</div>
					<div>
						<div>Cost of Living: ???</div>
						<div className={styles.barOuter}>
							<div className={styles.barInner}>
							</div>
						</div>
					</div>
					<div>
						<div>Violent Crime: ???</div>
						<div className={styles.barOuter}>
							<div className={styles.barInner}>
							</div>
						</div>
					</div>
					<div>
						<div>Property Crime: ???</div>
						<div className={styles.barOuter}>
							<div className={styles.barInner}>
							</div>
						</div>
					</div>
					<div>
						<div>Happiness: ???</div>
						<div className={styles.barOuter}>
							<div className={styles.barInner}>
							</div>
						</div>
					</div>
				</div>
				<div>
					<div>
						<div>Annual Salary: ???</div>
						<div className={styles.barOuter}>
							<div className={styles.barInner}>
							</div>
						</div>
					</div>
					<div>
						<div>Available Jobs: ???</div>
						<div className={styles.barOuter}>
							<div className={styles.barInner}>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}

	return (
		<div className={styles.newCard}>
			{content}
		</div>
	);
}