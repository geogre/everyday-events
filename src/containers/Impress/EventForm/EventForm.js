import DatePicker from 'react-date-picker';
import { useState } from "react";
import moment from "moment";

function EventForm(props) {
	const [id] = useState(props.id ?? '');
	const [title, setTitle] = useState(props.title ?? '');
	const [description, setDescription] = useState(props.description ?? '');
	const [video, setVideo] = useState(props.video ?? '');
	const [date, setDate] = useState(props.date ?? '');
	const [isPrivate, setIsPrivate] = useState(props.isPrivate === 'true');

	const onSubmitHander = (e) => {
		e.preventDefault();
		props.onSubmit({id, title, description, date, video, isPrivate});
	};

	const dateChangeHandler = (currentDate) => {
		const theDate = moment(currentDate);
		setDate(theDate.format('YYYY-MM-DD'));
	}

	return (
		<form className="EventForm" onSubmit={onSubmitHander}>
			<div>
				<div className="form-group Input">
					<label className="Label">Title</label>
					<input className="InputElement" name="title" type="text" value={title}  onChange={e => setTitle(e.target.value)} />
				</div>
				<div className="form-group Input ">
					<label className="Label">Date</label>
					<DatePicker
						clearIcon={null}
						format="y-MM-dd"
						className={"form-control Input"}
						onChange={dateChangeHandler}
						value={date === '' ? new Date() : new Date(date)}
					/>
				</div>
				<div className="form-group Input ">
					<label className="Label">Description</label>
					<textarea className="InputElement TextArea" name="description" type="text"  value={description} onChange={e => setDescription(e.target.value)}></textarea></div>
				<div className="form-group Input ">
					<label className="Label">Video</label>
					<textarea className="InputElement TextArea" name="video" type="text"  value={video} onChange={e => setVideo(e.target.value)}></textarea></div>
				<div className="form-group Input ">
					<input name="isprivate" type="checkbox" checked={isPrivate} onClick={e => setIsPrivate(e.target.checked)} />&nbsp;<label className="Label">Is Private</label>
				</div>
				<div className="buttons-block">
					<button type="submit" className="button button-action">{props.submitBtnCaption}</button>
					<button type="button" className="button" onClick={props.onCancel}>Cancel</button>
				</div>
			</div>
		</form>
	);
};

export default EventForm;