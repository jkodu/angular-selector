export class SelectorNgModelChangedComponent {

    public require: string = 'ngModel';
    public scope: any = {
        onSelectorNgModelChanged: '&'
    };

    constructor() {
    }

    link = (scope: angular.IScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes, controller: angular.IController) => {
        let oldValue;
        controller.$formatters.push((value) => {
            oldValue = value;
            return value;
        });
        controller.$viewChangeListeners.push(() => {
            const ngModelName = attrs['ngModel']; // TODO: UNDEFINED CHECK

            (<any>scope).onSelectorNgModelChanged()(ngModelName, oldValue, controller.$modelValue);
            oldValue = controller.$modelValue;
        });
    }

    public static Factory(debug: boolean) {
        let directive = () => {
            return new SelectorNgModelChangedComponent();
        };
        directive['$inject'] = [];
        return directive;
    }
}