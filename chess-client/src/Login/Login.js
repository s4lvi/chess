import * as React from "react";
import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            uErr: false,
            pErr: false,
            err: null
        }
        this.login = this.login.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({err:nextProps.err});
    }

    login() {
        this.setState({uErr: false, pErr: false})
        if (this.state.username !== "") {
            if (this.state.password !== "") {
                this.props.login(this.state);
            } else {
                this.setState({pErr: true})
            }
        }
        else {
            this.setState({uErr: true})
        }
    }

    render() {
        return(
            <React.Fragment>
            <Card sx={{width: 300, backgroundColor: "#f8f1e3"}} variant="outlined">
                <p><b>Log in</b></p>
                <CardContent>
                { this.state.err && <p style={{color:"red"}}>Invalid username/email</p>}
                <TextField error={this.state.uErr} required sx={{backgroundColor: "white", margin:1}} id="username" label="username" value={this.state.username ? this.state.username : ""} onChange={(e) => this.setState({username: e.target.value})} variant="outlined" />
                <TextField error={this.state.pErr} required sx={{backgroundColor: "white", margin:1}} type="password" id="password" label="password" value={this.state.password ? this.state.password : ""} onChange={(e) => this.setState({password: e.target.value})} variant="outlined" />
                <Button sx={{backgroundColor: "#423121", marginRight:1}} variant="contained" onClick={() => this.login()} >Login</Button>
                <Button sx={{backgroundColor: "#423121"}} variant="contained" onClick={() => this.props.register()} >Register</Button>
                </CardContent>
            </Card>
            </React.Fragment>
        )
    }
}

export default Login;