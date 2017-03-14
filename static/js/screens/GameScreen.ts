namespace  Zed {

    export class GameScreen extends Screen {
        
        //***************************************************
        //** Fields 
        //***************************************************

        private _clentGame: ClientGame;

        viewName: string = Constants.GameScreens.GAME;
        viewModel: ViewModels.GameViewModel = void 0;

        //***************************************************
        //** Public member Functions
        //***************************************************

        load(): void {
            this._clentGame = new ClientGame();
            $(this._clentGame).on(ClientGame.ON_GAME_CLOSE, this._onOpponentDisconnect.bind(this));
            $(this._clentGame).on(ClientGame.ON_GAME_STATUS_CHANGE, this._onGameStatusChange.bind(this));
            this.viewModel = {
                boardData: this._clentGame.boardData,
                statusMessages: ko.observableArray([])
            };
        }

        unload():void {
            this._clentGame.exit();
            $(this._clentGame).off();
        }

        pause():void {
        }

        resume():void {
        }

        init(htmlElement: HTMLElement):void {
            this._clentGame.init(htmlElement);
        }

        //***************************************************
        //** Event handlers
        //***************************************************

        /**
         *
         * @private
         */
        private _onOpponentDisconnect(e: JQueryEventObject, args: any): void {
            switch (args.code) {
                case GameDoneCode.DISCONNECT:
                    alert("The opponent disconnected..");
                    break;
                case GameDoneCode.DRAW:
                    alert("The game ended in a draw..");
                    break;
                case GameDoneCode.WON:
                    alert("Congratz, you won the game..");
                    break;
                case GameDoneCode.LOST:
                    alert("Sorry, you lost the game");
                    break;
            }

            this._screenManager.popScreen();
        }

        /**
         *
         * @private
         */
        private _onGameStatusChange(event: JQueryEventObject): void {
            this.viewModel.statusMessages.unshift({
                timestamp:  (new Date(Date.now())).toLocaleTimeString().replace(/\./g, ':'),
                msg: this._clentGame.statusMsg
            });
        }
    }
}