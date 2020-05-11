import {
    Directive,
    ElementRef,
    forwardRef,
    HostListener,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Renderer2,
    SimpleChange,
    SimpleChanges
} from '@angular/core';
import { ITriCheckboxRegister, ITriStateCheckboxControl } from './tri-state-checkbox.types';
import { CheckboxControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
    selector: 'input[type=checkbox][ngTriStateControl]',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NgTriStateControlDirective),
            multi: true
        }
    ],
    exportAs: 'ngTriStateControl'
})
export class NgTriStateControlDirective extends CheckboxControlValueAccessor
    implements OnInit, OnDestroy, OnChanges, ITriStateCheckboxControl {
    checkedValue: any = null;
    isDisabled = false;

    @Input()
    value: any;

    // tslint:disable-next-line:no-input-rename
    @Input('ngTriStateControl')
    registry: ITriCheckboxRegister;

    constructor(protected renderer: Renderer2, protected elementRef: ElementRef) {
        super(renderer, elementRef);
    }

    ngOnInit(): void {
        if (!!this.registry) {
            this.registry.addControl(this);
        }
    }

    ngOnDestroy(): void {
        if (!!this.registry) {
            this.registry.removeControl(this);
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes.hasOwnProperty('registry') && !changes.registry.firstChange) {
            const registerChanged: SimpleChange = changes.registry;
            if (!!registerChanged.previousValue) {
                registerChanged.previousValue.removeControl(this);
            }

            if (!!registerChanged.currentValue) {
                registerChanged.currentValue.addControl(this);
            }
        }
    }

    readValue(): any {
        if (this.checkedValue) {
            return !!this.value ? this.value : this.checkedValue;
        }
        return null;
    }

    writeValue(value: any) {
        super.writeValue(value);
        this.checkedValue = value;
        this.updateValueOnRegistry();
    }

    setDisabled(state: boolean) {
        this.isDisabled = state;
        super.setDisabledState(state);
    }

    private updateValueOnRegistry() {
        if (!!this.registry) {
            this.registry.changeControlValue(this, this.readValue());
        }
    }

    @HostListener('change', ['$event.target.checked'])
    onChangeValue(value) {
        this.checkedValue = value;
        this.updateValueOnRegistry();
    }
}
