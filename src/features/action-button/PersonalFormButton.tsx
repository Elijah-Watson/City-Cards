import React from 'react';
import { useDispatch } from 'react-redux';
import { toggleForm } from '../personal/formVisibilitySlice';
import styles from './PersonalFormButton.module.css';

import { User } from 'react-feather';

interface PersonalFormButtonProps {
	deactivateActiobButton: Function;
}

export function PersonalFormButton({ deactivateActiobButton }: PersonalFormButtonProps) {
	const dispatch = useDispatch();
	const clickHandler = () => {
		deactivateActiobButton();
		dispatch(toggleForm());
	}
	return <button onClick={clickHandler} className={styles.button} ><User color='hsl(0, 0%, 90%)' className={styles.buttonIcon} /></button>;
}