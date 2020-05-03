import React from 'react';
import { useDispatch } from 'react-redux';
import { toggleForm } from '../personal/formVisibilitySlice';
import styles from './PersonalFormButton.module.css';

import { User } from 'react-feather';

export function PersonalFormButton() {
	const dispatch = useDispatch();
	const clickHandler = () => dispatch(toggleForm());
	return <button onClick= { clickHandler } className = { styles.button } > <User color='hsl(0, 0%, 90%)' className = { styles.buttonIcon } /> </button>;
}