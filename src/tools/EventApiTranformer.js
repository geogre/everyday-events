const EventApiTranformer = {
	toApi: (eventFromForm) => {
		let apiEvent = {
			...eventFromForm,
			description: eventFromForm.description.replace(/(?:\r\n|\r|\n)/g, '\\n')
		};
		return apiEvent;
	}
}

export default EventApiTranformer;