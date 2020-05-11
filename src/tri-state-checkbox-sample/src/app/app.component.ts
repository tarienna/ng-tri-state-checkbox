import { Component, ViewChild } from '@angular/core';
import { BasicSampleComponent } from './basic-sample/basic-sample.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    @ViewChild('sampleComponent', {static: false})
    sampleComponent: BasicSampleComponent;

    reset() {
        setTimeout(() => {
            this.sampleComponent.reset();
        });
    }
}
