import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../app.service';

export class USDailySnapshot {
    constructor() {}
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

export interface USHistoricalDaily {
    date: number;
    dateChecked: string;
    death: number;
    deathIncrease: number;
    hash: string;
    hospitalized: number;
    hospitalizedCumulative: number;
    hospitalizedCurrently: number;
    hospitalizedIncrease: number;
    inIcuCumulative: number;
    inIcuCurrently: number;
    negative: number;
    negativeIncrease: number;
    onVentilatorCumulative: number;
    onVentilatorCurrently: number;
    pending: number;
    posNeg: number;
    positive: number;
    positiveIncrease: number;
    recovered: number;
    states: number;
    total: number;
    totalTestResults: number;
    totalTestResulsIncrease: number;
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
    public allData: USHistoricalDaily[] = [];
    @Input() public data: object = [];
    
    private gLib: any;

    private options = {
        width: 640,
        height: 480,
        title: 'Hello'
    }

    constructor(route: ActivatedRoute, private appService: AppService) {
        this.gLib = appService.getGoogle();
        this.gLib.charts.load('current', {'packages': ['corechart']});
        //this.gLib.charts.setOnLoadCallback(this.drawChart.bind(this));
    }

    public getCountryData() {
        this.appService.getCountryData().subscribe((data: USDailySnapshot[]) => {
            this.death = data[0].death;
            this.positive = data[0].positive;
            this.negative = data[0].negative;
        });
    }

    public getCountryDaily() {
        this.appService.getCountryDaily().subscribe((data: USHistoricalDaily[]) => {
            this.allData = data;
            this.refreshChart();
        })
    }

    public refreshChart() {
        let rawData: any[][]  = [['Date', 'Deaths']];
        this.allData.sort((a: USHistoricalDaily, b: USHistoricalDaily) => {
            a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
        }).forEach( (datum: USHistoricalDaily) => {
            let bar = [datum.date.toString(), datum.death];
            rawData.push(bar);
        })

        let newData = this.gLib.visualization.arrayToDataTable(rawData);
        let chart = new this.gLib.visualization.LineChart(document.getElementById('deathsChart'));

        chart.draw(newData, this.options);
    }
}
