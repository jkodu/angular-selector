export class SelectorDropdownItemComponent {

    public link: (scope: angular.IScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) => void;
    public restrict: string = 'E';
    public templateUrl: string = 'selector/selector-dropdown-item.html';
    public scope: any = {
        items: '=',
    }

    constructor() {
        SelectorDropdownItemComponent.prototype.link = (scope: angular.IScope,
            element: angular.IAugmentedJQuery,
            attrs: angular.IAttributes) => {

            // EXPERIMENTAL
            const constructOptions = (items: Array<any>) => {
                items.reduce((accumulator, currentValue, currentIndex, array) => {

                }, '');
            }


            console.log(scope);
        }
    }

    public static Factory() {
        let directive = () => {
            return new SelectorDropdownItemComponent();
        };
        directive['$inject'] = [];
        return directive;
    }
}