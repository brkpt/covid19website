import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoogleChartService } from '../../google-chart/google-chart.service';
import { 
    CovidTrackingService,
    DailyDeaths,
    DailyPositives,
    DailyTesting,
    TotalDeaths,
    USHistoricalDaily,
} from 'src/app/covidtracking/covidtracking.service';

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

    private gLib: any = null;

    constructor(
        route: ActivatedRoute, 
        private chartServices: GoogleChartService, 
        private covidTrackingServices: CovidTrackingService
    ) {
        this.checkLoading();
    }

    private checkLoading() {
        if(this.chartServices.getLoaded()) {
            this.gLib = this.chartServices.getGoogle();
            this.getCountryDaily();
        } else {
            // Check again in 3 seconds
            setTimeout(this.checkLoading, 1000);
        }
    }

    public convertDate(oldDate: string) {
        return oldDate.slice(4,6) + '-' + oldDate.slice(6,8) + '-' + oldDate.slice(0,4);
    }

    public getCountryDaily() {
        this.covidTrackingServices.getCountryDaily().subscribe((data: USHistoricalDaily[]) => {
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
            this.dailyDeaths.push(new DailyDeaths(startDate, this.allData[0].death, this.allData[0].death, this.allData[0].death));
            this.dailyTesting.push(new DailyTesting(startDate,this.allData[0].totalTestResults, this.allData[0].positive, this.allData[0].negative));
            let basePositiveRate = this.allData[0].positiveIncrease/this.allData[0].totalTestResultsIncrease;
            this.dailyPositive.push(new DailyPositives(startDate, basePositiveRate, basePositiveRate));
            for(let i = 1; i < this.allData.length; i++) {
                let dateStr = this.convertDate(this.allData[i].date.toString());
                let positiveRate = this.allData[i].positiveIncrease/this.allData[i].totalTestResultsIncrease;
                this.totalDeaths.push(new TotalDeaths(dateStr, this.allData[i].death));
                if(i > 2) {
                    let death3sma = (
                        this.allData[i-3].deathIncrease +
                        this.allData[i-2].deathIncrease +
                        this.allData[i-1].deathIncrease) / 3;
                    if(i > 7) {
                        let death7sma = (
                            this.allData[i-7].deathIncrease +
                            this.allData[i-6].deathIncrease +
                            this.allData[i-5].deathIncrease +
                            this.allData[i-4].deathIncrease +
                            this.allData[i-3].deathIncrease +
                            this.allData[i-2].deathIncrease +
                            this.allData[i-1].deathIncrease) / 7;
                        this.dailyDeaths.push(new DailyDeaths(dateStr, this.allData[i].deathIncrease, death3sma, death7sma));
                    } else {
                        this.dailyDeaths.push(new DailyDeaths(dateStr, this.allData[i].deathIncrease, death3sma, death3sma));
                    }

                    let positivesma = (
                        this.allData[i-3].positiveIncrease +
                        this.allData[i-2].positiveIncrease +
                        this.allData[i-1].positiveIncrease) / 3;
                    this.dailyTesting.push(new DailyTesting(dateStr, this.allData[i].totalTestResultsIncrease, this.allData[i].positiveIncrease, positivesma));

                    let positiveRate3Sma = (
                        this.allData[i-3].positiveIncrease/this.allData[i-3].totalTestResultsIncrease +
                        this.allData[i-2].positiveIncrease/this.allData[i-2].totalTestResultsIncrease +
                        this.allData[i-1].positiveIncrease/this.allData[i-1].totalTestResultsIncrease
                    )/3;
                    this.dailyPositive.push(new DailyPositives(dateStr, this.allData[i].positiveIncrease/this.allData[i].totalTestResultsIncrease, positiveRate3Sma));

                } else {
                    this.dailyDeaths.push(new DailyDeaths(dateStr, this.allData[i].deathIncrease, this.allData[i].deathIncrease, this.allData[i].deathIncrease));
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
        };

        let newData = this.gLib.visualization.arrayToDataTable(rawData);
        let totalDeathChart = new this.gLib.visualization.ComboChart(document.getElementById('totalDeaths'));

        totalDeathChart.draw(newData, options);
    }

    public refreshDailyDeathChart() {
        let rawData: any[][]  = [['Date', 'Deaths', '3SMA', '7SMA']];
        this.dailyDeaths.forEach( (datum: DailyDeaths) => {
            let bar = [datum.date, datum.deaths, datum.day3sma, datum.day7sma];
            rawData.push(bar);
        });

        let options = {
            title: 'Daily Deaths (US)',
            width: 1100,
            height: 700,
            seriesType: 'bars',
            series: { 
                1: {
                    type: 'line',
                    color: 'green'
                }, 
                2: {
                    type: 'line',
                    color: 'orange'
                }
            }
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
