declare namespace Zed {
    class SystemEvents {
        static CONNECT: string;
        static RECONNECT: string;
        static DISCONNECT: string;
    }

    class ServerEvents {
        static PLAYER_CONNECTED_SUCCESS: string;
        static GAME_JOINED: string;
        static UPDATE: string;
        static DONE: string;
        static OPPONENT_DISSCONNECTED: string;
    }

    class ClientEvents {
        JOIN_GAME: string;
        ENTER_MOVE: string;
    }
}