(function (exports) {

    var events = {
        SystemEvents: {
            CONNECT: "connect",
            RECONNECT: "reconnect",
            DISCONNECT: "disconnect"
        },
        ServerEvents: {
            PLAYER_CONNECTED_SUCCESS: "connected",
            GAME_JOINED: "gamejoined",
            UPDATE: "update",
            DONE: "done",
            OPPONENT_DISCONNECTED: "opponent_disconnected"
        },
        ClientEvents: {
            JOIN_GAME: "joingame",
            ENTER_MOVE: "enter"
        }
    };

    exports.SystemEvents = events.SystemEvents;
    exports.ServerEvents = events.ServerEvents;
    exports.ClientEvents = events.ClientEvents;

})(typeof exports === "undefined" ? (window.Zed) = window.Zed || {} : module.exports);