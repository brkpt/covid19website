import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../app.service';

export class USDailySnapshot {
    constructor() {
    }
    public positive: number = 0;
    public negative: number = 0;
    public pending: number = 0;
    public hospitalizedCurrently: number = 0;
    public hospitalizedCumulative: number = 0;
    public inIcuCurrently: number = 0;
    public inIcuCumulative: number = 0;
    public onVentilatorCurrently: number = 0;
    public onVentilatorCumulative: number = 0;
    public recovered: number = 0;
    public hash: number = 0;
    public lastModified: string = '';
    public death: number = 0;
    public hospitalized: number = 0;
    public total: number = 0;
    public totalTestResults: number = 0;
    public posNeg: number = 0;
};

@Component({
    selector: 'covid-selector',
    templateUrl: './covid.component.html',
    styleUrls: ['./covid.component.css']
})
export class CovidComponent {
    public positive: number = 0;
    public negative: number = 0;
    public death: number = 0;
    public myData = [
    ['London', 8136000],
    ['New York', 8538000],
    ['Paris', 2244000],
    ['Berlin', 3470000],
    ['Kairo', 19500000],
    ];

    constructor(route: ActivatedRoute, private appService: AppService) {
    }

    public getCountryData() {
        this.appService.getCountryData().subscribe((data: USDailySnapshot[]) => {
            this.death = data[0].death;
            this.positive = data[0].positive;
            this.negative = data[0].negative;
        });
    }
}
