import React from 'react';
import styles from './Header.module.css';
import logo from '../../logo.png';

export function Header() {
	return (
		<div className={styles.headerBar}>
			<span className={styles.siteTitle}>
				<img src={logo} alt='logo' className={styles.siteLogo} />
				<h1>City Cards</h1>
			</span>
		</div>
	);
}