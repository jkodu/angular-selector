export const GET_DOM_STYLES = (element: HTMLElement) => {
    return !(element instanceof HTMLElement)
        ? {}
        : (element.ownerDocument && element.ownerDocument.defaultView.opener)
            ? element.ownerDocument.defaultView.getComputedStyle(element)
            : window.getComputedStyle(element);
}

export const GET_SELECTED_ITEM_TEMPLATE = (option: any, index: number, filteredOptions: any[], parentReferences: any) => {
    let boundValue = parentReferences.getObjValue(option, parentReferences.groupAttr);
    boundValue = boundValue
        ? boundValue
        : typeof option === 'object'
            ? JSON.stringify(option)
            : option;
    const closeButton = parentReferences.multiple
        ? `<div class="selector-helper"><span class="selector-icon" data-index="${index}"></span></div>`
        : ``;
    return `<li>${boundValue} ${closeButton}</li>`;
};

export const GET_DROPDOWN_ITEM_TEMPLATE = (option: any, index: number, filteredOptions: any[], parentReferences: any, highlighted: number) => {
    console.log(highlighted, index);
    const cls = `${highlighted === index ? 'active' : ''} ${parentReferences.groupAttr && parentReferences.getObjValue(option, parentReferences.groupAttr) ? 'grouped' : ''}`;
    let boundValue = parentReferences.getObjValue(option, parentReferences.groupAttr);
    boundValue = boundValue
        ? boundValue
        : typeof option === 'object'
            ? JSON.stringify(option)
            : option;
    return `<li class="selector-option js-data-item ${cls}" data-index="${index}">${boundValue}</li>`;
};

export const GET_DROPDOWN_GROUP_TEMPLATE = (option: any, index: number, filteredOptions: any[], parentReferences: any) => {
    if (parentReferences.groupAttr) {
        const boundValue = parentReferences.getObjValue(option, parentReferences.groupAttr);
        if (boundValue && index === 0 || parentReferences.getObjValue(filteredOptions[index - 1], parentReferences.groupAttr) !== boundValue) {
            return `<li class="selector-optgroup">${boundValue}</li>`;
        } else {
            return ``;
        }
    } else {
        return ``;
    }
};

export const CONSOLE_LOGGER = ($log: angular.ILogService, message: string) => {
    $log.info(`Component: Selector On Sterorids: ${message}`);
}
