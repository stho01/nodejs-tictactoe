
namespace Zed {
    "use strict";

    class StatusMessages {
        static WAITING_FOR_OPPONENT: string = "Waiting for an opponent to join the game...";
        static WAITING_FOR_OPPONENT_MOVE: string = "Waiting for opponent to make a move";
        static YOUR_TURN: string = "It's your turn to make a move";
        static OPPONENT_FOUND = "Opponent found.";
    }

    export class ClientGame {

        //***************************************************
        //** Static fields
        //***************************************************

        static ON_GAME_CLOSE: string = "game_close";
        static ON_GAME_UPDATE: string = "game_update";
        static ON_GAME_STATUS_CHANGE: string = "game_status_change";

        //***************************************************
        //** Fields
        //***************************************************

        private _io: SocketIOClient.Socket;
        private _gameId: string;
        private _playerId: string;
        private _boardData: Cell[] = [];
        private _overlay: HTMLElement;
        private _isOn: boolean = false;
        private _activePlayer: PlayerType = PlayerType.NONE;
        private _statusMsg: string;

        /**
         *
         */
        constructor() {
            this._overlay = <HTMLElement>document.querySelector(".overlay");
            this._initBoard();
        }

        //***************************************************
        //** Getters
        //***************************************************

        /**
         *
         * @returns {Cell[]}
         */
        get boardData(): Cell[] { return this._boardData; }
        get statusMsg(): string { return this._statusMsg; }

        //***************************************************
        //** Public member functions
        //***************************************************

        /**
         *
         * @param gameHtml
         */
        init(gameHtml: HTMLElement): void {
            this._overlay = <HTMLElement>gameHtml.querySelector(".overlay");
            this._io = io();
            this._io.on("connected", this._onConnectedSuccessfully.bind(this));
            this._io.on("gamejoined", this._onGameJoined.bind(this));
            this._io.on("update", this._onUpdate.bind(this));
            this._io.on("opponent_disconnected", this._onOpponentDisconnected.bind(this));
            this._io.on("done", this._onDone.bind(this));
        }

        /**
         *
         */
        exit(): void {
            $(this._overlay).remove();
            this._io.disconnect();
            this._io.removeAllListeners();
        }

        /**
         *
         * @private
         */
        private _initBoard(): void {
            for (var i = 0; i < 9; i++) {
                this._boardData.push({
                    playerType: ko.observable(PlayerType.NONE),
                    isSet: ko.observable(false),
                    onClick: this._onClickEventHandler.bind(this),
                    index: i
                });
            }
        }

        /**
         *
         * @param data
         * @private
         */
        private _onClickEventHandler(data: Cell): void {
            if (!this._isOn) {
                return;
            }

            if (data.isSet && data.isSet() == false) {
                data.isSet(true);

                var move: Move = {
                    playerId: this._playerId,
                    gameId: this._gameId,
                    index: data.index
                };

                this._io.emit("enter", move);
            }
        }

        /**
         *
         * @param response
         * @private
         */
        private _onConnectedSuccessfully(response): void {
            this._playerId = response.playerId;
            this._io.emit("joingame", this._playerId);
        }

        /**
         *
         * @param data
         * @private
         */
        private _onGameJoined(data): void {
            this._gameId = data.gameId;

            if (data.status === GameStatus.READY) {
                this._changeStatus(StatusMessages.OPPONENT_FOUND);
                this._isOn = true;
                this._activePlayer = data.activePlayer;
                console.log(data.activePlayer);

                if(data.activePlayer === PlayerType.OPPONENT) {
                    this._waitingForOpponentToTakeAMove();
                } else {
                    this._myTurn();
                }
            } else {
                this._changeStatus(StatusMessages.WAITING_FOR_OPPONENT);
            }
        }

        /**
         *
         * @private
         */
        private _waitingForOpponentToTakeAMove(): void {
            this._overlay.style.removeProperty("display");
            this._changeStatus(StatusMessages.WAITING_FOR_OPPONENT_MOVE);
        }

        /**
         *
         * @private
         */
        private _myTurn(): void {
            this._overlay.style.setProperty("display", "none");
            this._changeStatus(StatusMessages.YOUR_TURN);
        }

        /**
         *
         * @param data
         * @private
         */
        private _onUpdate(data: UpdateObject): void {
            this._activePlayer = data.activePlayer;

            if(data.activePlayer == PlayerType.LOCAL) {
                this._myTurn();
            } else if(data.activePlayer == PlayerType.OPPONENT) {
                this._waitingForOpponentToTakeAMove();
            }

            for(var i = 0; i < data.board.length; i++) {
                this._boardData[i].playerType(data.board[i]);
                if (data.board[i] !== PlayerType.NONE) {
                    this._boardData[i].isSet(true);
                }
            }

            $(this).trigger(ClientGame.ON_GAME_UPDATE);
        }

        /**
         *
         * @private
         */
        private _onOpponentDisconnected(): void {
            for (var i = 0; i < this._boardData.length; i++) {
                this._boardData[i].isSet(false);
                this._boardData[i].playerType(PlayerType.NONE);
            }

            //TODO: notify server that the game needs a player, then wait for new game..

            $(this).trigger(ClientGame.ON_GAME_CLOSE, { code: GameDoneCode.DISCONNECT });
        }

        /**
         *
         * @param type
         * @private
         */
        private _onDone(type: PlayerType): void {
            if (type == null) {
                this._changeStatus("The game ended with a draw...");
                $(this).trigger(ClientGame.ON_GAME_CLOSE, { code: GameDoneCode.DRAW });
            } else if (type === PlayerType.LOCAL) {
                this._changeStatus("Victory! You won the game...");
                $(this).trigger(ClientGame.ON_GAME_CLOSE, { code: GameDoneCode.WON });
            } else {
                this._changeStatus("Oh no! T_T You lost the game...");
                $(this).trigger(ClientGame.ON_GAME_CLOSE, { code: GameDoneCode.LOST });
            }
        }

        /**
         *
         * @param msg
         * @private
         */
        private _changeStatus(msg: string): void {
            this._statusMsg = msg;
            console.log("Changing status to ", msg);
            $(this).trigger(ClientGame.ON_GAME_STATUS_CHANGE, { msg: this._statusMsg });
        }
    }
}