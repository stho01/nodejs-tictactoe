import {GameServer} from "./gameServer";
import {SocketManager} from "./socketManager";
import {Game} from "./game";
import PlayerType = Zed.PlayerType;
var Enums = require("../shared/Enums");
var Events = require("../shared/Events");


export class SocketHolder {

    //***************************************************
    //** Fields
    //***************************************************

    private _socket: SocketIO.Socket;
    private _playerId: string;
    private _game: Game;

    //***************************************************
    //** Ctor
    //***************************************************

    constructor(socket: SocketIO.Socket) {
        this._socket = socket;
        this._playerId = socket.id;
        this._game = GameServer.createGameAndReturnInstance(socket.id);
    }

    //***************************************************
    //** Public member functions
    //***************************************************

    /**
     * Initializes the socket holder
     * Sets up all the socket event handlers and emits a connected successfully event to the client.
     */
    init(): void {
        this._socket.on(Events.SystemEvents.DISCONNECT, this._onClientDiscconnected.bind(this));
        this._socket.on(Events.SystemEvents.RECONNECT, this._onClientReconnect.bind(this));
        this._socket.on(Events.ClientEvents.JOIN_GAME, this._onClientJoinGameEventHandler.bind(this));
        this._socket.on(Events.ClientEvents.ENTER_MOVE, this._onClientEnterMoveEventHandler.bind(this));
        this._connectedSuccessfully();
    }

    /**
     * Emits a game joined event to the client.
     */
    joinGame(): void {
        this._socket.emit(Events.ServerEvents.GAME_JOINED, {
            status: this._game.getStatus(),
            gameId: this._game.gameId,
            activePlayer: this._activePlayerType()
        });
    }

    /**
     * Emits a update event to the client with a updated board data set.
     */
    update(): void {
        var cells = this._game.cells,
            anonymousBoard: PlayerType[] = [];

        for (var i = 0; i < cells.length; i++) {
            var cell = cells[i];
            if (cell.player == this._playerId) {
                anonymousBoard.push(Enums.PlayerType.LOCAL);
            } else if(cell.player != null) {
                anonymousBoard.push(Enums.PlayerType.OPPONENT);
            } else {
                anonymousBoard.push(Enums.PlayerType.NONE);
            }
        }

        this._socket.emit(Events.ServerEvents.UPDATE, {
            board: anonymousBoard,
            activePlayer: this._activePlayerType()
        });
    }

    /**
     * Emits a game done event to the client with the winner.
     */
    gameDone(): void {
        var winner: string = this._game.winner;
        var winnerPlayerType: PlayerType;

        if (winner == this._playerId) {
            winnerPlayerType = Enums.PlayerType.LOCAL;
        } else {
            winnerPlayerType = Enums.PlayerType.OPPONENT;
        }

        if(this._game.isDraw()) {
            this._socket.emit(Events.ServerEvents.DONE, null);
        } else {
            this._socket.emit(Events.ServerEvents.DONE, winnerPlayerType);
        }
    }

    /**
     * Emits a opponent disconnected event to the client
     */
    opponentDisconnected(): void {
        this._socket.emit(Events.ServerEvents.OPPONENT_DISCONNECTED);
    }

    //***************************************************
    //** Private member functionss
    //***************************************************

    /**
     * Emits a success event to the client
     * @private
     */
    private _connectedSuccessfully(): void {
        this._socket.emit(Events.ServerEvents.PLAYER_CONNECTED_SUCCESS, { playerId: this._playerId });
    }

    /**
     * Gets the active player type
     * @returns {number}
     * @private
     */
    private _activePlayerType(): PlayerType {
        return this._game.activePlayer == this._playerId ? Enums.PlayerType.LOCAL : Enums.PlayerType.OPPONENT;
    }

    /**
     * Finds opponent and notifies the opponent of clients disconnection.
     * @private
     */
    private _notifyOppoentOfDisconnectedClient(): void {
        var opponent = this._opponent();
        if(opponent) {
            opponent.opponentDisconnected();
        }
    }

    private _opponent(): SocketHolder {
        return SocketManager.clientSockets[this._game.getOpponent(this._playerId)];
    }

    //***************************************************
    //** Event handlers
    //***************************************************

    private _onClientDiscconnected(): void {
        console.log("Player dissconnected", this._playerId, this._game.gameId);
        this._notifyOppoentOfDisconnectedClient();
        this._game.removePlayer(this._playerId);

        GameServer.clean();
        delete SocketManager.clientSockets[this._playerId];
    }

    private _onClientReconnect(): void {
        console.log("Player Reconnected");
    }

    private _onClientJoinGameEventHandler(): void {
        var status = this._game.getStatus();
        this.joinGame();

        if (status === Enums.GameStatus.READY) {
            var opponent = this._opponent();
            opponent.joinGame();
        }
    }

    private _onClientEnterMoveEventHandler(data: EnterMove): void {
        if (this._game.setMove(data.index, this._playerId)) {

            console.log("Player [" + this._playerId + "] made a move...");

            var oSocket = this._opponent();
            oSocket.update();
            this.update();

            if (this._game.hasAWinner() || this._game.isDraw()) {
                this.gameDone();
                this._opponent().gameDone();
            }
        }
    }
}