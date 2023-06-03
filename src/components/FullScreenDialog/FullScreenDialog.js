import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import {Image} from "@aws-amplify/ui-react";
import './FullScreenDialog.scss';
import {CircularProgress, Container} from "@mui/material";
import {useState} from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog(params) {

	const [isLoaded, setIsLoaded] = useState(false);

	const handleClose = () => {
		setIsLoaded(false);
		params.onClose();
	};

	const handlePrev = () => {
		setIsLoaded(false);
		params.onPrev();
	};

	const handleNext = () => {
		setIsLoaded(false);
		params.onNext();
	};

	const handleLoad = () => {
		setIsLoaded(true);
	}

	return (
		<div>
			<Dialog
				fullScreen
				open={params.currentImage ? true : false}
				onClose={handleClose}
				TransitionComponent={Transition}
				sx={{ display: "flex", flexDirection: "column" }}
			>
				<AppBar sx={{ position: 'relative' }}>
					<Toolbar>
						<IconButton
							edge="start"
							color="inherit"
							onClick={handleClose}
							aria-label="close"
						>
							<CloseIcon />
						</IconButton>
						{!params.isFirst ? <Button autoFocus color="inherit" onClick={handlePrev}>
							&lt;
						</Button> : ''}
						{!params.isLast ? <Button autoFocus color="inherit" onClick={handleNext}>
							&gt;
						</Button> : ''}
					</Toolbar>
				</AppBar>
				<Container fixed sx={{ flexGrow: "1", maxHeight: "calc(100% - 72px)", display: "flex", justifyContent: "center", alignItems: "center"}}>
					{isLoaded ? '' : <CircularProgress color="success" />}
					<Image display={isLoaded ? 'block' : 'none'} onLoad={handleLoad} id={'image-big'} src={params.currentImage ? params.currentImage.path : ''} />
				</Container>
			</Dialog>
		</div>
	);
}
