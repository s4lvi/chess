import * as React from "react";
import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            email: "",
            password: "",
            errorMsg: null,
            errors: [false,false,false],
        }
        this.register = this.register.bind(this);
    }

    validate() {
        let errors = this.state.errors;
        if (this.state.email === "" || this.state.email === null || !this.state.email || !this.validateEmail(this.state.email)) {
            errors=[true,errors[1],errors[2]]
        } else {
            errors=[false,errors[1],errors[2]]
        }
        if (this.state.username === "" || this.state.username === null || !this.state.username || this.state.username.length < 3) {
            errors=[errors[0],true,errors[2]]
        } else {
            errors=[errors[0],false,errors[2]]
        }
        if (this.state.password === "" || this.state.password === null || !this.state.password || this.state.password.length < 6) {
            errors=[errors[0],errors[1],true]
        } else {
            errors=[errors[0],errors[1],false]
        }

        this.setState({errors:errors})

        if (errors[0] || errors[1] || errors[2]) {
            this.setState({errorMsg:"invalid input"})
            return false;
        } else {
            this.setState({errorMsg:null})
            return true;
        }
    }
    
    register() {
        if (this.validate()) {
            let body = {
                username: this.state.username,
                email: this.state.email,
                password: this.state.password
            };
            this.props.register(body);
        } 
    }

    back() {
        this.props.back();
    }

    validateEmail(email) {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
      };

    render() {
        return(
        <React.Fragment>
            <Card sx={{width: 300, backgroundColor: "#f8f1e3"}} variant="outlined">
                    <p>Registration</p>
                <CardContent>
                    <TextField sx={{backgroundColor: "white", margin:1}} error={this.state.errors[0]} required variant="outlined" label="email" value={this.state.email ? this.state.email : ""} onChange={(e) => this.setState({email: e.target.value})} /><br/>
                    <TextField sx={{backgroundColor: "white", margin:1}} error={this.state.errors[1]} required variant="outlined" label="username" value={this.state.username ? this.state.username : ""} onChange={(e) => this.setState({username: e.target.value})} /><br/>
                    <TextField sx={{backgroundColor: "white", margin:1}} error={this.state.errors[2]} required variant="outlined" type="password" label="password" value={this.state.password ? this.state.password : ""} onChange={(e) => this.setState({password: e.target.value})} /><br/>
                    {this.state.errorMsg}<br/>
                    <Button sx={{marginRight:1, backgroundColor: "#423121"}} variant="contained" onClick={() => this.register()} >Submit</Button>
                    <Button sx={{backgroundColor: "#423121"}} variant="contained" onClick={() => this.back()} >Back</Button>
                </CardContent>
            </Card>
        </React.Fragment>
        )
    }
}

export default Register