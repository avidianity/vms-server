import { AxiosError, AxiosResponse } from 'axios';

export function getErrorResponse<T = any>(error: AxiosError): AxiosResponse<T> | null {
	if (error.response) {
		return error.response;
	}
	return null;
}
