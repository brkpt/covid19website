import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoogleChartService } from '../../../google-chart/google-chart.service';
import {
  CovidTrackingService,
  USHistoricalDaily,
} from '../../../covidtracking/covidtracking.service';

class DailyDeaths {
  public date: string = '';
  public deaths: number = 0;
  public day3sma: number = 0;
  public day7sma: number = 0;
  constructor(date: string, deaths: number, day3sma: number, day7sma: number) {
    this.date = date;
    this.deaths = deaths;
    this.day3sma = day3sma;
    this.day7sma = day7sma;
  }
};

@Component({
  selector: 'app-countrydailydeaths',
  templateUrl: './countrydailydeaths.component.html',
  styleUrls: ['./countrydailydeaths.component.css']
})
export class CountryDailyDeathsComponent implements OnInit {
  private gLib: any;

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
      let sorted = data.sort((a: USHistoricalDaily, b: USHistoricalDaily) => {
        return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
      });

      // Collect daily deaths
      let dailyDeaths: DailyDeaths[] = [];
      let startDate = this.convertDate(sorted[0].date.toString());
      dailyDeaths.push(new DailyDeaths(startDate, sorted[0].death, sorted[0].death, sorted[0].death));
      for (let i = 1; i < sorted.length; i++) {
        let dateStr = this.convertDate(sorted[i].date.toString());
        if (i > 2) {
          let death3sma = (
            sorted[i - 3].deathIncrease +
            sorted[i - 2].deathIncrease +
            sorted[i - 1].deathIncrease) / 3;
          if (i > 7) {
            let death7sma = (
              sorted[i - 7].deathIncrease +
              sorted[i - 6].deathIncrease +
              sorted[i - 5].deathIncrease +
              sorted[i - 4].deathIncrease +
              sorted[i - 3].deathIncrease +
              sorted[i - 2].deathIncrease +
              sorted[i - 1].deathIncrease) / 7;
            dailyDeaths.push(new DailyDeaths(dateStr, sorted[i].deathIncrease, death3sma, death7sma));
          } else {
            dailyDeaths.push(new DailyDeaths(dateStr, sorted[i].deathIncrease, death3sma, death3sma));
          }

        } else {
          dailyDeaths.push(new DailyDeaths(dateStr, sorted[i].deathIncrease, sorted[i].deathIncrease, sorted[i].deathIncrease));
        }
      }

      let rawData: any[][] = [['Date', 'Deaths', '3SMA', '7SMA']];
      dailyDeaths.forEach((datum: DailyDeaths) => {
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
    })
  }

  public refreshDailyDeathChart() {
  }
}
