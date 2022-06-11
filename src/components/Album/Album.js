import EventsStorage from "../../storage/EventsStorage";
import { Storage } from 'aws-amplify';
import {useEffect, useState} from "react";
import './Album.scss';
import {Image} from "@aws-amplify/ui-react";

const Album = (props) => {
	const [items, setItems] = useState([]);
	const [selectedItems, setSelectedItems] = useState([]);
	const [addImageIsActive, setAddImageIsActive] = useState(false);

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

	const fileUploadHandler = e => {
		for(let i = 0; i < e.target.files.length; i++) {
			const file = e.target.files[i];
			const key = props.path + '/' + file.name;
			Storage.put(key, file, {
				completeCallback: (event) => {
					console.log(`Successfully uploaded ${event.key}`);
				},
				progressCallback: (progress) => {
					console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
				},
				errorCallback: (err) => {
					console.error('Unexpected error while uploading', err);
				}
			}).then(() => {
				e.target.value = null;
				setAddImageIsActive(false);
				getItems(props.path);
			});
		}
	};

	useEffect(() => {
		if (props.path) {
			getItems(props.path);
		}
	}, [EventsStorage.listFiles, props.path]);

	return (<div className="album">
		{items.map(item => {
			return <Image key={item.key} data-key={item.key} src={item.path} onClick={processSelect} className={selectedItems.includes(item.key) ? 'selected' : ''} alt='' />
			//return <img key={item.key} data-key={item.key} src={item.path} onClick={processSelect} className={selectedItems.includes(item.key) ? 'selected' : ''} alt='' />
		})}
		<div className={"buttons-block"}>
			<img src={"/delete.png"} onClick={deleteImagesHandler} className={`${selectedItems.length > 0 ? "" : "hide"}`}></img>
			<form className={`${selectedItems.length > 0 ? "hide" : ""}`} name="uploadForm" encType="multipart/form-data">
				<div>
					<img src={"/add-image.png"} onClick={toggleAddImageActivity} />
					<input className={addImageIsActive ? "" : "hide"} id="uploadInput" type="file" name="myFiles" multiple onChange={fileUploadHandler} />
				</div>
			</form>
		</div>
	</div>)
};

export default Album;