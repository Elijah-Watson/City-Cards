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
	job: { averageAnnualSalary: number; totalJobs: number};
	
}

export interface Job {
	title: string;
}

export type Status = 'loading' | 'complete' | 'error';