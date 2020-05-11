import { Component, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgTriStateCheckboxComponent } from './ng-tri-state-checkbox.component';
import { NgTriStateControlDirective } from './ng-tri-state-control.directive';
import { ITriStateCheckboxControl } from './tri-state-checkbox.types';
import Spy = jasmine.Spy;

describe('Test TriStateControlDirective', () => {
    interface ITestData {
        id: number;
    }

    @Component({
        template:
            '<ng-tri-state-checkbox #triStateCheckbox="ngTriStateCheckbox" [(ngModel)]="testDataSelected"></ng-tri-state-checkbox><input #triStateDirectives="ngTriStateControl" type="checkbox" *ngFor="let testData of testDataAvailable" [ngTriStateControl]="triStateCheckbox" [value]="testData">'
    })
    class TestComponent {
        @ViewChild('triStateCheckbox', {static: false})
        triStateCheckbox: NgTriStateCheckboxComponent;

        @ViewChildren('triStateDirectives')
        triStateDirectives: QueryList<NgTriStateControlDirective>;

        testDataAvailable: ITestData[] = [];
        testDataSelected: ITestData[] = [];
    }

    class TriStateCheckboxControlImpl implements ITriStateCheckboxControl {
        private value = false;
        isDisabled = false;

        static generateValueMap(count = 10) {
            const result = new Map<ITriStateCheckboxControl, any>();
            for (let i = 0; i < count; i++) {
                result.set(new TriStateCheckboxControlImpl(), null);
            }
            return result;
        }

        readValue(): any {
            return this.value;
        }

        setDisabled(state: boolean): void {
            this.isDisabled = state;
        }

        writeValue(value: any): void {
            this.value = value;
        }
    }

    const defaultTestData: ITestData[] = [
        {id: 0},
        {id: 1},
        {id: 2},
        {id: 3},
        {id: 4},
        {id: 5},
        {id: 6},
        {id: 7},
        {id: 8},
        {id: 9}
    ];
    let testComponent: TestComponent;
    let fixture: ComponentFixture<TestComponent>;

    let triStateControlDirective: NgTriStateControlDirective;
    let triStateControlDirectiveValue: ITestData;
    let triStateCheckboxComponent: NgTriStateCheckboxComponent;


    beforeEach(async(() => {
        return TestBed.configureTestingModule({
            imports: [BrowserModule, FormsModule, ReactiveFormsModule],
            declarations: [NgTriStateCheckboxComponent, NgTriStateControlDirective, TestComponent],
            providers: [BrowserModule, FormsModule, ReactiveFormsModule]
        }).compileComponents();
    }));

    beforeEach(done => {
        fixture = TestBed.createComponent(TestComponent);
        testComponent = fixture.componentInstance;

        // setup test data
        testComponent.testDataAvailable = [...defaultTestData];
        fixture.autoDetectChanges();
        fixture.detectChanges();

        fixture.whenRenderingDone().then(() => {
            triStateControlDirective = testComponent.triStateDirectives.first;
            triStateControlDirectiveValue = triStateControlDirective.value;
            triStateCheckboxComponent = testComponent.triStateCheckbox;
            done();
        });
    });

    describe('when directive gets initialized', () => {
        it('should add control to registry when registry is connected with component', () => {
            expect(triStateControlDirective.registry).toBeDefined();
            expect(triStateControlDirective.registry).not.toBeNull();

            const registerSpy = spyOn(triStateCheckboxComponent, 'addControl');
            triStateControlDirective.ngOnInit();
            fixture.detectChanges();

            expect(registerSpy).toHaveBeenCalled();
        });

        it('should check that control is connected with component', () => {
            triStateControlDirective.registry = null;
            const registerSpy = spyOn(triStateCheckboxComponent, 'addControl');
            triStateControlDirective.ngOnInit();
            fixture.detectChanges();

            expect(registerSpy).not.toHaveBeenCalled();
        });
    });

    describe('when directive gets destroyed', () => {
        it('should unregister the control', () => {
            triStateControlDirective.ngOnInit();
            fixture.detectChanges();

            const unregisterSpy = spyOn(triStateCheckboxComponent, 'removeControl');
            triStateControlDirective.ngOnDestroy();
            expect(unregisterSpy).toHaveBeenCalled();
        });
    });

    describe('when value changes', () => {
        let fixtureOtherCheckbox: ComponentFixture<NgTriStateCheckboxComponent>;
        let otherTriStateCheckbox: NgTriStateCheckboxComponent;

        let addControlSpyOther: Spy;
        let removeControlSpyOld: Spy;

        beforeEach(async(() => {
            fixtureOtherCheckbox = TestBed.createComponent(NgTriStateCheckboxComponent);
            otherTriStateCheckbox = fixtureOtherCheckbox.componentInstance;
            fixtureOtherCheckbox.detectChanges();

            addControlSpyOther = spyOn(otherTriStateCheckbox, 'addControl').and.callThrough();
            removeControlSpyOld = spyOn(triStateCheckboxComponent, 'removeControl').and.callThrough();

            return fixtureOtherCheckbox.whenRenderingDone();
        }));

        describe('when has previous and new tri state checkbox component', () => {
            let changes: SimpleChanges = null;
            beforeEach(() => {
                changes = {
                    registry: {
                        firstChange: false,
                        previousValue: triStateCheckboxComponent,
                        currentValue: otherTriStateCheckbox,
                        isFirstChange(): boolean {
                            return this.firstChange;
                        }
                    }
                };
            });

            it('should unregister on previous', () => {
                // generate another tri state box
                triStateControlDirective.ngOnChanges(changes);
                expect(removeControlSpyOld).toHaveBeenCalledWith(triStateControlDirective);
            });

            it('should register on new component', () => {
                // generate another tri state box
                triStateControlDirective.ngOnChanges(changes);
                expect(addControlSpyOther).toHaveBeenCalledWith(triStateControlDirective);
            });
        });

        describe('when has no previous value', () => {
            let changes: SimpleChanges = null;
            beforeEach(() => {
                changes = {
                    registry: {
                        firstChange: false,
                        previousValue: null,
                        currentValue: otherTriStateCheckbox,
                        isFirstChange(): boolean {
                            return this.firstChange;
                        }
                    }
                };

                triStateControlDirective.registry = null;
            });

            it('should not unregister there is no component where it is registered', () => {
                triStateControlDirective.ngOnChanges(changes);
                expect(removeControlSpyOld).not.toHaveBeenCalled();
            });

            it('should register on new component', () => {
                triStateControlDirective.ngOnChanges(changes);
                expect(addControlSpyOther).toHaveBeenCalledWith(triStateControlDirective);
            });
        });

        describe('when has no currentValue value', () => {
            let changes: SimpleChanges = null;
            beforeEach(() => {
                changes = {
                    registry: {
                        firstChange: false,
                        previousValue: triStateCheckboxComponent,
                        currentValue: null,
                        isFirstChange(): boolean {
                            return this.firstChange;
                        }
                    }
                };

                triStateControlDirective.registry = null;
            });

            it('should unregister', () => {
                triStateControlDirective.ngOnChanges(changes);
                expect(removeControlSpyOld).toHaveBeenCalledWith(triStateControlDirective);
            });

            it('should register not try to register', () => {
                triStateControlDirective.ngOnChanges(changes);
                expect(addControlSpyOther).not.toHaveBeenCalled();
            });
        });

        describe('when has no currentValue value', () => {
            let changes: SimpleChanges = null;
            beforeEach(() => {
                changes = {
                    triStateControl: {
                        firstChange: false,
                        previousValue: null,
                        currentValue: null,
                        isFirstChange(): boolean {
                            return this.firstChange;
                        }
                    }
                };

                triStateControlDirective.registry = null;
            });

            it('should not unregister there is no component where it is registered', () => {
                triStateControlDirective.ngOnChanges(changes);
                expect(removeControlSpyOld).not.toHaveBeenCalled();
            });

            it('should register not try to register', () => {
                triStateControlDirective.ngOnChanges(changes);
                expect(addControlSpyOther).not.toHaveBeenCalled();
            });
        });

        describe('when it will be changed for the first time', () => {
            let changes: SimpleChanges = null;
            beforeEach(() => {
                changes = {
                    triStateControl: {
                        firstChange: true,
                        previousValue: triStateCheckboxComponent,
                        currentValue: otherTriStateCheckbox,
                        isFirstChange(): boolean {
                            return this.firstChange;
                        }
                    }
                };
            });

            it('should not unregister on old component', () => {
                // generate another tri state box
                triStateControlDirective.ngOnChanges(changes);
                expect(removeControlSpyOld).not.toHaveBeenCalled();
            });

            it('should not register on new component', () => {
                // generate another tri state box
                triStateControlDirective.ngOnChanges(changes);
                expect(addControlSpyOther).not.toHaveBeenCalled();
            });
        });
    });

    describe('when read value', () => {
        describe('when checkbox is checked', () => {
            beforeEach(() => {
                triStateControlDirective.checkedValue = true;
            });

            it('should return current value when it is checked', () => {
                expect(triStateControlDirective.readValue()).toEqual(triStateControlDirectiveValue);
            });
        });

        describe('when checkbox is not checked', () => {
            beforeEach(() => {
                triStateControlDirective.checkedValue = false;
            });

            it('should return null', () => {
                expect(triStateControlDirective.readValue()).toEqual(null);
            });
        });

        describe('when directive has no value', () => {
            beforeEach(() => {
                triStateControlDirective.value = null;
            });

            describe('when it is checked', () => {
                it('should return true ', () => {
                    triStateControlDirective.writeValue(true);
                    expect(triStateControlDirective.readValue()).toEqual(true);
                });
            });

            describe('when it is not checked', () => {
                it('should return null', () => {
                    triStateControlDirective.writeValue(false);
                    expect(triStateControlDirective.readValue()).toEqual(null);
                });
            });
        });
    });

    describe('when write value', () => {
        describe('when value is positive', () => {
            it('should update value in registry', () => {
                const changeControlValueSpy: Spy = spyOn(triStateCheckboxComponent, 'changeControlValue');
                triStateControlDirective.writeValue(true);
                expect(changeControlValueSpy).toHaveBeenCalledWith(triStateControlDirective, triStateControlDirectiveValue);
            });

            it('should not try to update not connected registry', () => {
                triStateControlDirective.registry = null;
                expect(() => {
                    triStateControlDirective.writeValue(true);
                }).not.toThrow();
            });
        });

        describe('when value is negative', () => {
            it('should update value in registry', () => {
                const changeControlValueSpy: Spy = spyOn(triStateCheckboxComponent, 'changeControlValue');
                triStateControlDirective.writeValue(false);
                expect(changeControlValueSpy).toHaveBeenCalledWith(triStateControlDirective, null);
            });

            it('should not try to update not connected registry', () => {
                triStateControlDirective.registry = null;
                expect(() => {
                    triStateControlDirective.writeValue(false);
                }).not.toThrow();
            });
        });

        describe('when set disable state', () => {
            it('should update is disabled property', () => {
                triStateControlDirective.setDisabled(true);
                expect(triStateControlDirective.isDisabled).toEqual(true);
                fixture.detectChanges();
                triStateControlDirective.setDisabled(false);
                expect(triStateControlDirective.isDisabled).toEqual(false);
                fixture.detectChanges();
            });
        });

        describe('when change checkbox status', () => {
            it('should update registry value', () => {
                const changeControlValueSpy: Spy = spyOn(triStateCheckboxComponent, 'changeControlValue');
                triStateControlDirective.onChangeValue(true);
                expect(changeControlValueSpy).toHaveBeenCalledWith(triStateControlDirective, triStateControlDirectiveValue);

                triStateControlDirective.onChangeValue(false);
                expect(changeControlValueSpy).toHaveBeenCalledWith(triStateControlDirective, null);
            });
        });
    });
});
