(function (exports) {

    var Enums = {
        GameStatus: {
            EMPTY: 0,
            WAITING: 1,
            READY: 2
        },
        PlayerType: {
            NONE: 0,
            LOCAL: 1,
            OPPONENT: 2
        }
    };

    exports.GameStatus = Enums.GameStatus;
    exports.PlayerType = Enums.PlayerType;

})(typeof exports === "undefined" ? (window.Zed) = window.Zed || {} : module.exports);