import {API} from "aws-amplify";
import config from './config-all-events';

const AllEventsApi = {
    async getByYears(userId)
    {
        return API.get(config.apiName, config.basePath + 'all', { // OPTIONAL
            response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
            queryStringParameters: {userId: userId}
        }).then(response => response).catch(error => {
            console.log('Error', error);
        });
    },

    async getByMonths(userId, year)
    {
        return API.get(config.apiName, config.basePath + 'year', { // OPTIONAL
            response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
            queryStringParameters: {userId: userId, year: year}
        }).then(response => response).catch(error => {
            console.log('Error', error);
        });
    },

    async getByDays(userId, year, month)
    {
        return API.get(config.apiName, config.basePath + 'month', { // OPTIONAL
            response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
            queryStringParameters: {userId: userId, year: year, month: month}
        }).then(response => response).catch(error => {
            console.log('Error', error);
        });
    },

    async getDay(userId, year, month, day)
    {
        return API.get(config.apiName, config.basePath + 'day', { // OPTIONAL
            response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
            queryStringParameters: {userId: userId, year: year, month: month, day: day}
        }).then(response => response).catch(error => {
            console.log('Error', error);
        });
    }
}
export default AllEventsApi;
