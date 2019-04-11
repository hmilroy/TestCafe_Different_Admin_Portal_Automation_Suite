import React, { PropTypes } from 'react';
import { Card, CardActions } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import logo from '../../assets/images/logo-vector-roof@2x.png';
import customStyles from './styles/loginForm.jsx';
const styles = customStyles;
import andiImage from '../../assets/images/andi.png';

const LoginForm = ({
    onSubmit,
    onChange,
    errors,
    user,
    googleLogin
}) => (
    <div style={styles.main}>
        <Card style={styles.card}>
            <div className="login-logo" style={styles.avatar}>
                <img src={logo} />
            </div>
            {googleLogin && <img src={andiImage} className="LoginFormAndi"/>}
             <form onSubmit={onSubmit}>
                 {!googleLogin &&<div style={styles.form}>
                    <TextField
                        floatingLabelText="User Name"
                        type="email"
                        name="email"
                        onChange={onChange}
                        errorText={errors.email}
                        value={user.email}
                        underlineStyle={styles.underlineStyle}
                        underlineFocusStyle={styles.underlineStyle}
                        floatingLabelStyle={styles.floatingLabelStyle}
                        floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                        fullWidth
                    /><br />
                    <TextField
                        floatingLabelText="Password"
                        type="password"
                        name="password"
                        onChange={onChange}
                        errorText={errors.password}
                        value={user.password}
                        underlineStyle={styles.underlineStyle}
                        underlineFocusStyle={styles.underlineStyle}
                        floatingLabelStyle={styles.floatingLabelStyle}
                        floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                        fullWidth
                    /><br />
                </div>}
                <CardActions>
                    {!googleLogin && <RaisedButton type="submit" disabled={false} label="Sign In"
                                  backgroundColor={styles.button.backgroundColor}
                                  labelColor={styles.button.labelColor} fullWidth/>}
                    {googleLogin ? <div id="google-signin" className="google-signin-button"></div> : <div id="google-signin" className="google-signin-button google-signin-button--margin-top"></div>}
                </CardActions>
            </form>
        </Card>
    </div>
);

LoginForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
};

export default LoginForm;