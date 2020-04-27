import React, { useState, useEffect, useRef } from 'react';
import styles from './SearchableSelect.module.css';
import classNames from 'classnames';

interface Option {
	value: string;
	text: string;
}

interface SearchableSelectProps {
	options: Option[];
	handleChange: Function;
	initialOption?: Option;
	buttonText?: string;
	buttonValue?: string;
	id?: string;
}

export function SearchableSelect({ options, handleChange, initialOption, buttonText, buttonValue, id }: SearchableSelectProps) {
	const csParent = useRef<HTMLDivElement>(null);
	const [status, setStatus] = useState(false);
	const [current, setCurrent] = useState(initialOption || { text: 'Select an option...', value: '' });
	const [currentSearch, setCurrentSearch] = useState('');
	const closeDropdown = () => {
		setCurrentSearch('');
		setStatus(false);
	}
	const openDropdown = () => setStatus(true);
	const onButtonClick = () => status ? closeDropdown() : openDropdown();
	const searchChange = (e: React.ChangeEvent<HTMLInputElement>) => setCurrentSearch(e.target.value);
	const optionClick = (e: React.MouseEvent<HTMLLIElement, MouseEvent>, option: Option) => {
		e.preventDefault();
		setCurrent(option);
		handleChange(option.value);
		closeDropdown();
	}
	const buttonValueOption = options.find(option => option.value === buttonValue);
	const buttonTextFinal = buttonValueOption ? buttonValueOption.text : buttonText || current.text;
	const currentOptions = options.filter(option => option.text.toUpperCase().includes(currentSearch.toUpperCase()));
	const currentOptionsRender = currentOptions.map(currentOption => 
		(<li onClick={e => optionClick(e, currentOption)} key={currentOption.value} className={styles.csOption} title={currentOption.text}>{currentOption.text}</li>));
	const noResultsRender = (<li className={classNames(styles.csOption, styles.disabled)} title={"No results found..."}>{"No results found..."}</li>);
	const csDropdown = status ? (
		<div className={styles.csDropdown}>
			<input className={styles.csSearch} type="text" value={currentSearch} onChange={searchChange} placeholder="Search..." />
			<ul className={styles.csOptions}>
				{currentOptions.length ? currentOptionsRender : noResultsRender}
			</ul>
		</div>
	) : null;
	useEffect(() => {
		const clickOutside = (e: MouseEvent) => {
			const target = e.target as Element;
			if (csParent.current && !csParent.current.contains(target)) closeDropdown();
		}
		window.addEventListener('mousedown', clickOutside);
		return () => {
			window.removeEventListener('mousedown', clickOutside);
		};
	}, [csParent]);
	return (
		<div className={styles.csParent} ref={csParent} id={id+'-parent'} >
			<button className={classNames(styles.csButton, { [styles.open]: status })} onClick={() => onButtonClick()} id={id} >{buttonTextFinal}</button>
			{csDropdown}
		</div>
	);
}