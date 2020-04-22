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

class DailyDeaths {
    public date: string = '';
    public deaths: number = 0;
    constructor(date: string, deaths: number) {
        this.date = date;
        this.deaths = deaths;
    }
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
    public dailyDeaths: DailyDeaths[] = [];
    @Input() public data: object = [];
    
    private gLib: any;

    private options = {
        width: 1000,
        height: 500,
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

    public convertDate(oldDate: string) {
        return oldDate.slice(4,6) + '-' + oldDate.slice(6,8) + '-' + oldDate.slice(0,4);
    }

    public getCountryDaily() {
        this.appService.getCountryDaily().subscribe((data: USHistoricalDaily[]) => {
            this.allData = data.sort((a: USHistoricalDaily, b: USHistoricalDaily) => {
                return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
            });
            this.dailyDeaths = [];
            this.dailyDeaths.push(new DailyDeaths(this.convertDate(this.allData[0].date.toString()), this.allData[0].death));
            for(let i = 1; i < this.allData.length; i++) {
                let delta = this.allData[i].death - this.allData[i-1].death;
                let dateStr = this.convertDate(this.allData[i].date.toString());
                this.dailyDeaths.push(new DailyDeaths(dateStr, delta));
            }
            this.refreshChart();
        })
    }

    public refreshChart() {
        let rawData: any[][]  = [['Date', 'Deaths']];
        this.dailyDeaths.forEach( (datum: DailyDeaths) => {
            let bar = [datum.date, datum.deaths];
            rawData.push(bar);
        });

        let newData = this.gLib.visualization.arrayToDataTable(rawData);
        let chart = new this.gLib.visualization.ColumnChart(document.getElementById('deathsChart'));

        chart.draw(newData, this.options);
    }
}
