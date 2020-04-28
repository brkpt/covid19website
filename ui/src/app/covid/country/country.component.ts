import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../../app.service';

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
    totalTestResultsIncrease: number;
};

class TotalDeaths {
  public date: string = '';
  public deaths: number = 0;
  constructor(date: string, deaths: number) {
    this.date = date;
    this.deaths = deaths;
  }
}

class DailyDeaths {
    public date: string = '';
    public deaths: number = 0;
    public sma: number = 0;
    constructor(date: string, deaths: number, sma: number) {
        this.date = date;
        this.deaths = deaths;
        this.sma = sma;
    }
};

class DailyTesting {
    public date: string = '';
    public tests: number = 0;
    public positive: number = 0;
    public sma: number = 0;
    constructor(date: string, tests: number, positive: number, sma: number) {
        this.date = date;
        this.tests = tests;
        this.positive = positive;
        this.sma = sma;
    }
};

class DailyPositives {
    public date: string = '';
    public positiveRate: number = 0;
    public sma: number = 0;
    constructor(date: string, positiveRate: number, sma: number) {
        this.date = date;
        this.positiveRate = positiveRate;
        this.sma = sma;
    }
};

@Component({
    selector: 'country-selector',
    templateUrl: './country.component.html',
    styleUrls: ['./country.component.css']
})
export class CountryComponent {
    public positive: number = 0;
    public negative: number = 0;
    public death: number = 0;
    public allData: USHistoricalDaily[] = [];
    public totalDeaths: TotalDeaths[] = [];
    public dailyDeaths: DailyDeaths[] = [];
    public dailyTesting: DailyTesting[] = [];
    public dailyPositive: DailyPositives[] = [];

    private gLib: any;

    constructor(route: ActivatedRoute, private appService: AppService) {
        this.gLib = appService.getGoogle();
        this.gLib.charts.load('current', {'packages': ['corechart','table','bars','column']});
        this.gLib.charts.setOnLoadCallback(this.getCountryDaily());
    }

    public convertDate(oldDate: string) {
        return oldDate.slice(4,6) + '-' + oldDate.slice(6,8) + '-' + oldDate.slice(0,4);
    }

    public getCountryDaily() {
        this.appService.getCountryDaily().subscribe((data: USHistoricalDaily[]) => {
            // Collect the data
            this.allData = data.sort((a: USHistoricalDaily, b: USHistoricalDaily) => {
                return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
            });

            // Collect daily deaths
            this.dailyDeaths = [];
            this.dailyTesting = [];
            this.dailyPositive = [];
            let startDate = this.convertDate(this.allData[0].date.toString());
            this.totalDeaths.push(new TotalDeaths(startDate, this.allData[0].death));
            this.dailyDeaths.push(new DailyDeaths(startDate, this.allData[0].death, this.allData[0].death));
            this.dailyTesting.push(new DailyTesting(startDate,this.allData[0].posNeg, this.allData[0].positive, this.allData[0].negative));
            let basePositiveRate = this.allData[0].positiveIncrease/this.allData[0].totalTestResultsIncrease;
            this.dailyPositive.push(new DailyPositives(startDate, basePositiveRate, basePositiveRate));
            for(let i = 1; i < this.allData.length; i++) {
                let dateStr = this.convertDate(this.allData[i].date.toString());
                let positiveRate = this.allData[i].positiveIncrease/this.allData[i].totalTestResultsIncrease;
                this.totalDeaths.push(new TotalDeaths(dateStr, this.allData[i].death));
                if(i > 2) {
                    let deathsma = (
                        this.allData[i-3].deathIncrease +
                        this.allData[i-2].deathIncrease +
                        this.allData[i-1].deathIncrease) / 3;
                    this.dailyDeaths.push(new DailyDeaths(dateStr, this.allData[i].deathIncrease, deathsma));

                    let positivesma = (
                        this.allData[i-3].positiveIncrease +
                        this.allData[i-2].positiveIncrease +
                        this.allData[i-1].positiveIncrease) / 3;
                    this.dailyTesting.push(new DailyTesting(dateStr, this.allData[i].totalTestResultsIncrease, this.allData[i].positiveIncrease, positivesma));

                    let positiveRateSma = (
                        this.allData[i-3].positiveIncrease/this.allData[i-3].totalTestResultsIncrease +
                        this.allData[i-2].positiveIncrease/this.allData[i-2].totalTestResultsIncrease +
                        this.allData[i-1].positiveIncrease/this.allData[i-1].totalTestResultsIncrease
                    )/3;
                    this.dailyPositive.push(new DailyPositives(dateStr, this.allData[i].positiveIncrease/this.allData[i].totalTestResultsIncrease, positiveRateSma));
                } else {
                    this.dailyDeaths.push(new DailyDeaths(dateStr, this.allData[i].deathIncrease, this.allData[i].deathIncrease));
                    this.dailyTesting.push(new DailyTesting(dateStr, this.allData[i].positiveIncrease, this.allData[i].positiveIncrease, this.allData[i].positiveIncrease));
                    this.dailyPositive.push(new DailyPositives(dateStr, positiveRate, positiveRate));
                }
            }

            // Collect daily testing
            this.refreshCharts();
        })
    }

    public refreshTotalDeathsChart() {
        let rawData: any[][]  = [['Date', 'Deaths']];
        this.totalDeaths.forEach( (datum: TotalDeaths) => {
            let bar = [datum.date, datum.deaths];
            rawData.push(bar);
        });

        let options = {
            title: 'Total Deaths (US)',
            width: 1100,
            height: 700,
            seriesType: 'bars',
        }

        let newData = this.gLib.visualization.arrayToDataTable(rawData);
        let totalDeathChart = new this.gLib.visualization.ComboChart(document.getElementById('totalDeaths'));

        totalDeathChart.draw(newData, options);
    }

    public refreshDailyDeathChart() {
        let rawData: any[][]  = [['Date', 'Deaths', 'SMA']];
        this.dailyDeaths.forEach( (datum: DailyDeaths) => {
            let bar = [datum.date, datum.deaths, datum.sma];
            rawData.push(bar);
        });

        let options = {
            title: 'Daily Deaths (US)',
            width: 1100,
            height: 700,
            seriesType: 'bars',
            series: { 1: {type: 'line'}}
        }

        let newData = this.gLib.visualization.arrayToDataTable(rawData);
        let dailyDeathChart = new this.gLib.visualization.ComboChart(document.getElementById('dailyDeaths'));

        dailyDeathChart.draw(newData, options);
    }

    public refreshDailyPositiveChart() {
        let rawData: any[][]  = [['Date', 'Positive', 'Tests', 'SMA']];
        this.dailyTesting.forEach( (datum: DailyTesting) => {
            let data = [datum.date, datum.positive, datum.tests, datum.sma];
            rawData.push(data);
        });

        let options = {
            title: 'Daily Positive (US)',
            width: 1100,
            height: 700,
            seriesType: 'bars',
            isStacked: true,
            series: {
                0: {
                    color: 'blue'
                },
                1: {
                    color: 'green'
                },
                2: {
                    type: 'line',
                    color: 'orange'
                }
            }
        }

        let newData = this.gLib.visualization.arrayToDataTable(rawData);
        let dailyPositiveChart = new this.gLib.visualization.ComboChart(document.getElementById('dailyTesting'));

        dailyPositiveChart.draw(newData, options);

    }

    public refreshDailyPositiveRateChart() {
        let rawData: any[][]  = [['Date', 'Positive Rate', 'SMA']];
        this.dailyPositive.forEach( (datum: DailyPositives) => {
            let data = [datum.date, datum.positiveRate, datum.sma];
            rawData.push(data);
        });

        let options = {
            title: 'Daily Positive Rate (US)',
            width: 1100,
            height: 700,
            seriesType: 'bars',
            series: {
                0: {
                    color: 'blue'
                },
                1: {
                    type: 'line',
                    color: 'orange'
                }
            }
        }

        let newData = this.gLib.visualization.arrayToDataTable(rawData);
        let dailyPositiveRateChart = new this.gLib.visualization.ComboChart(document.getElementById('dailyPositiveRate'));

        dailyPositiveRateChart.draw(newData, options);

    }

    /**
     * Refreshes the daily death chart
     */
    public refreshCharts() {
        this.refreshTotalDeathsChart();
        this.refreshDailyDeathChart();
        this.refreshDailyPositiveChart();
        this.refreshDailyPositiveRateChart();
    }
}
