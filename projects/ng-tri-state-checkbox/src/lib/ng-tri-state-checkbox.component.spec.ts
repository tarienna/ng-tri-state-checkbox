import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgTriStateCheckboxComponent } from './ng-tri-state-checkbox.component';
import { NgTriStateControlDirective } from './ng-tri-state-control.directive';
import { ITriStateCheckboxControl, TriStateCheckboxState } from './tri-state-checkbox.types';
import Spy = jasmine.Spy;

describe('Test NgTriStateCheckboxComponent', () => {
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

        return fixture.whenRenderingDone().then(() => {
            triStateCheckboxComponent = testComponent.triStateCheckbox;
            done();
        });
    });
    it('should register all directives', () => {
        const controls: Map<ITriStateCheckboxControl, any> = triStateCheckboxComponent.controls;
        expect(controls.size).toEqual(defaultTestData.length);
    });

    it('should clear all controls after destroy', () => {
        triStateCheckboxComponent.ngOnDestroy();
        const controls: Map<ITriStateCheckboxControl, any> = triStateCheckboxComponent.controls;
        expect(controls.size).toEqual(0);
    });

    it('it should register on change correct', () => {
        triStateCheckboxComponent.registerOnChange(null);
        expect(triStateCheckboxComponent.onChanged).toBeDefined();
        expect(triStateCheckboxComponent.onChanged).not.toBeNull();
        expect(typeof triStateCheckboxComponent.onChanged).toEqual('function');
        triStateCheckboxComponent.registerOnChange(undefined);
        expect(triStateCheckboxComponent.onChanged).toBeDefined();
        expect(triStateCheckboxComponent.onChanged).not.toBeNull();
        expect(typeof triStateCheckboxComponent.onChanged).toEqual('function');

        const testFunction = _ => {
        };
        triStateCheckboxComponent.registerOnChange(testFunction);
        expect(triStateCheckboxComponent.onChanged).toBeDefined();
        expect(triStateCheckboxComponent.onChanged).not.toBeNull();
        expect(typeof triStateCheckboxComponent.onChanged).toEqual('function');
        expect(triStateCheckboxComponent.onChanged).toEqual(testFunction);
    });

    it('it should register on touch correct', () => {
        triStateCheckboxComponent.registerOnTouched(null);
        expect(triStateCheckboxComponent.onTouched).toBeDefined();
        expect(triStateCheckboxComponent.onTouched).not.toBeNull();
        expect(typeof triStateCheckboxComponent.onTouched).toEqual('function');
        triStateCheckboxComponent.registerOnTouched(undefined);
        expect(triStateCheckboxComponent.onTouched).toBeDefined();
        expect(triStateCheckboxComponent.onTouched).not.toBeNull();
        expect(typeof triStateCheckboxComponent.onTouched).toEqual('function');

        const testFunction = () => {
        };
        triStateCheckboxComponent.registerOnTouched(testFunction);
        expect(triStateCheckboxComponent.onTouched).toBeDefined();
        expect(triStateCheckboxComponent.onTouched).not.toBeNull();
        expect(typeof triStateCheckboxComponent.onTouched).toEqual('function');
        expect(triStateCheckboxComponent.onTouched).toEqual(testFunction);
    });

    it('should be enabled by default', () => {
        expect(triStateCheckboxComponent.isDisabled).toEqual(false);
    });

    describe('when set disabled state', () => {
        beforeEach(() => {
            triStateCheckboxComponent.controls = TriStateCheckboxControlImpl.generateValueMap();
        });

        describe('when disable component', () => {
            beforeEach(() => {
                triStateCheckboxComponent.setDisabledState(true);
                fixture.detectChanges();
            });

            it('should be disabled', () => {
                expect(triStateCheckboxComponent.isDisabled).toEqual(true);
            });

            it('should disable native element', () => {
                expect(triStateCheckboxComponent.customCheckbox.nativeElement.disabled).toEqual(true);
            });

            it('should disable all child directives', () => {
                triStateCheckboxComponent.controls.forEach((value, key) => {
                    expect((key as TriStateCheckboxControlImpl).isDisabled).toEqual(true);
                });
            });

            describe('when enable component again', () => {
                beforeEach(() => {
                    triStateCheckboxComponent.setDisabledState(false);
                    fixture.detectChanges();
                });

                it('should be enabled', () => {
                    expect(triStateCheckboxComponent.isDisabled).toEqual(false);
                });

                it('should enable native element', () => {
                    expect(triStateCheckboxComponent.customCheckbox.nativeElement.disabled).toEqual(false);
                });

                it('should enable all child directives', () => {
                    triStateCheckboxComponent.controls.forEach((value, key) => {
                        expect((key as TriStateCheckboxControlImpl).isDisabled).toEqual(false);
                    });
                });
            });
        });
    });

    it('should only not add existing controls', () => {
        const controlsCountBefore = triStateCheckboxComponent.controls.size;
        triStateCheckboxComponent.addControl(null);
        triStateCheckboxComponent.addControl(undefined);
        expect(triStateCheckboxComponent.controls.size).toEqual(controlsCountBefore);
    });

    describe('when add control', () => {
        let refreshSpy: Spy;
        let emitValueSpy: Spy;
        let testControlForAdd: TriStateCheckboxControlImpl;
        beforeEach(() => {
            testControlForAdd = new TriStateCheckboxControlImpl();
            refreshSpy = spyOn(triStateCheckboxComponent, 'refreshState');
            refreshSpy.and.callThrough();

            emitValueSpy = spyOn(triStateCheckboxComponent, 'emitValueChanged');
            emitValueSpy.and.callThrough();
        });

        it('should add control to map', () => {
            expect(triStateCheckboxComponent.controls.has(testControlForAdd)).toBeFalsy();
            triStateCheckboxComponent.addControl(testControlForAdd);
            expect(triStateCheckboxComponent.controls.has(testControlForAdd)).toBeTruthy();
        });

        it('should refresh the state of the checkbox', () => {
            triStateCheckboxComponent.addControl(testControlForAdd);
            expect(refreshSpy).toHaveBeenCalled();
        });

        it('should emit the value', fakeAsync(() => {
            triStateCheckboxComponent.addControl(testControlForAdd);
            tick();
            expect(emitValueSpy).toHaveBeenCalled();
        }));
    });

    describe('when remove control', () => {
        let refreshSpy: Spy;
        let emitValueSpy: Spy;
        const testControlForRemove = new TriStateCheckboxControlImpl();
        beforeEach(() => {
            triStateCheckboxComponent.addControl(testControlForRemove);
            refreshSpy = spyOn(triStateCheckboxComponent, 'refreshState');
            refreshSpy.and.callThrough();

            emitValueSpy = spyOn(triStateCheckboxComponent, 'emitValueChanged');
            emitValueSpy.and.callThrough();
        });

        it('should remove control', () => {
            expect(triStateCheckboxComponent.controls.has(testControlForRemove)).toBeTruthy();
            triStateCheckboxComponent.removeControl(testControlForRemove);
            expect(triStateCheckboxComponent.controls.has(testControlForRemove)).toBeFalsy();
        });

        it('should refresh the state of the checkbox', () => {
            triStateCheckboxComponent.removeControl(testControlForRemove);
            expect(refreshSpy).toHaveBeenCalled();
        });

        it('should emit the value', fakeAsync(() => {
            triStateCheckboxComponent.removeControl(testControlForRemove);
            tick();
            expect(emitValueSpy).toHaveBeenCalled();
        }));
    });

    describe('when change control value', () => {
        let refreshStateSpy: Spy;
        let emitValueSpy: Spy;
        beforeEach(() => {
            refreshStateSpy = spyOn(triStateCheckboxComponent, 'refreshState');
            refreshStateSpy.and.callThrough();
            emitValueSpy = spyOn(triStateCheckboxComponent, 'emitValueChanged');
            emitValueSpy.and.callThrough();
        });

        it('should refresh state', () => {
            const firstControl: NgTriStateControlDirective = testComponent.triStateDirectives.first;
            expect(firstControl).toBeDefined();
            expect(firstControl).not.toBeNull();
            const firstControlValue = firstControl.value;
            expect(firstControlValue).toBeDefined();
            expect(firstControlValue).not.toBeNull();

            triStateCheckboxComponent.changeControlValue(firstControl, firstControlValue);
            expect(triStateCheckboxComponent.controls.get(firstControl)).toEqual(firstControlValue);
            expect(refreshStateSpy).toHaveBeenCalled();
            expect(emitValueSpy).toHaveBeenCalled();
        });
    });

    describe('when get state', () => {
        it('should be none when no one is checked', () => {
            triStateCheckboxComponent.controls.forEach((_, control) => control.writeValue(false));
            fixture.detectChanges();
            expect(triStateCheckboxComponent.getState()).toEqual(TriStateCheckboxState.NONE);
        });

        it('should be some when one is checked ', () => {
            let count = 0;
            triStateCheckboxComponent.controls.forEach((_, control) => control.writeValue(count++ < 1));
            fixture.detectChanges();
            expect(triStateCheckboxComponent.getState()).toEqual(TriStateCheckboxState.SOME);
        });

        it('should be some when more than one is checked', () => {
            let count = 0;
            triStateCheckboxComponent.controls.forEach((_, control) =>
                control.writeValue(count++ < triStateCheckboxComponent.controls.size - 1)
            );
            fixture.detectChanges();
            expect(triStateCheckboxComponent.getState()).toEqual(TriStateCheckboxState.SOME);
        });

        it('should be all when all are checked', () => {
            triStateCheckboxComponent.controls.forEach((_, control) => control.writeValue(true));
            fixture.detectChanges();
            expect(triStateCheckboxComponent.getState()).toEqual(TriStateCheckboxState.ALL);
        });
    });

    describe('when click component', () => {
        it('should unselect when some was selected', () => {
            // Select some
            let count = 0;
            triStateCheckboxComponent.controls.forEach((_, control) =>
                control.writeValue(count++ < triStateCheckboxComponent.controls.size - 1)
            );
            fixture.detectChanges();

            triStateCheckboxComponent.onClick();
            fixture.detectChanges();

            expect(triStateCheckboxComponent.getState()).toEqual(TriStateCheckboxState.NONE);
        });

        it('should select all when none was selected', () => {
            // Select none
            triStateCheckboxComponent.controls.forEach((_, control) => control.writeValue(false));
            fixture.detectChanges();

            triStateCheckboxComponent.onClick();
            fixture.detectChanges();

            expect(triStateCheckboxComponent.getState()).toEqual(TriStateCheckboxState.ALL);
        });

        it('should unselect all when all was selected', () => {
            // Select none
            triStateCheckboxComponent.controls.forEach((_, control) => control.writeValue(true));
            fixture.detectChanges();

            triStateCheckboxComponent.onClick();
            fixture.detectChanges();

            expect(triStateCheckboxComponent.getState()).toEqual(TriStateCheckboxState.NONE);
        });
    });

    describe('when write to all control value', () => {
        it('should write all values', () => {
            triStateCheckboxComponent.writeAllControlValues(true);
            fixture.detectChanges();
            triStateCheckboxComponent.controls.forEach(value => expect(value).toBeTruthy());

            triStateCheckboxComponent.writeAllControlValues(false);
            fixture.detectChanges();
            triStateCheckboxComponent.controls.forEach(value => expect(value).toEqual(null));
        });

        it('should not write to null control value', () => {
            triStateCheckboxComponent.controls.set(null, null);
            triStateCheckboxComponent.writeAllControlValues(false);
        });
    });

    describe('when refresh state', () => {
        let rendererSetPropertySpy: Spy;

        beforeEach(() => {
            rendererSetPropertySpy = spyOn((triStateCheckboxComponent as any).renderer, 'setProperty');
            rendererSetPropertySpy.and.callThrough();
        });

        it('should only update when element ref exist', () => {
            triStateCheckboxComponent.customCheckbox = null;
            triStateCheckboxComponent.refreshCheckboxState();
            fixture.detectChanges();
            expect(rendererSetPropertySpy).not.toHaveBeenCalled();
        });

        it('should only update when native element on element ref exist', () => {
            triStateCheckboxComponent.customCheckbox = {nativeElement: null};
            triStateCheckboxComponent.refreshCheckboxState();
            fixture.detectChanges();
            expect(rendererSetPropertySpy).not.toHaveBeenCalled();
        });

        describe('when all are selected', () => {
            beforeEach(() => {
                triStateCheckboxComponent.writeAllControlValues(true);
                fixture.detectChanges();
            });

            it('should check element when all are true', () => {
                expect(triStateCheckboxComponent.getState()).toEqual(TriStateCheckboxState.ALL);

                expect(triStateCheckboxComponent.customCheckbox).toBeDefined();
                expect(triStateCheckboxComponent.customCheckbox).not.toBeNull();

                expect(triStateCheckboxComponent.customCheckbox.nativeElement).toBeDefined();
                expect(triStateCheckboxComponent.customCheckbox.nativeElement).not.toBeNull();

                triStateCheckboxComponent.refreshCheckboxState();

                expect(rendererSetPropertySpy).toHaveBeenCalledWith(
                    triStateCheckboxComponent.customCheckbox.nativeElement,
                    'checked',
                    true
                );

                expect(triStateCheckboxComponent.customCheckbox.nativeElement.indeterminate).toBeFalsy();
            });
        });

        describe('when some are selected', () => {
            beforeEach(() => {
                let count = 0;
                triStateCheckboxComponent.controls.forEach((_, control) =>
                    control.writeValue(count++ < triStateCheckboxComponent.controls.size - 1)
                );
                fixture.detectChanges();
            });

            it('should check element when all are true', () => {
                expect(triStateCheckboxComponent.getState()).toEqual(TriStateCheckboxState.SOME);

                expect(triStateCheckboxComponent.customCheckbox).toBeDefined();
                expect(triStateCheckboxComponent.customCheckbox).not.toBeNull();

                expect(triStateCheckboxComponent.customCheckbox.nativeElement).toBeDefined();
                expect(triStateCheckboxComponent.customCheckbox.nativeElement).not.toBeNull();

                triStateCheckboxComponent.refreshCheckboxState();

                expect(rendererSetPropertySpy).toHaveBeenCalledWith(
                    triStateCheckboxComponent.customCheckbox.nativeElement,
                    'checked',
                    true
                );
                expect(triStateCheckboxComponent.customCheckbox.nativeElement.indeterminate).toBeTruthy();
            });
        });

        describe('when no one is selected', () => {
            beforeEach(() => {
                triStateCheckboxComponent.writeAllControlValues(false);
                fixture.detectChanges();
            });

            it('should check element when all are true', () => {
                expect(triStateCheckboxComponent.getState()).toEqual(TriStateCheckboxState.NONE);

                expect(triStateCheckboxComponent.customCheckbox).toBeDefined();
                expect(triStateCheckboxComponent.customCheckbox).not.toBeNull();

                expect(triStateCheckboxComponent.customCheckbox.nativeElement).toBeDefined();
                expect(triStateCheckboxComponent.customCheckbox.nativeElement).not.toBeNull();

                triStateCheckboxComponent.refreshCheckboxState();

                expect(rendererSetPropertySpy).toHaveBeenCalledWith(
                    triStateCheckboxComponent.customCheckbox.nativeElement,
                    'checked',
                    false
                );

                expect(triStateCheckboxComponent.customCheckbox.nativeElement.indeterminate).toBeFalsy();
            });
        });
    });

    describe('when output selected', () => {
        it('should output', () => {
            // All
            triStateCheckboxComponent.controls.forEach((_, control) => {
                control.writeValue(true);
            });

            triStateCheckboxComponent.emitValueChanged();

            fixture.detectChanges();

            expect(testComponent.testDataSelected).toBeTruthy();
            expect(testComponent.testDataSelected.length).toEqual(triStateCheckboxComponent.controls.size);
            expect(testComponent.testDataSelected).toEqual(defaultTestData);
        });

        it('should only output selected items', () => {
            let count = 0;
            const expectedValues = [];
            triStateCheckboxComponent.controls.forEach((_, control) => {
                control.writeValue(count < 2);
                if (count < 2) {
                    const value = control.readValue();
                    expect(value).toBeDefined();
                    expect(value).not.toBeNull();
                    expectedValues.push(value);
                }
                count++;
            });
            triStateCheckboxComponent.emitValueChanged();
            fixture.detectChanges();

            expect(testComponent.testDataSelected).toBeTruthy();
            expect(testComponent.testDataSelected.length).toEqual(2);
            expect(testComponent.testDataSelected).toEqual(expectedValues);
        });
    });

    describe('when reset', () => {
        let refreshStateSpy: Spy;
        let emitValueSpy: Spy;
        beforeEach(() => {
            refreshStateSpy = spyOn(triStateCheckboxComponent, 'refreshState');
            refreshStateSpy.and.callThrough();
            emitValueSpy = spyOn(triStateCheckboxComponent, 'emitValueChanged');
            emitValueSpy.and.callThrough();
        });

        it('should set all control values to false', () => {
            triStateCheckboxComponent.controls = TriStateCheckboxControlImpl.generateValueMap();
            triStateCheckboxComponent.reset();
            fixture.detectChanges();

            triStateCheckboxComponent.controls.forEach((value, control) => {
                expect(value).toBeNull();
                expect(control.readValue()).toEqual(false);
            });
        });

        it('should emit changed value and refresh state', () => {
            triStateCheckboxComponent.controls = TriStateCheckboxControlImpl.generateValueMap();
            triStateCheckboxComponent.reset();
            fixture.detectChanges();
            expect(refreshStateSpy).toHaveBeenCalled();
            expect(emitValueSpy).toHaveBeenCalled();
        });
    });

    describe('when write value', () => {
        let consoleWarnSpy: Spy;
        let originalFunction: any;
        beforeEach(() => {
            originalFunction = console.warn;
            consoleWarnSpy = spyOn(console, 'warn');
        });

        afterEach(() => {
            console.warn = originalFunction;
        });

        it('should output console text when try to update the selected values', () => {
            triStateCheckboxComponent.writeValue([...defaultTestData]);
            expect(consoleWarnSpy).toHaveBeenCalled();
        });
    });
});
