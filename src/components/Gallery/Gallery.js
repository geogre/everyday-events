import EventsStorage from "../../storage/EventsStorage";
import {useEffect, useState} from "react";
import './Gallery.scss';
import config from "../../api/config";
import FullScreenDialog from "../FullScreenDialog/FullScreenDialog";
import {Image} from "@aws-amplify/ui-react";
import {ImageList, ImageListItem} from "@mui/material";

const Gallery = (props) => {
	const [items, setItems] = useState([]);
	const [currentImage, setCurrentImage] = useState();
	const [isFirst, setIsFirst] = useState(false);
	const [isLast, setIsLast] = useState(false);
	const bigImageId = 'big-image';

	const getItems = (path) => {
		EventsStorage.listFiles(path).then((imgItems) => {
			console.log(imgItems);
			setItems(imgItems);
		});
	}


	const setFirstAndLast = index => {
		let isFirst = false;
		let isLast = false;
		if (index === 0) {
			isFirst = true;
		}
		if (index === items.length - 1) {
			isLast = true;
		}
		setIsFirst(isFirst);
		setIsLast(isLast);
	}

	const showFullImage = (e) => {
		const path = e.target.getAttribute('data-href');
		const index = parseInt(e.target.getAttribute('data-index'));
		setCurrentImage({'path': path, 'index': index});
		setFirstAndLast(index);
	}

	const showPreviousImage = () => {
		const currentIndex = currentImage.index;
		const nextIndex = currentIndex > 0 ? currentIndex - 1 : 0;

		const currentItem = items[nextIndex];

		setCurrentImage({'path': currentItem.path, 'index': nextIndex});
		setFirstAndLast(nextIndex);
	}

	const showNextImage = () => {
		console.log(currentImage);
		const currentIndex = currentImage.index;
		const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : currentIndex;
		const currentItem = items[nextIndex];

		setCurrentImage({'path': currentItem.path, 'index': nextIndex});
		setFirstAndLast(nextIndex);
	}

	useEffect(() => {
		if (props.path) {
			getItems(props.path);
		}
	}, [EventsStorage.listFiles, props.path]);

	return (<div className="gallery">
		<FullScreenDialog currentImage={currentImage}
						  onClose={() => setCurrentImage(null)}
						  onPrev={() => showPreviousImage()}
						  onNext={() => showNextImage()}
						  isLast={isLast}
						  isFirst={isFirst}
		/>
		<ImageList variant="masonry" cols={4} gap={1}>
			{items.map((item, index) => (
				<ImageListItem key={item.img}>
					<Image onClick={showFullImage} data-href={item.path} data-index={index} src={config.thumbnailLambdaUrl + '?key=/public/' + item.key} alt={item.key} loading={"lazy"} />
				</ImageListItem>
			))}
		</ImageList>
	</div>)
};

export default Gallery;