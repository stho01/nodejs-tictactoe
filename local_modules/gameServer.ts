import { Game } from "./game";
var Enums = require("../shared/Enums");

/**
 * The main purpose of this class is to serve the client/socket context
 * a fresh or waiting game.
 */
export class GameServer {

    /**
     * Current active games.
     * @type {{}}
     * @private
     */
    private static _games: {[key:string]: Game} = {};

    /**
     * Disposes all games that has no players
     */
    static clean(): boolean {
        for (var gameId in this._games) {
            if (this._games.hasOwnProperty(gameId)) {
                var game = this._games[gameId];
                if (game.getStatus() == Enums.GameStatus.EMPTY) {
                    return delete this._games[gameId];
                }
            }
        }
        return false;
    }

    /**
     * TODO: Make search for game much smarter.
     *
     * Tries to find a game that has the waiting status, if none is found then a new instance is created.
     * @param playerId
     * @returns {Game}
     */
    static createGameAndReturnInstance(playerId: string): Game {
        var games = GameServer._games;
        for (var gameId in games) {
            if(games.hasOwnProperty(gameId)) {
                var game = games[gameId];

                if(!game.isFull()) {
                    game.setPlayer(playerId);
                    game.reset();
                    console.log("Game found and returned: ", "[p1: " + game.players[0] + "]", " [p2: " + game.players[1] + "]");
                    return game;
                }
            }
        }

        var newGame = new Game();
        newGame.setPlayer(playerId);
        games[newGame.gameId] = newGame;
        console.log("Game created and returned: ", "[p1: " + playerId + "]");
        return newGame;
    }
}