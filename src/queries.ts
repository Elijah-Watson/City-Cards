import { gql } from 'apollo-boost'

export const CITY_DATA = gql`
	query Cities($ids: [ID!], $title: String!) {
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

export const CITIES = gql`
	query {
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
	query {
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