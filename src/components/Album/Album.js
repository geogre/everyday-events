import EventsStorage from "../../storage/EventsStorage";
import { Storage } from 'aws-amplify';
import {useEffect, useState, useRef} from "react";
import config from '../../api/config';
import './Album.scss';
import {Image} from "@aws-amplify/ui-react";
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';

const Album = (props) => {
	const [items, setItems] = useState([]);
	const [selectedItems, setSelectedItems] = useState([]);
	const [addImageIsActive, setAddImageIsActive] = useState(false);
	const [imagesAreLoaded, setImagesAreLoaded] = useState(false);

	const [isUploading, setIsUploading] = useState(false);
	const [imagesProgress, setImagesProgress] = useState(0);

	const albumElementRef = useRef(null);

	let uploadedImagesSizes = [];
	let totalSize = 0;

	const selectItem = (item) => {
		setSelectedItems(prevState => [...prevState, item]);
	};

	const unselectItem = (deletedItem) => {
		setSelectedItems(prevState => prevState.filter(item => item !== deletedItem));
	};

	const toggleAddImageActivity = () => {
		setAddImageIsActive(addImageIsActive => !addImageIsActive);
	};

	const processSelect = event => {
		const imgEl = event.target;
		if(selectedItems.includes(imgEl.dataset.key)) {
			unselectItem(imgEl.dataset.key);
		} else {
			selectItem(imgEl.dataset.key);
		}
	}

	const getItems = (path) => {
		EventsStorage.listFiles(path).then((imgItems) => {
			console.log(imgItems);
			setItems(imgItems);
			setImagesAreLoaded(true);
		});
	}

	const deleteImagesHandler = () => {
		Promise.all(selectedItems.map(item => {
				return Storage.remove(item)
					.then(() => item)
					.catch(error => error);
		}))
			.then(deletedItems => {
				const filteredItems = items.filter(item => {
					return !selectedItems.includes(item.key);
				});
				setItems(filteredItems);
				setSelectedItems([]);
			})
	}

	const updateProgress = (index, loaded) => {
		//console.log(uploadedImagesSizes);
		uploadedImagesSizes[index] = loaded;
		const uploadedSum = uploadedImagesSizes.reduce((a, b) => a + b, 0);
		//console.log("Current data", uploadedSum, totalSize);
		setImagesProgress(Math.round( uploadedSum * 100 / totalSize));
	}

	const fileUploadHandler = e => {
		setIsUploading(true);
		//console.log('Setting total images', e.target.files.length);
		let promises = [];
		for(let i = 0; i < e.target.files.length; i++) {
			const file = e.target.files[i];
			const key = props.path + '/' + file.size + '-' + file.name;
			uploadedImagesSizes[i] = 0;
			totalSize += file.size;
			promises.push(Storage.put(key, file, {
				progressCallback:  (progress) => {
					updateProgress(i, progress.loaded);
					//console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
				},
				errorCallback: (err) => {
					console.error('Unexpected error while uploading', err);
				}
			}));
		}
		Promise.all(promises).then(() => {
			e.target.value = null;
			setAddImageIsActive(false);
			setIsUploading(false);
			getItems(props.path);
			uploadedImagesSizes = [];
			totalSize = 0;
			console.log('Everything is finished');
		})
	};

	useEffect(() => {
		if (props.path && props.eventIsLoaded) {
			getItems(props.path);
		}
	}, [props.path, props.eventIsLoaded]);

	useEffect(() => {
		let albumElement = null;
		if (albumElementRef.current) {
			albumElement = albumElementRef.current;
		}
		return () => {
			console.log("CLEANUP");
			if (albumElement) {
				console.log("CLEANUP ALBUM");
				albumElement.innerHtml = '';
				setItems([]);
			};
		}

	}, []);

	return (<div ref={albumElementRef} className="album">
		{items.length > 0 && props.eventIsLoaded && imagesAreLoaded ? items.map(item => {
			return <Image key={item.key} data-key={item.key} src={config.thumbnailLambdaUrl + '?key=/public/' + item.key} onClick={processSelect} className={selectedItems.includes(item.key) ? 'selected' : ''} alt='' />
			//return <img key={item.key} data-key={item.key} src={item.path} onClick={processSelect} className={selectedItems.includes(item.key) ? 'selected' : ''} alt='' />
		}) : ''}
		{!props.eventIsLoaded || !imagesAreLoaded ? <Box sx={{ width: '100%', padding: '10px 0'}}>
			<LinearProgress color="success" />
		</Box> : ''}
		{isUploading
			? <Box sx={{ width: '100%', padding: '10px 0'}}>
				<LinearProgress variant="determinate" value={imagesProgress} />
			</Box>
			: <div className={"buttons-block"}>
			<img alt={"Delete"} src={"/delete.png"} onClick={deleteImagesHandler} className={`${selectedItems.length > 0 ? "" : "hide"}`}></img>
			<form className={`${selectedItems.length > 0 ? "hide" : ""}`} name="uploadForm" encType="multipart/form-data">
				<div>
					<img alt={"Add"} src={"/add-image.png"} onClick={toggleAddImageActivity} />
					<input className={addImageIsActive ? "" : "hide"} id="uploadInput" type="file" name="myFiles" multiple onChange={fileUploadHandler} />
				</div>
			</form>
		</div>}
	</div>)
};

export default Album;