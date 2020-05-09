import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoogleChartService } from '../../../google-chart/google-chart.service';
import {
  CovidTrackingService,
  USHistoricalDaily,
} from 'src/app/covidtracking/covidtracking.service';

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
  selector: 'app-countrytesting',
  templateUrl: './countrytesting.component.html',
  styleUrls: ['./countrytesting.component.css']
})
export class CountryTestingComponent implements OnInit {
  private gLib: any = null;

  constructor(
    route: ActivatedRoute,
    private chartServices: GoogleChartService,
    private covidTrackingServices: CovidTrackingService
  ) { }

  ngOnInit() {
    this.checkLoading();
  }

  private checkLoading() {
    if (this.chartServices.getLoaded()) {
      this.gLib = this.chartServices.getGoogle();
      this.getCountryDaily();
    } else {
      // Check again in 3 seconds
      setTimeout(this.checkLoading, 1000);
    }
  }

  public convertDate(oldDate: string) {
    return oldDate.slice(4, 6) + '-' + oldDate.slice(6, 8) + '-' + oldDate.slice(0, 4);
  }

  public getCountryDaily() {
    this.covidTrackingServices.getCountryDaily().subscribe((data: USHistoricalDaily[]) => {
      // Collect the data
      let sorted = data.sort((a: USHistoricalDaily, b: USHistoricalDaily) => {
        return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
      });

      // Collect daily deaths
      let dailyTesting: DailyTesting[] = [];
      let dailyPositive: DailyPositives[] = [];
      let startDate = this.convertDate(sorted[0].date.toString());
      dailyTesting.push(new DailyTesting(startDate, sorted[0].totalTestResults, sorted[0].positive, sorted[0].negative));
      let basePositiveRate = sorted[0].positiveIncrease / sorted[0].totalTestResultsIncrease;
      dailyPositive.push(new DailyPositives(startDate, basePositiveRate, basePositiveRate));
      for (let i = 1; i < sorted.length; i++) {
        let dateStr = this.convertDate(sorted[i].date.toString());
        let positiveRate = sorted[i].positiveIncrease / sorted[i].totalTestResultsIncrease;
        if (i > 2) {
          let positivesma = (
            sorted[i - 3].positiveIncrease +
            sorted[i - 2].positiveIncrease +
            sorted[i - 1].positiveIncrease) / 3;
          dailyTesting.push(new DailyTesting(dateStr, sorted[i].totalTestResultsIncrease, sorted[i].positiveIncrease, positivesma));

          let positiveRate3Sma = (
            sorted[i - 3].positiveIncrease / sorted[i - 3].totalTestResultsIncrease +
            sorted[i - 2].positiveIncrease / sorted[i - 2].totalTestResultsIncrease +
            sorted[i - 1].positiveIncrease / sorted[i - 1].totalTestResultsIncrease
          ) / 3;
          dailyPositive.push(new DailyPositives(dateStr, sorted[i].positiveIncrease / sorted[i].totalTestResultsIncrease, positiveRate3Sma));

        } else {
          dailyTesting.push(new DailyTesting(dateStr, sorted[i].positiveIncrease, sorted[i].positiveIncrease, sorted[i].positiveIncrease));
          dailyPositive.push(new DailyPositives(dateStr, positiveRate, positiveRate));
        }
      }

      let rawData: any[][] = [['Date', 'Positive', 'Tests', 'SMA']];
      dailyTesting.forEach((datum: DailyTesting) => {
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
    })
  }

}
