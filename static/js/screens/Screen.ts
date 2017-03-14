namespace Zed {
    "use strict";

    export abstract class Screen implements IScreen {

        //************************************************************
        //* Fields
        //************************************************************

        viewName: string;
        viewModel: any;
        initProxy: () => void = this._initProxy.bind(this);

        protected _screenManager: ScreenManager;

        //************************************************************
        //* Public member functions
        //************************************************************

        abstract load():void;
        abstract unload():void;
        abstract pause():void;
        abstract resume():void;
        abstract init(htmlElement: HTMLElement): void;

        /**
         *
         * @param screenManager
         */
        setManager(screenManager:Zed.ScreenManager):void {
            this._screenManager = screenManager;
        }

        //************************************************************
        //* Private member functions
        //************************************************************

        private _initProxy(nodeList): void {
            console.log(nodeList);

            this.init(nodeList[1]);
        }

    }
}