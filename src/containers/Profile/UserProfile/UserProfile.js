import React, {useEffect, useState} from 'react';
import './UserProfile.scss';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Auth } from 'aws-amplify';

function UserProfile (props) {

	const [email, setEmail] = useState();

	async function changeEmail(e) {
		e.stopPropagation();
		try {
			const user = await Auth.currentAuthenticatedUser();
			const result = await Auth.updateUserAttributes(user, {
				'email': email
			});
			console.log('result', result);
		} catch (error) {
			console.log('error', error);
		}
	}

	useEffect(() => {
		async function fetchEmail() {
			const user = await Auth.currentAuthenticatedUser();
			setEmail(user.attributes.email);
		}
		fetchEmail();
	}, [])

	return (
		<div>
			<form>
				<div>
					<TextField
						id="outlined-email-input"
						label="Email"
						type="text"
						value={email}
						onChange={(event) => setEmail(event.target.value)}
					/>
				</div>
				<Button onClick={changeEmail} variant="contained">Change Email</Button>
			</form>
		</div>
	);

}

export default UserProfile;
