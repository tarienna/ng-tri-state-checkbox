import { Component, ElementRef, forwardRef, Input, OnDestroy, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TriStateCheckboxState, ITriStateCheckboxControl, ITriCheckboxRegister } from './tri-state-checkbox.types';

@Component({
    selector: 'ng-tri-state-checkbox',
    templateUrl: './ng-tri-state-checkbox.component.html',
    styleUrls: ['./ng-tri-state-checkbox.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NgTriStateCheckboxComponent),
            multi: true
        }
    ],
    exportAs: 'ngTriStateCheckbox',
    encapsulation: ViewEncapsulation.None
})
export class NgTriStateCheckboxComponent implements OnDestroy, ControlValueAccessor, ITriCheckboxRegister {
    @Input()
    checkboxClass = 'tri-state-checkbox-default';

    private _isDisabled = false;

    controls: Map<ITriStateCheckboxControl, any> = new Map<ITriStateCheckboxControl, any>();

    currentState: TriStateCheckboxState = TriStateCheckboxState.NONE;

    @ViewChild('customCheckbox', { static: false })
    customCheckbox: ElementRef;

    onChanged: (_: any) => void = (_: any) => {};
    onTouched: () => void = () => {};

    constructor(protected renderer: Renderer2) {}

    ngOnDestroy(): void {
        this.controls.clear();
    }

    registerOnChange(fn: any): void {
        if (typeof fn === 'function') {
            this.onChanged = fn;
        } else {
            this.onChanged = (_: any) => {};
        }
    }

    registerOnTouched(fn: any): void {
        if (typeof fn === 'function') {
            this.onTouched = fn;
        } else {
            this.onTouched = () => {};
        }
    }

    setDisabledState(isDisabled: boolean): void {
        this._isDisabled = isDisabled;
        for (const currentControl of this.controls.keys()) {
            currentControl.setDisabled(isDisabled);
        }
    }

    get isDisabled() {
        return this._isDisabled;
    }

    addControl(control: ITriStateCheckboxControl): void {
        if (!!control) {
            this.controls.set(control, control.readValue());
            this.refreshState();
            setTimeout(() => {
                this.emitValueChanged();
            });
        }
    }

    removeControl(control: ITriStateCheckboxControl): void {
        this.controls.delete(control);
        this.refreshState();
        setTimeout(() => {
            this.emitValueChanged();
        });
    }

    changeControlValue(control: ITriStateCheckboxControl, value: any) {
        this.controls.set(control, value);
        this.refreshState();
        this.emitValueChanged();
    }

    refreshState(): void {
        this.currentState = this.getState();
        this.refreshCheckboxState();
    }

    getState(): TriStateCheckboxState {
        let anyWasFalse = false;
        let result: TriStateCheckboxState = TriStateCheckboxState.NONE;

        for (const currentValue of this.controls.values()) {
            if (!!currentValue) {
                result = TriStateCheckboxState.SOME;
            }
            if (!currentValue) {
                anyWasFalse = true;
            }
        }

        if (!anyWasFalse && result === TriStateCheckboxState.SOME) {
            result = TriStateCheckboxState.ALL;
        }

        return result;
    }

    onClick(): void {
        const currentState = this.getState();
        if (currentState === TriStateCheckboxState.SOME || currentState === TriStateCheckboxState.ALL) {
            // gets unselected
            this.writeAllControlValues(false);
            this.currentState = TriStateCheckboxState.NONE;
        } else if (currentState === TriStateCheckboxState.NONE) {
            this.writeAllControlValues(true);
            this.currentState = TriStateCheckboxState.ALL;
        }
        this.refreshCheckboxState();
        this.emitValueChanged();
    }

    public writeAllControlValues(nValue: boolean) {
        for (const currentControl of this.controls.keys()) {
            if (currentControl) {
                currentControl.writeValue(nValue);
            }
        }
    }

    refreshCheckboxState() {
        if (this.customCheckbox && this.customCheckbox.nativeElement) {
            let checked = false;
            let indeterminate = false;
            if (this.currentState === TriStateCheckboxState.ALL) {
                checked = true;
                indeterminate = false;
            } else if (this.currentState === TriStateCheckboxState.SOME) {
                checked = true;
                indeterminate = true;
            }
            this.renderer.setProperty(this.customCheckbox.nativeElement, 'checked', checked);

            // Browser Support for indeterminate: https://caniuse.com/#search=indeterminate
            this.customCheckbox.nativeElement.indeterminate = indeterminate;
        }
    }

    emitValueChanged() {
        const values = [];
        for (const value of this.controls.values()) {
            if (!!value) {
                values.push(value);
            }
        }

        this.onChanged(values);
        this.onTouched();
    }

    reset(): void {
        this.writeAllControlValues(false);
        this.refreshState();
        this.emitValueChanged();
    }

    writeValue(obj: any): void {
        if (!!obj && obj.hasOwnProperty('length') && obj.length > 0) {
            console.warn('It\'s currently not possible to set values. Maybe later there is a solution to do that.');
        }
    }
}
