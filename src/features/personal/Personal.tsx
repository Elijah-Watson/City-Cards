import React, { useState } from 'react';
import { PersonalFormContainer } from './PersonalForm';
import styles from './Personal.module.css';

import { User } from 'react-feather';

export function Personal() {
	const [personalFormStatus, setPersonalFormStatus] = useState(false);
	const toggleFormStatus = () => setPersonalFormStatus(!personalFormStatus);
	const hideForm = () => setPersonalFormStatus(false);
	const personalForm = personalFormStatus ? <PersonalFormContainer hideForm={hideForm} /> : null;
	return (
		<div>
			<button className={styles.button} onClick={toggleFormStatus} ><User color='hsl(0, 0%, 90%)' className={styles.buttonIcon} /></button>
			{personalForm}
		</div>
	);
}
