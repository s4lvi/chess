import * as React from "react";
import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";
import Stack from '@mui/material/Stack';
import SocketClient from "../SocketClient/SocketClient";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "player-"+Math.floor(Math.random() * 9999),
            matchId: "",
            connected: false
        }
        this.client = null;
        this.handleMessage = this.handleMessage.bind(this);
        this.connect = this.connect.bind(this);
    }

    connect() {
        this.client = new SocketClient(this.state.name, this.handleMessage)
        this.setState({connected: true})
    }

    join() {
        let message = {
            "action":"joinMatch",
            "message":{
                "player":this.state.name
            }
        }
        if (this.state.matchId !== "") {
            message["message"]["matchId"] = this.state.matchId;
        }
        console.log("joining with ", message)
        this.client.client.send(JSON.stringify(message))
    }

    sendMove() {
        let message = {
            "action": "sendMove",
            "message": {
                "matchId":this.state.matchId, 
                "board":"testboard",
                "player":this.state.name,
                "dead":"none"}
        }
        console.log("sending move ", message)
        this.client.client.send(JSON.stringify(message))
    }

    handleMessage(m) {
        let data = JSON.parse(m.data);
        console.log(data)
        if (data["newMatchId"] !== null) {
            this.setState({matchId:data.newMatchId});
        }
    }

    render() {
        return(
            <div>

            <Stack spacing={2} direction="row">
                <TextField id="standard-basic" label="display name" value={this.state.name ? this.state.name : ""} onChange={(e) => this.setState({name: e.target.value})} variant="standard" />
                <Button variant="contained" onClick={() => this.connect()} >Connect</Button>
                <TextField id="standard-basic" label="match id" value={this.state.matchId ? this.state.matchId : ""} onChange={(e) => this.setState({matchId: e.target.value})} variant="standard" />
                <Button variant="contained" onClick={() => this.join()} >Join</Button>
            </Stack>
            </div>
        )
    }
}

export default Login;