import EventsStorage from "../../storage/EventsStorage";
import { Storage } from 'aws-amplify';
import {useEffect, useState} from "react";
import './Album.scss';

const Album = (props) => {
	const [items, setItems] = useState([]);
	const [selectedItems, setSelectedItems] = useState([]);

	const selectItem = (item) => {
		setSelectedItems(prevState => [...prevState, item]);
	}

	const unselectItem = (deletedItem) => {
		setSelectedItems(prevState => prevState.filter(item => item !== deletedItem));
	}

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
		<form name="uploadForm" encType="multipart/form-data">
			<div>
				<input id="uploadInput" type="file" name="myFiles" multiple onChange={fileUploadHandler} />
			</div>
		</form>
		{items.map(item => {
			return <img key={item.key} data-key={item.key} src={item.path} onClick={processSelect} className={selectedItems.includes(item.key) ? 'selected' : ''} alt='' />
		})}
		<div className={"buttons-block"}>
			<img src={"/delete.png"} onClick={deleteImagesHandler} className={`${selectedItems.length > 0 ? "" : "hide"}`}></img>
		</div>
	</div>)
};

export default Album;