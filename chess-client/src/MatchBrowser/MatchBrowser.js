import { Button } from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import * as React from "react"

class MatchBrowser extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            matches: [],
        }
        this.refresh = this.refresh.bind(this)
        this.refresh();
    }

    refresh() {
        let url = "https://hbha3ydgk5.execute-api.us-east-2.amazonaws.com/prod/matches";
        fetch(url).then((res) => res.json()).then((data) => {
            if (data) {
                data = JSON.parse(data.body);
                console.log(data);
                let matchIds = [];
                data.Items.forEach(i => {
                    matchIds.push([i.matchId,i.playerNames[0]]);
                });
                this.setState({matches:matchIds})
            }
        })
    }

    join(t, m) {
        this.props.join(t, m);
    }

    startNew() {
        this.props.join("new")
    }

    
    render() {
        let matchList = []
        this.state.matches.forEach((m,i) => {
            matchList.push(<Button sx={{borderColor: "#77604a", width:"80%", margin: 1, fontSize:"80%"}} variant="outlined" onClick={() => this.join("join", m[0])} >{m[1] + "'s match"}</Button>);
        })
        return(
            <React.Fragment>
                <Card sx={{width: 300, backgroundColor: "#f8f1e3"}} variant="outlined">
                    <p>Open Matches: </p>
                    <CardContent>
                            {matchList}
                        <Button sx={{marginRight:1,backgroundColor: "#423121"}} variant="contained" onClick={() => this.refresh()} >Refresh</Button>
                        <Button sx={{backgroundColor: "#423121"}} variant="contained" onClick={() => this.startNew()} >Start New</Button>
                    </CardContent>
                </Card>
            </React.Fragment>
        )
    }
}

export default MatchBrowser;