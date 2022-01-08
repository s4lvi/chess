import * as React from "react"
import ChessBoard from '../ChessBoard/ChessBoard';
import MatchBrowser from '../MatchBrowser/MatchBrowser';
import Login from '../Login/Login';
import Register from '../Login/Register';
import SocketClient from "../SocketClient/SocketClient";
const rookImg = require('../images/rookW.png');

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: "login",
            loginErr: null,
            username: null,
            matchId: null,
            connected: false,
            opponentId: null,
            board: {'a':{'1':["white","rook"],'2':["white","pawn"],'3':null,'4':null,'5':null,'6':null,'7':["black","pawn"],'8':["black","rook"]},
            'b':{'1':["white","night"],'2':["white","pawn"],'3':null,'4':null,'5':null,'6':null,'7':["black","pawn"],'8':["black","night"]},
            'c':{'1':["white","bishop"],'2':["white","pawn"],'3':null,'4':null,'5':null,'6':null,'7':["black","pawn"],'8':["black","bishop"]},
            'd':{'1':["white","king"],'2':["white","pawn"],'3':null,'4':null,'5':null,'6':null,'7':["black","pawn"],'8':["black","king"]},
            'e':{'1':["white","queen"],'2':["white","pawn"],'3':null,'4':null,'5':null,'6':null,'7':["black","pawn"],'8':["black","queen"]},
            'f':{'1':["white","bishop"],'2':["white","pawn"],'3':null,'4':null,'5':null,'6':null,'7':["black","pawn"],'8':["black","bishop"]},
            'g':{'1':["white","night"],'2':["white","pawn"],'3':null,'4':null,'5':null,'6':null,'7':["black","pawn"],'8':["black","night"]},
            'h':{'1':["white","rook"],'2':["white","pawn"],'3':null,'4':null,'5':null,'6':null,'7':["black","pawn"],'8':["black","rook"]}
            },
            dead: null,
            turn: null,
            player: null
        }

        this.switchView = this.switchView.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.connect = this.connect.bind(this);
        this.join = this.join.bind(this);
        this.handleMessage = this.handleMessage.bind(this);
        this.sendMove = this.sendMove.bind(this);
        this.client = null;
    }

    componentDidMount() {
        this.connect();
    }

    join(type, matchId) {
        let message = {
            "action":"joinMatch",
            "message":{
                "player":this.state.username
            }
        }
        if (type === "join") {
            message["message"]["matchId"] = matchId;
        }
        console.log("joining with ", message)
        this.client.client.send(JSON.stringify(message))
    }

    connect() {
        this.client = new SocketClient(this.handleMessage)
    }

    switchView(page) {
        this.setState({currentView: page})
    }

    handleLogin(e) {
        this.setState({username: e.username}, () => {
            let message = {
                "action":"validateLogin",
                "message":{
                    "userId":this.state.username,
                    "password":this.state.password
                }
            }
            this.client.client.send(JSON.stringify(message))
        })
    }

    handleRegister(e) {
        console.log(e)
        let url = "https://hbha3ydgk5.execute-api.us-east-2.amazonaws.com/prod/register";
        fetch(url, {
            method:'POST',
            body: JSON.stringify(e)
        }).then((res) => res.json()).then((data) => {
            console.log(data)
            this.switchView('login')
        })
    }

    handleMessage(m) {
        let data = JSON.parse(m.data);
        console.log(data)
        if (data["newMatchId"]) {
            this.setState({matchId:data.newMatchId, currentView:"waiting"});
        }
        if (data["players"]) {
            let playerIndex = this.state.username === data["players"][0] ? 0 : 1;
            let opponentIndex = playerIndex === 1 ? 0 : 1;
            let playerColor = playerIndex === 1 ? "black" : "white"
            let boardParsed = JSON.parse(data["board"])
            this.setState({currentView:"play",matchId:data["matchId"],opponentId:data["players"][opponentIndex],board:boardParsed,dead:data["dead"],turn:data["turn"],playerColor:playerColor});
        }
        if (data["login"]) {
            if (data["login"] === true) {
                this.setState({connected: true, currentView: 'browse'})
            } else {
                this.setState({loginErr: "Invalid username/password"})
            }
        }
    }

    sendMove(move) {
        this.client.client.send(JSON.stringify(move))
    }

    render() {
        return(
            <div className="GameContainer">
                { this.state.currentView === "login" && <Login err={this.state.loginErr} login={this.handleLogin} register={() => this.switchView('register')} /> }
                { this.state.currentView === "register" && <Register register={this.handleRegister} back={() => this.switchView('login')} /> }
                { this.state.currentView === "browse" && <MatchBrowser join={this.join} /> }
                { this.state.currentView === "waiting" && 
                <div>
                    <h2>Waiting for player to join...</h2>
                    <img className="rotater" src={rookImg} alt="pawn" />
                </div>}
                { this.state.currentView === "play" && <ChessBoard sendMove={this.sendMove} playerId={this.state.username} board={this.state.board}
                matchId={this.state.matchId} opponentId={this.state.opponentId} turn={this.state.turn} dead={this.state.dead} playerColor={this.state.playerColor} /> }
            </div>
        )
    }
}

export default Game;