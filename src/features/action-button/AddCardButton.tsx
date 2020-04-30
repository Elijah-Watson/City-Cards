import React from 'react';
import { useDispatch } from 'react-redux';
import { addCard } from '../city-cards/cityCardsSlice';
import styles from './ActionButton.module.css';

import { FilePlus } from 'react-feather';

export function AddCardButton() {
	const dispatch = useDispatch();
	const clickHandler = () => dispatch(addCard());
	return <button onClick={clickHandler} className={styles.button} > <FilePlus color='hsl(0, 0%, 90%)' className={styles.buttonIcon} /> </button>;
}