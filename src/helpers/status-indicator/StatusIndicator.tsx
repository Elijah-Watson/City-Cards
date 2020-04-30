import React from 'react';
import styles from './StatusIndicator.module.css';
import classNames from 'classnames';
import { Status } from '../../types';

import { RefreshCcw, AlertOctagon, CheckCircle } from 'react-feather';

interface StatusIndicatorProps {
	status: Status;
	showComplete?: boolean;
	color?: string;
}

export function StatusIndicator({ status, showComplete, color }: StatusIndicatorProps) {
	return status === Status.Loading ? <LoadingIndicator color={color} /> :
		status === Status.Error ? <ErrorIndicator color={color} /> : 
			showComplete ? <CompleteIndicator color={color} />:
			null;
}

interface IndicatorProps {
	color?: string;
}

function LoadingIndicator({ color }: IndicatorProps) {
	return <RefreshCcw color={color} className={classNames(styles.indicator, styles.loading)} />
}

function CompleteIndicator({ color }: IndicatorProps) {
	return <CheckCircle color={color || 'green'} className={styles.indicator} />
}

function ErrorIndicator({ color }: IndicatorProps) {
	return <AlertOctagon color={color || 'red'} className={styles.indicator} />
}