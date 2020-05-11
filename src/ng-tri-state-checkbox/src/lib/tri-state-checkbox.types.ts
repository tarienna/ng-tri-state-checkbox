export enum TriStateCheckboxState {
    NONE = 'NONE',
    SOME = 'SOME',
    ALL = 'ALL'
}

export interface ITriStateCheckboxControl {
    readValue(): any;
    writeValue(value: any): void;
    setDisabled(state: boolean): void;
}

export interface ITriCheckboxRegister {
    addControl(control: ITriStateCheckboxControl): void;
    removeControl(control: ITriStateCheckboxControl): void;
    changeControlValue(control: ITriStateCheckboxControl, value: any);
    getState(): TriStateCheckboxState;
}
