import React, { useState } from 'react';
import { PersonalFormButton } from './PersonalFormButton';
import { AddCardButton } from './AddCardButton';
import classNames from 'classnames';
import styles from './ActionButton.module.css';

import { Settings } from 'react-feather';

export function ActionButton() {
	const [active, setActive] = useState<boolean>(false);
	const toggleActive = () => setActive(active => !active);
	const deactivate = () => setActive(false);
	const otherButtonsClickHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		const target = e.target as Element;
		const buttons = Array.from(e.currentTarget.querySelectorAll('button'));
		const wasButtonClicked = buttons.find(button => button.contains(target));
		if (wasButtonClicked) deactivate();
	}
	return (
		<div className={classNames(styles.actionButtonWrapper, { [styles.active]: active })}>
			<button onClick={toggleActive} className={styles.button} > <Settings color='hsl(0, 0%, 90%)' className={styles.buttonIcon} /> </button>
			<div onClick={e => otherButtonsClickHandler(e)} className={styles.otherButtons} >
				<PersonalFormButton />
				<AddCardButton />
			</div>
		</div>
	);
}