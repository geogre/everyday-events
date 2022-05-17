import { Storage } from 'aws-amplify';

const EventsStorage = {
	listFiles: function (bucket) {
		return Storage.list(bucket) // for listing ALL files without prefix, pass '' instead
			.then(result => {
				return Promise.all(
					result.map(async r => {
						return {
							key: r.key,
							path: await Storage.get(r.key)
						}
					})
				);
			});
	}
};

export default EventsStorage;