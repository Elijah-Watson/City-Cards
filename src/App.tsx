import React from 'react';
import { Header } from './features/header/Header';
import { CityCards } from './features/city-cards/CityCards';
import { Personal } from './features/personal/Personal';
import './App.css';

function App() {
  return (
    <div className="App">
    	<Header />
		<CityCards />
		<Personal />
    </div>
  );
}

export default App;