import React from 'react';
import styles from './Header.module.css';

import { Grid } from 'react-feather';

export function Header() {
	return (
		<div className={styles.headerBar}>
			<span className={styles.siteTitle}>
				<Grid className={styles.siteIcon} />
				<h1>City Cards</h1>
			</span>
		</div>
	);
}