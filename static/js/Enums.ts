namespace Zed {
    export enum PlayerType {
        NONE = 0,
        LOCAL = 1,
        OPPONENT = 2
    }

    export enum GameStatus {
        WAITING = 1,
        READY = 2
    }

    export enum GameDoneCode {
        DRAW = 1,
        WON = 2,
        LOST = 3,
        DISCONNECT = 4
    }
}