import EventsStorage from "../../storage/EventsStorage";
import {useEffect, useState} from "react";
import './ReactImageGallery.scss';
import config from "../../api/config";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const ReactImageGallery = (props) => {
	const [items, setItems] = useState([]);

	const getItems = (path) => {
		EventsStorage.listFiles(path).then((imgItems) => {
			setItems(imgItems.map(item => {
				return {
					original: item.path,
					thumbnail: config.thumbnailLambdaUrl + '?key=/public/' + item.key
				}
			}));
		});
	}

	useEffect(() => {
		if (props.path) {
			getItems(props.path);
		}
	}, [EventsStorage.listFiles, props.path]);

	return (<div className={'gallery'}>{items ? <ImageGallery items={items} /> : 'Loading...'}</div>)
};

export default ReactImageGallery;