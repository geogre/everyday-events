import * as actionCreators from "../../store/actions/actions";
import {connect} from "react-redux";
import {useEffect} from "react";
import EventsApi from "../../api/EventsApi";
import './ImagesStats.scss';

function ImagesStats(props) {
	const onGetImagesStats = props.onGetImagesStats;

	useEffect(() => {

		EventsApi.getImagesStats().then(response => {
			onGetImagesStats(response.data.imagesstats);
		} ).catch(error => {
			//TODO catch
		});

	}, [onGetImagesStats]);

	return (<div className={"imagesStats-container"}>
		Used: {props.imagesStats ? props.imagesStats.imagessize : '?'}
	</div>)
}

const mapStateToProps = state => {
	return {
		imagesStats: state.eventsData.imagesStats
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onGetImagesStats: (currentImagesStats) => dispatch(actionCreators.getImagesStats(currentImagesStats))
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(ImagesStats);