export declare const CONSTANTS: {
    KEYS: {
        up: number;
        down: number;
        left: number;
        right: number;
        escape: number;
        enter: number;
        backspace: number;
        delete: number;
        shift: number;
        leftCmd: number;
        rightCmd: number;
        ctrl: number;
        alt: number;
        tab: number;
    };
    TEMPLATES: {
        TEMPLATE_ITEM_CREATE: () => string;
        TEMPLATE_ITEM_DEFAULT: () => string;
        TEMPLATE_GROUP_DEFAULT: () => string;
        TEMPLATE_SELECTOR_SELECTED_ITEMS: () => string;
        TEMPLATE_SELECTOR_DROPDOWN_ITEMS: () => string;
        TEMPLATE_SELECTOR: () => string;
    };
    FUNCTIONS: {
        CONSOLE_LOGGER: ($log: any, type: any, message: string) => void;
        GET_DOM_STYLES: (element: HTMLElement) => {};
    };
};
