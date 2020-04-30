import { gql } from 'apollo-boost'
import { City, CityWithCOL, CityWithDetailsandRanges, Job } from './types';

export interface CityWithDetailsAndRangesQueryData {
	city: CityWithDetailsandRanges;
}

export interface CityWithDetailsAndRangesQueryVars {
	id: string;
	title: string;
}

export const CITY_WITH_DETAILS_AND_RANGES = gql`
	query CityDataByID($id: ID!, $title: String!) {
    	city(input: {id: $id}) {
      		id
			name
			state {
				name
				code
			}
			population
			populationRange {
				min
				max
			}
			costOfLiving
			costOfLivingRange {
				min
				max
			}
			violentCrime
			violentCrimeRange {
				min
				max
			}
			propertyCrime
			propertyCrimeRange {
				min
				max
			}
			happiness
			happinessRange {
				min
				max
			}
			job(title: $title) {
				title
				averageAnnualSalary
				averageAnnualSalaryRange {
					min
					max
				}
				totalJobs
				totalJobsRange {
					min
					max
				}
			}
    	}
  	}
`;

export interface CitiesData {
	cities: City[];
}

export const CITIES = gql`
	query Cities {
		cities {
			id
			name
			state {
				code
			}
		}
	}
`;

export interface JobTitlesAndCitiesData {
	jobs: Job[];
	cities: CityWithCOL[];
}

export const JOB_TITLES_AND_CITIES = gql`
	query JobTitlesAndCities {
		jobs {
			title
		}
		cities {
			id
			name
			state {
				code
			}
			costOfLiving
		}
	}
`;