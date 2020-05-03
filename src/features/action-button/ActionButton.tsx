import React, { useState, useRef, useEffect } from 'react';
import { PersonalFormButton } from './PersonalFormButton';
import { AddCardButton } from './AddCardButton';
import classNames from 'classnames';
import styles from './ActionButton.module.css';

import { Settings } from 'react-feather';

export function ActionButton() {
	const actionButtonWrapper = useRef<HTMLDivElement>(null);
	const [active, setActive] = useState<boolean>(false);
	const toggleActive = () => setActive(active => !active);
	const deactivate = () => setActive(false);
	
	useEffect(() => {
		const clickOutside = (e: MouseEvent) => {
			const target = e.target as Element;
			if (actionButtonWrapper.current && !actionButtonWrapper.current.contains(target)) deactivate();
		}
		window.addEventListener('mousedown', clickOutside);
		return () => {
			window.removeEventListener('mousedown', clickOutside);
		};
	}, [actionButtonWrapper]);

	return (
		<div className={classNames({ [styles.active]: active })} ref={actionButtonWrapper} >
			<button onClick={toggleActive} className={styles.button} > <Settings color='hsl(0, 0%, 90%)' className={styles.buttonIcon} /> </button>
			<div className={styles.otherButtons} >
				<PersonalFormButton deactivateActiobButton={deactivate} />
				<AddCardButton />
			</div>
		</div>
	);
}