export interface City {
	id: string;
	name: string;
	state: { code: string };
}

export interface CityWithCOL extends City {
	costOfLiving: number;
}

export interface CityWithDetails extends City {
	population: number;
	costOfLiving: number;
	violentCrime: number;
	propertyCrime: number;
	happiness: number;
	job: {
		averageAnnualSalary: number;
		totalJobs: number;
	};
}

export interface MinMaxValue {
	min: number;
	max: number;
	value: number;
}

export interface FormattedCity {
	fullName: string;
	population: MinMaxValue;
	costOfLiving: MinMaxValue;
	violentCrime: MinMaxValue;
	propertyCrime: MinMaxValue;
	happiness: MinMaxValue;
	job: {
		averageAnnualSalary: MinMaxValue;
		totalJobs: MinMaxValue;
	};
}

export interface Job {
	title: string;
}

export interface MinMax {
	min: number;
	max: number;
}

export interface Ranges {
	population: MinMax;
	costOfLiving: MinMax;
	violentCrime: MinMax;
	propertyCrime: MinMax;
	happiness: MinMax;
	job: {
		averageAnnualSalary: MinMax;
		totalJobs: MinMax;
	};
}

export type Status = 'loading' | 'complete' | 'error';