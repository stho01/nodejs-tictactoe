namespace Zed {
    export class ScreenManager {

        //***************************************************
        //** Fields
        //***************************************************

        private _container: HTMLElement;
        private _screenStack: IScreen[] = [];
        private _initialScreen: IScreen;
        private _stateObject: KnockoutObservable<IScreen>;

        //***************************************************
        //** Ctor
        //***************************************************

        constructor(initialScreen: IScreen, container: HTMLElement) {
            this._initialScreen = initialScreen;
            this._screenStack.push(initialScreen);
            this._container = container || document.createElement("div");
            this._stateObject = ko.observable(initialScreen);
            initialScreen.setManager(this);
            initialScreen.load();
            ko.applyBindings(this._stateObject, this._container);
        }

        pushScreen(screen: IScreen): void {
            this._screenStack[this._screenStack.length-1].pause();
            this._screenStack.push(screen);
            screen.setManager(this);
            screen.load();
            this._stateObject(screen);
        }

        popScreen(unload: boolean = true): IScreen {
            if (this._screenStack.length == 1) {
                throw new Error("Cant pop the initial screen");
            }

            var popped = this._screenStack.pop();
            if(unload) {
                popped.unload();
            }
            var top = this.peek();
            top.resume();
            this._stateObject(top);
            return popped;
        }

        peek(): IScreen {
            return this._screenStack[this._screenStack.length - 1];
        }
    }
}