interface MinMax {
	min: number;
	max: number;
}

interface MinMaxValue extends MinMax {
	value: number;
}

export interface City {
	id: string;
	name: string;
	state: { code: string };
}

export interface CityWithCOL extends City {
	costOfLiving: number;
}

export interface Job {
	title: string;
}

interface JobWithDetails extends Job {
	averageAnnualSalary: number;
	totalJobs: number;
}

interface JobWithDetailsandRanges extends JobWithDetails {
	averageAnnualSalaryRange: MinMax;
	totalJobsRange: MinMax;
}

interface CityWithDetails extends City {
	population: number;
	costOfLiving: number;
	violentCrime: number;
	propertyCrime: number;
	happiness: number;
	job: JobWithDetails;
}

export interface CityWithDetailsandRanges extends CityWithDetails {
	populationRange: MinMax;
	costOfLivingRange: MinMax;
	violentCrimeRange: MinMax;
	propertyCrimeRange: MinMax;
	happinessRange: MinMax;
	job: JobWithDetailsandRanges;
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

export enum Status {
	Loading,
	Complete,
	Error
}