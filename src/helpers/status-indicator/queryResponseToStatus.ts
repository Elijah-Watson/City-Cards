import { ApolloError } from 'apollo-boost';
import { Status } from '../../types';

export const queryResponsetoStatus = (loading: boolean, error: ApolloError | undefined): Status => {
	if (loading) {
		return Status.Loading;
	} else if (error) {
		console.log(error);
		return Status.Error;
	} else {
		return Status.Complete;
	}
}