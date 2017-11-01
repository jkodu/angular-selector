export const GET_SELECTED_ITEM_TEMPLATE = (option: any, index: number, filteredOptions: any[], parentReferences: any) => {
    let boundValue = parentReferences.getObjValue(option, parentReferences.groupAttr);
    boundValue = boundValue
        ? boundValue
        : typeof option === 'object'
            ? JSON.stringify(option)
            : option;
    const closeButton = parentReferences.multiple
        ? `<div class="selector-helper"><span class="selector-icon" id="sos-data-index-${index}"></span></div>`
        : ``;
    return `<li>${boundValue} ${closeButton}</li>`;
};


export const CONSOLE_LOGGER = ($log: angular.ILogService, message: string) => {
    $log.info(`Component: Selector On Sterorids: ${message}`);
}
