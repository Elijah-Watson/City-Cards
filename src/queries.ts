import { gql } from 'apollo-boost'

export const CITIES_DATA = gql`
	query CitiesData($ids: [ID!], $title: String!) {
    	cities(ids: $ids) {
      		id
			name
			state {
				name
				code
			}
			population
			costOfLiving
			violentCrime
			propertyCrime
			happiness
			job(title: $title) {
				title
				averageAnnualSalary
				totalJobs
			}
    	}
  	}
`;

export const CITY_DATA_BY_ID = gql`
	query CityDataByID($id: ID!, $title: String!) {
    	city(input: {id: $id}) {
      		id
			name
			state {
				name
				code
			}
			population
			costOfLiving
			violentCrime
			propertyCrime
			happiness
			job(title: $title) {
				title
				averageAnnualSalary
				totalJobs
			}
    	}
  	}
`;

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