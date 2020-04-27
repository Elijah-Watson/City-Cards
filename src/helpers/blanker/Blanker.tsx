import React from 'react';
import styles from './Blanker.module.css';

interface BlankerProps {
	blank: boolean;
	children: React.ReactNode;
}

export function Blanker({ blank, children }: BlankerProps) {
	return (
		<div className={blank ? styles.blank : ''}>
			{children}
		</div>
	)
}