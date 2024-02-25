import React, {useState} from 'react';
import './ChangePassword.scss';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Auth } from 'aws-amplify';

function ChangePassword (props) {
	const [oldPassword, setOldPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [repeatPassword, setRepeatPassword] = useState('');

	async function changePassword (e) {
		e.stopPropagation();
		try {
			const user = await Auth.currentAuthenticatedUser();
			const data = await Auth.changePassword(user, oldPassword, newPassword);
			console.log(data); // data = "SUCCESS"
		} catch(err) {
			console.log(err);
		}
	};

	return (
		<div>
			<form>
				<div>
					<TextField
						id="outlined-password-input"
						label="Current Password"
						type="password"
						onChange={(event) => setOldPassword(event.target.value)}
					/>
				</div>
				<div>
					<TextField
						id="outlined-password-input"
						label="New Password"
						type="password"
						onChange={(event) => setNewPassword(event.target.value)}
					/>
				</div>
				<div>
					<TextField
						id="outlined-password-input"
						label="Repeat Password"
						type="password"
						onChange={(event) => setRepeatPassword(event.target.value)}
					/>
				</div>
				<Button onClick={changePassword} variant="contained" disabled={newPassword.length === 0 || newPassword !== repeatPassword}>Change Password</Button>
			</form>
		</div>

	);

}

export default ChangePassword;
