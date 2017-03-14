namespace Zed {

    export class Bindings {

        public static initCustomBindings() {
            ko.bindingHandlers["cellCss"] = {
                update: this._cellCss.bind(this)
            }
        }


        private static _cellCss(element, valueAccessor, allBindings, viewModel: Cell, bindingContext) {

            var type =  ko.unwrap(viewModel.playerType);
            switch (type) {
                case PlayerType.NONE:
                    element.classList.remove("p1");
                    element.classList.remove("p2");
                    break;
                case PlayerType.LOCAL:
                    element.classList.add("p1");
                    break;
                case PlayerType.OPPONENT:
                    element.classList.add("p2");
                    break;
            }

            if (viewModel.isSet && viewModel.isSet()) {
                element.classList.add("active");
            } else {
                element.classList.remove("active");
            }


        }
    }

    Bindings.initCustomBindings();
}