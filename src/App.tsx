import React from 'react';
import { useSelector } from 'react-redux';
import { selectFormVisibility } from './features/personal/formVisibilitySlice';
import { Header } from './features/header/Header';
import { CityCards } from './features/city-cards/CityCards';
import { PersonalFormContainer } from './features/personal/PersonalForm';
import { ActionButton } from './features/action-button/ActionButton';
import './App.css';


function App() {
	const formVisibility = useSelector(selectFormVisibility);
	return (
		<div className="App">
			<Header />
			<CityCards />
			{formVisibility && <PersonalFormContainer />}
			<ActionButton />
		</div>
	);
}

export default App;