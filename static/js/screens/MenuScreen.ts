namespace Zed {

    export class MenuScreen extends Screen {

        //************************************************************
        //* fields
        //************************************************************

        viewName: string = Constants.GameScreens.MENU;
        viewModel: ViewModels.MainMenuViewModel = void 0;

        load():void {
            // Create menu data
            this.viewModel = {
                onClick: this._onMenuItemClicked.bind(this),
                mainMenu: [
                    {
                        id: "start",
                        text: "Start spill"
                    },
                    {
                        id: "settings",
                        text: "Instillinger"
                    }
                ]
            };
        }

        unload():void {
        }

        pause():void {

        }

        resume():void {

        }

        init(htmlElement: HTMLElement):void {
        }

//************************************************************
        //* Events
        //************************************************************

        private _onMenuItemClicked(menu: ViewModels.MainMenuViewModel, event: JQueryEventObject): void {
            var target = event.target;
            var item = ko.dataFor(target);

            switch(item.id) {
                case "start":
                    this._screenManager.pushScreen(new GameScreen());// (new GameScreen());
                    break;
                case "settings":
                    console.log("Sttings");
                    break;
            }
        }
    }
}