import * as React from "react";
import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            matchId: "",
            password: "",
            connected: false
        }
        this.client = null;
        this.login = this.login.bind(this);
    }

    login() {
    }

    render() {
        return(
            <React.Fragment>
            <Card sx={{width: 300, backgroundColor: "#f8f1e3"}} variant="outlined">
                <CardContent>
                <TextField required sx={{backgroundColor: "white", margin:1}} id="standard-basic" label="username" value={this.state.name ? this.state.name : ""} onChange={(e) => this.setState({name: e.target.value})} variant="outlined" />
                <TextField required sx={{backgroundColor: "white", margin:1}} type="password" id="standard-basic" label="password" value={this.state.password ? this.state.password : ""} onChange={(e) => this.setState({password: e.target.value})} variant="outlined" />
                <Button sx={{backgroundColor: "#423121", marginRight:1}} variant="contained" onClick={() => this.login()} >Login</Button>
                <Button sx={{backgroundColor: "#423121"}} variant="contained" onClick={() => this.register()} >Register</Button>
                </CardContent>
            </Card>
            </React.Fragment>
        )
    }
}

export default Login;