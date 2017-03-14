import GameStatus = Zed.GameStatus;
import ResolvedDateTimeFormatOptions = Intl.ResolvedDateTimeFormatOptions;
var guid = require("./guid");
var zed = require("../shared/WinningTables");
var Enums = require("../shared/Enums");

/**
 * A Class that holds track of all the game data.
 */
export class Game {

    //***************************************************
    //** Fields
    //***************************************************

    private _gameId: string;
    private _players: string[] = [];
    private _winner: string = void 0;
    private _activePlayer: string = null;
    private _cells: Cell[] = [];

    //***************************************************
    //** Ctor
    //***************************************************

    constructor() {
        this._gameId = guid.generate();
    }

    //***************************************************
    //** Getters
    //***************************************************

    get gameId(): string { return this._gameId; }
    get players(): string[] { return this._players; }
    get winner(): string { return this._winner; }
    get activePlayer(): string { return this._activePlayer; }
    get cells(): Cell[] { return this._cells }

    //***************************************************
    //** Public member methods
    //***************************************************

    /**
     * Checks whether the game contains player with id
     * @param playerId
     * @returns {boolean}
     */
    hasPlayer(playerId: string): boolean {
        for (var i = 0; i < this._players.length; i++) {
            if (playerId == this._players[i]) {
                return true;
            }
        }

        return false;
    }

    /**
     * Removes player with id from game
     * @param playerId
     * @returns {boolean} - true when successfully remove player.
     */
    removePlayer(playerId: string): boolean {
        var index = this.players.indexOf(playerId);
        if (index != -1) {
            this._players.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * Checks whether the game is full or not.
     * @returns {boolean}
     */
    isFull(): boolean {
        return this._players.length >= 2;
    }

    /**
     * Adds a player to the game.
     * @param playerId
     * @returns {boolean} - true when successfully added to the game.
     */
    setPlayer(playerId: string): boolean {
        if (!this.isFull()) {
            this._players.push(playerId);
            this._activePlayer = playerId;
            return true;
        }
        return false;
    }

    /**
     * Resets the game with inital values
     */
    reset(): void {
        this._winner = void 0;
        this._cells = [];
        for(var i = 0; i < 9; i++) {
            this._cells.push({ player: null });
        }
    }

    /**
     * Get the opponent
     * @param {string} currentPlayerId - the current context player id
     * @returns {any}
     */
    getOpponent(currentPlayerId: string): string {
        if (this._players.length >= 2) {
            return currentPlayerId == this._players[0] ? this._players[1] : this._players[0];
        }
        return null;
    }

    /**
     * @deprecated use the getter with name "cells" instead
     * Gets the board data.
     * @returns {Cell[]}
     */
    getBoardData(): Cell[] {
        return this._cells;
    }

    /**
     * checks wheter the player has won the game or not.
     * @param playerId
     * @returns {boolean} - true if player won
     */
    hasPlayerWon(playerId: string): boolean {
        for (var i = 0; i < zed.WinningTable.length; i++) {
            var winningIndices = zed.WinningTable[i];
            if (this._cells[winningIndices[0]].player === playerId
                && this._cells[winningIndices[1]].player === playerId
                && this._cells[winningIndices[2]].player === playerId) {
                return true;
            }
        }
        return false;
    }

    /**
     * Sets a move in the game board.
     *
     * @param index
     * @param playerId
     * @returns {boolean} - true if move was successfully entered
     */
    setMove(index: number, playerId: string): boolean {
        if (index < 0 || index > 9)
            throw new Error("Index is out of bounds... ");

        if (this._cells[index].player == null) {
            this._setActivePlayer(playerId);
            this._cells[index].player = playerId;

            if (this.hasPlayerWon(playerId)) {
                this._winner = playerId;
            }
            return true;
        }
        return false;
    }

    /**
     * Checks whether one of the players has won the game.
     * @returns {boolean} - true if some one has won.
     */
    hasAWinner(): boolean {
        return this._winner != void 0;
    }

    /**
     * Checks if the game has come to a draw.
     * @returns {boolean}
     */
    isDraw(): boolean {
        for (var i = 0; i < 9; i++) {
           if(this._cells[i].player == null) {
               return false;
           }
        }
        return true;
    }

    /**
     * Returns the current game status.
     * @returns {GameStatus}
     */
    getStatus(): GameStatus {
        if (this._players.length == 0) {
            return Enums.GameStatus.EMPTY;
        }
        if (this._players.length == 1) {
            return Enums.GameStatus.WAITING;
        }
        return Enums.GameStatus.READY;
    }

    /**
     * Sets a
     * @param playerId
     * @private
     */
    private _setActivePlayer(playerId: string) {
        this._activePlayer = playerId === this._players[0] ? this._players[1] : this._players[0];
    }
}