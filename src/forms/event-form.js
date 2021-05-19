const eventForm = {
    id: {
        elementType: 'hidden',
        elementConfig: {
            type: 'text'
        },
        validation: {
            required: false
        },
        valid: true,
        touched: false,
        label: 'Event',
        value: ''
    },
    title: {
        elementType: 'input',
        elementConfig: {
            type: 'text'
        },
        validation: {
            required: true
        },
        valid: false,
        touched: false,
        label: 'Title',
        value: ''
    },
    date: {
        elementType: 'datepicker',
        elementConfig: {
            type: 'text'
        },
        validation: {
            required: false
        },
        label: 'Date',
        valid: true,
        touched: false,
        value: ''
    },
    description: {
        elementType: 'textarea',
        elementConfig: {
            type: 'text'
        },
        validation: {
            required: true
        },
        label: 'Description',
        valid: false,
        touched: false,
        value: ''
    }
};
export default eventForm;
