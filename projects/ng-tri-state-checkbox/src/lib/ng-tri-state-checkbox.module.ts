import { NgModule } from '@angular/core';
import { NgTriStateCheckboxComponent } from './ng-tri-state-checkbox.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgTriStateControlDirective } from './ng-tri-state-control.directive';
import { CommonModule } from '@angular/common';



@NgModule({
    declarations: [NgTriStateCheckboxComponent, NgTriStateControlDirective],
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    exports: [NgTriStateCheckboxComponent, NgTriStateControlDirective]
})
export class NgTriStateCheckboxModule { }
