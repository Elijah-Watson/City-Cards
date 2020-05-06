import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCard, selectCards } from '../city-cards/cityCardsSlice';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import classNames from 'classnames';
import styles from './AddCardButton.module.css';

import { FilePlus } from 'react-feather';


interface CityWithOnlyId {
	id: number;
}

interface CitiesWithOnlyIdData {
	cities: CityWithOnlyId[];
}

const CITIES_WITH_ONLY_ID = gql`
	query CitiesWithOnlyId {
		cities {
			id
		}
	}
`;

export function AddCardButton() {
	const { data } = useQuery<CitiesWithOnlyIdData>(CITIES_WITH_ONLY_ID);
	const dispatch = useDispatch();
	const cards = useSelector(selectCards);
	const citiesCount = data?.cities.length || 1;
	const clickHandler = () => {
		if (cards.length < citiesCount) dispatch(addCard());
	}

	return <button onClick={clickHandler} className={classNames(styles.button, { [styles.disabled]: cards.length >= citiesCount })} > <FilePlus color='hsl(0, 0%, 90%)' className={styles.buttonIcon} /> </button>;
}