
export const DOM_FUNCTIONS = {
    getStyles: (element: HTMLElement) => {
        return !(element instanceof HTMLElement)
            ? {}
            : element.ownerDocument && element.ownerDocument.defaultView.opener
                ? element.ownerDocument.defaultView.getComputedStyle(element)
                : window.getComputedStyle(element);
    }
}