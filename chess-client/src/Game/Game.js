import * as React from "react"
import ChessBoard from '../ChessBoard/ChessBoard';
import MatchBrowser from '../MatchBrowser/MatchBrowser';
import TopBar from "../TopBar/TopBar";
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
            board: {'a':{'1':["white","rook",false,false],'2':["white","pawn",false,false],'3':null,'4':null,'5':null,'6':null,'7':["black","pawn",false,false],'8':["black","rook",false,false]},
            'b':{'1':["white","night",false,false],'2':["white","pawn",false,false],'3':null,'4':null,'5':null,'6':null,'7':["black","pawn",false,false],'8':["black","night",false,false]},
            'c':{'1':["white","bishop",false,false],'2':["white","pawn",false,false],'3':null,'4':null,'5':null,'6':null,'7':["black","pawn",false,false],'8':["black","bishop",false,false]},
            'd':{'1':["white","queen",false,false],'2':["white","pawn",false,false],'3':null,'4':null,'5':null,'6':null,'7':["black","pawn",false,false],'8':["black","queen",false,false]},
            'e':{'1':["white","king",false,false],'2':["white","pawn",false,false],'3':null,'4':null,'5':null,'6':null,'7':["black","pawn",false,false],'8':["black","king",false,false]},
            'f':{'1':["white","bishop",false,false],'2':["white","pawn",false,false],'3':null,'4':null,'5':null,'6':null,'7':["black","pawn",false,false],'8':["black","bishop",false,false]},
            'g':{'1':["white","night",false,false],'2':["white","pawn",false,false],'3':null,'4':null,'5':null,'6':null,'7':["black","pawn",false,false],'8':["black","night",false,false]},
            'h':{'1':["white","rook",false,false],'2':["white","pawn",false,false],'3':null,'4':null,'5':null,'6':null,'7':["black","pawn",false,false],'8':["black","rook",false,false]}
            },
            dead: null,
            turn: null,
            player: null,
            notify: null,
            gameover: false,
            winner: null
        }

        this.switchView = this.switchView.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.connect = this.connect.bind(this);
        this.join = this.join.bind(this);
        this.handleMessage = this.handleMessage.bind(this);
        this.sendMove = this.sendMove.bind(this);
        this.endGame = this.endGame.bind(this);
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
        this.setState({username: e.username, password: e.password}, () => {
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
            var notify = data["notify"];
            var view = "play"
            if (data["gameover"] === true) {
                view = this.state.currentView;
                if (data["winner"] === null) {
                    notify = "Game over: player forfeit."
                } else {
                    notify = "Game over: player " + data["winner"] + " wins!"
                }
            } 
            console.log(notify)
            let playerIndex = this.state.username === data["players"][0] ? 0 : 1;
            let opponentIndex = playerIndex === 1 ? 0 : 1;
            let playerColor = playerIndex === 1 ? "black" : "white"
            let boardParsed = JSON.parse(data["board"])
            this.setState({currentView:view,matchId:data["matchId"],opponentId:data["players"][opponentIndex],
                board:boardParsed,dead:data["dead"],turn:data["turn"],playerColor:playerColor,notify:notify,
                gameover:data["gameover"],winner:data["winner"]});
        }
        if (data["login"] !== undefined && data["login"] !== null) {
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

    endGame() {
        this.setState({currentView:"browse"});
    }

    render() {
        return(
            <div className="GameContainer">
                <TopBar />
                { this.state.currentView === "login" && <Login err={this.state.loginErr} login={this.handleLogin} register={() => this.switchView('register')} /> }
                { this.state.currentView === "register" && <Register register={this.handleRegister} back={() => this.switchView('login')} /> }
                { this.state.currentView === "browse" && <MatchBrowser join={this.join} /> }
                { this.state.currentView === "waiting" && 
                <div>
                    <h2>Waiting for player to join...</h2>
                    <img className="rotater" src={rookImg} alt="pawn" />
                </div>}
                { this.state.currentView === "play" && <ChessBoard sendMove={this.sendMove} endGame={this.endGame} playerId={this.state.username} board={this.state.board} notify={this.state.notify}
                matchId={this.state.matchId} opponentId={this.state.opponentId} turn={this.state.turn} dead={this.state.dead} playerColor={this.state.playerColor} gameover={this.state.gameover} /> }
            </div>
        )
    }
}

export default Game;