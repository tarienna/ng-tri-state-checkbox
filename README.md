# NgTriStateCheckbox
This is a three state checkbox for angular 9, which is easy to use and implement. It supports custom styling and can be easily modified.

It can be used to select some entries from a list and control those entries. The user can select / unselect all entries by one click.

![Sample Image 1](https://github.com/tarienna/ng-tri-state-checkbox/blob/master/readme-assets/sample-image.png)

## Installation
It can be installed with npm or yarn
```bash
npm install ng-tri-state-checkbox --save
```
or:
```bash
yarn install ng-tri-state-checkbox
```

### Add NgTriStateCheckboxModule to your module
To use the component you have to add the module "NgTriStateCheckboxModule" to your application.
```typescript
import { NgModule } from '@angular/core';
import { NgTriStateCheckboxModule } from 'ng-tri-state-checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        // This modules are required to use the ngModel to access the the value of the checkbox
        FormsModule, 
        ReactiveFormsModule,
        // Simply add this module
        NgTriStateCheckboxModule 
    ],
})
export class AppModule { }

```

## Usage
For a more complex implementation see the [Sample application](#sample-application) section in this documentation.
First create the tree state checkbox:
```html
<ng-tri-state-checkbox [(ngModel)]="checkedCountries" #myTriStateBox="ngTriStateCheckbox"></ng-tri-state-checkbox>
```

Then create the controllers with values:
```html
<input type="checkbox" [ngTriStateControl]="myTriStateBox" [value]="{country: 'USA'}" [(ngModel)]="usaIsChecked">
<input type="checkbox" [ngTriStateControl]="myTriStateBox" [value]="{country: 'Germany'}" [(ngModel)]="germanyIsChecked">
<input type="checkbox" [ngTriStateControl]="myTriStateBox" [value]="{country: 'Great Britain'}" [(ngModel)]="greatBritainIsChecked">
...
```

### API
#### NgTriStateCheckboxComponent
**Typ:** Component<br />
**Tag:** ng-tri-state-checkbox<br />
**Export as:** ngTriStateCheckbox

This component is the three (tri) state control. It will handle the ngTriStateControls and output their values.

##### ngModel
**Typ:** Template Tag <br />
**Input:** will be ignored at the moment<br />
**Output:** An array of values from the checked ngTriStateControl checkboxes.

##### checkboxClass
**Typ:** Template Tag <br />
**Input:** Checkbox class to use a custom theme

#### NgTriStateControlDirective
**Typ:** Directive<br />
**Tag:** ngTriStateControl<br />
**Supported HTML Tags:** input[type="checkbox"] <br/>
**Export as:** ngTriStateControl <br />
**Input**: ngTriStateCheckbox <br />
**Required tags:** value <br />

The value of this checkbox will only be added to the ngModel output of the connected "ngTriStateCheckbox", when this checkbox is checked.

##### value
**Typ:** Template Tag <br />
**Input:** The value of the connected ngTriStateCheckbox.


## Custom styles
See the example style in: [src/tri-state-checkbox-sample/src/app/basic-sample/basic-sample.component.scss](https://github.com/tarienna/ng-tri-state-checkbox/tree/master/src/tri-state-checkbox-sample/src/app/basic-sample/basic-sample.component.scss).
And the usage in the sunday [src/tri-state-checkbox-sample/src/app/basic-sample/basic-sample.component.html](https://github.com/tarienna/ng-tri-state-checkbox/tree/master/src/tri-state-checkbox-sample/src/app/basic-sample/basic-sample.component.html) checkbox.

To replace the default style for the component simply use the "checkboxClass" tag and set your css class.
```html
<th scope="col">Sunday<br /><ng-tri-state-checkbox ... checkboxClass="tri-state-checkbox-sunday"></ng-tri-state-checkbox></th>
```

## Sample application
The sample application's sourcecode can be found at: [src/tri-state-checkbox-sample/](https://github.com/tarienna/ng-tri-state-checkbox/tree/master/src/tri-state-checkbox-sample/).


### Before you start 
To run the sample application, you need to download the source code.

#### Download the source code
You can download the source code using [git](#download-the-source-code-with-git) or as a [zip](#download-the-source-code-as-zip). Descriptions are below.
##### Download the Source code with git
Before you download the source code create a new empty directory! Open the commandline in the created directory and check out the source code.
```bash
git clone https://github.com/tarienna/ng-tri-state-checkbox.git
```
##### Download the source code as zip
There is also the possibility to download the project as zip: [Click here to download](https://github.com/tarienna/ng-tri-state-checkbox/archive/master.zip). After downloading you have to unzip the package.

#### Install the node packages
To install all dependencies execute the following command:
```bash
npm install
```

#### Start the Application
To run the sample application execute the following command:
```bash
npm run start:example
```
