import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCards, removeCard } from './cityCardsSlice';
import { CityCard } from './CityCard';
import styles from './CityCards.module.css';

export function CityCards() {
	const dispatch = useDispatch();
	const cards = useSelector(selectCards);
	const [cityIds, setCityIds] = useState<string[]>([]);
	const addCityId = (nCityId: string) => setCityIds(cityIds => [...cityIds, nCityId]);
	const removeCityId = useCallback((xCityId: string) => setCityIds(cityIds => cityIds.filter(cityId => cityId !== xCityId)),[]);
	return (
		<div className={styles.container} >
			{
				cards.map(card => (
					<CityCard
						key={card}
						addCityId={addCityId}
						removeCityId={removeCityId}
						cityIds={cityIds}
						removeSelf={() => () => dispatch(removeCard({ id: card }))}
					/>
				))
			}
		</div>
	);
}