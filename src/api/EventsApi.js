import {API, Auth} from "aws-amplify";
import config from './config';
import {FULL_DATE} from "../tools/formatter";
import EventApiTranformer from '../tools/EventApiTranformer';

// TODO Why this doesn't work?
// async function requestData() {
//     return { // OPTIONAL
//         headers: { Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}` },
//         response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
//         queryStringParameters: {}
//     }
// }

const EventsApi = {
    async getEvents(startDate, endDate)
    {
        return API.get(config.apiName, config.basePath, { // OPTIONAL
            headers: { Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}` },
            response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
            queryStringParameters: {from: startDate.format(FULL_DATE), to: endDate.format(FULL_DATE)}
        }).then(response => response).catch(error => {
            console.log('Error', error);
        });
    },

    async getEvent(id)
    {
        console.log('getting event');
        let path = config.basePath + id;
        return API.get(config.apiName, path, { // OPTIONAL
            headers: { Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}` },
            response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
            queryStringParameters: {}
        }).then(response => response).catch(error => {
            console.log(error.response)
        });
    },

    async deleteEvent(id)
    {
        let path = config.basePath + id;
        return API.del(config.apiName, path, { // OPTIONAL
            headers: { Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}` },
            response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
            queryStringParameters: {}
        }).then(response => response).catch(error => {
            console.log(error.response)
        });
    },

    async updateEvent(currentEvent)
    {
        let path = config.basePath + currentEvent.id;
        let apiEvent = EventApiTranformer.toApi(currentEvent);
        let myInit = { // OPTIONAL
            headers: { Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}` },
            response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
            body: apiEvent,
        };
        return API.put(config.apiName, path, myInit).then(response => response).catch(error => {
            console.log(error.response)
        }).catch(error => {
            //TODO catch
        });
    },

    async addEvent(newEvent)
    {
        let apiEvent = EventApiTranformer.toApi(newEvent);
        let myInit = { // OPTIONAL
            headers: { Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}` },
            response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
            body: apiEvent,

        };
        return API.post(config.apiName, config.basePath, myInit).then(response => response).catch(error => {
            console.log(error.response)
        }).catch(error => {
            //TODO catch
        });
    },

    async getUserEvent(userId, eventId)
    {
        let path = config.basePath + 'events/' + userId + '/' + eventId;
        return API.get(config.apiName, path, { // OPTIONAL
            headers: { },
            response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
            queryStringParameters: {}
        }).then(response => response).catch(error => {
            console.log(error.response)
        });
    },
}
export default EventsApi;
