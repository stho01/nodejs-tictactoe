import {SocketHolder} from "./socketHolder";
var Events = require("../shared/Events")

export class SocketManager {

    static clientSockets: { [key:string]: any } = {};

    //***************************************************
    //** Public member functions
    //***************************************************

    static init(io: SocketIO.Adapter) {
        io.on(Events.SystemEvents.CONNECT, this._onClientConnect.bind(this));
    }

    //***************************************************
    //** Private member functions
    //***************************************************

    private static _onClientConnect(socket: SocketIO.Socket) {
        var sh = new SocketHolder(socket);
        sh.init();
        this.clientSockets[socket.id] = sh;
    }
}