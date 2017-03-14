namespace Zed {
    export interface GameBindObject {
        templateName: KnockoutObservable<string>;
        data: KnockoutObservable<any>;

    }

    export interface UpdateObject {
        board: PlayerType[];
        activePlayer: PlayerType;
    }

    export interface Move {
        playerId: string;
        gameId: string,
        index: number;
    }

    export interface Cell {
        isSet: KnockoutObservable<boolean>;
        playerType: KnockoutObservable<PlayerType>;
        onClick: (data: Cell) => void;
        index: number;
    }

    export interface IScreen {
        viewName: string;
        viewModel: any;
        load(): void;
        unload(): void;
        pause(): void;
        resume(): void;
        init(htmlElement: HTMLElement): void;
        setManager(screenManager: ScreenManager): void;
    }

}

namespace Zed.ViewModels {
    export interface MainMenuViewModel {
        mainMenu: MainMenuItem[];
        onClick: () => void;
    }

    export interface MainMenuItem {
        id?: string|number;
        text: string;
    }

    export interface GameViewModel {
        statusMessages: KnockoutObservableArray<StatusMessageViewModel>;
        boardData: Cell[];
    }

    export interface StatusMessageViewModel {
        timestamp: string;
        msg: string;
    }
}