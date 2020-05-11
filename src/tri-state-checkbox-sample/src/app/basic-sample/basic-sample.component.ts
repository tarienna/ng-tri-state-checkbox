import { Component, OnInit } from '@angular/core';
import { ITaskModel } from '../task.model';

@Component({
    selector: 'app-basic-sample',
    templateUrl: './basic-sample.component.html',
    styleUrls: ['./basic-sample.component.scss'],
    exportAs: 'appBasicSample'
})
export class BasicSampleComponent implements OnInit {
    tasks: ITaskModel[];
    dayTasks: {
        monday: ITaskModel[],
        tuesday: ITaskModel[],
        wednesday: ITaskModel[],
        thursday: ITaskModel[],
        friday: ITaskModel[],
        saturday: ITaskModel[],
        sunday: ITaskModel[],
    } = {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
    };

    ngOnInit(): void {
        let currentValues: ITaskModel[] = null;
        if (typeof localStorage !== 'undefined') {
            const currentValueString = localStorage.getItem('my-tasks');
            if (!!currentValueString && currentValueString.length > 2) {
                currentValues = JSON.parse(currentValueString);
            }
        }

        if (!currentValues) {
            currentValues = this.generateExample();
        }

        this.tasks = currentValues;
    }

    public reset() {
        this.tasks = this.generateExample();
    }

    private generateExample(): ITaskModel[] {
        return [
            {
                name: 'Clean the sleeping room',
                weekday: {
                    tuesday: true,
                    wednesday: true
                }
            },
            {
                name: 'Clean the kitchen',
                weekday: {
                    tuesday: true,
                    wednesday: true,
                    thursday: true,
                    friday: true,
                    saturday: true,
                    sunday: true,
                }
            },
            {
                name: 'Clean the bathroom',
                weekday: {
                    wednesday: true,
                    sunday: true
                }
            },
            {
                name: 'Wash the clothes',
                weekday: {
                    wednesday: true,
                    sunday: true,
                }
            },
        ];
    }
}
