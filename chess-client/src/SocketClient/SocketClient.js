import { w3cwebsocket as W3CWebSocket } from "websocket";


class SocketClient {
    constructor(name, fn) {
        this.name = name;
        console.log('connecting to websocket')
        this.client = new W3CWebSocket('wss://8itl1gx5zc.execute-api.us-east-2.amazonaws.com/production?apiKey=nMTbkWTdaT1Hz2X6NZklu5LDC579OWz4XqBp8Mrc');
        this.client.onopen = (e) => {
            this.onOpen(e);
        };
    
        this.client.onmessage = (message) => {
           fn(message); 
        };

        this.client.onerror = (error) => {
            this.onError(error);
        }
    }

    onOpen(e) {
        console.log(e);
    }

    onMessage(m) {
        console.log(m);
    }

    onError(e) {
        console.log(e);
    }

    sendMessage(m) {
        this.client.send(m);
    }

}

export default SocketClient;