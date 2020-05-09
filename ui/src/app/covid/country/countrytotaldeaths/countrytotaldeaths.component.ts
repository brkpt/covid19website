import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoogleChartService } from '../../../google-chart/google-chart.service';
import {
  CovidTrackingService,
  USHistoricalDaily,
} from 'src/app/covidtracking/covidtracking.service';

class TotalDeaths {
  public date: string = '';
  public deaths: number = 0;
  constructor(date: string, deaths: number) {
    this.date = date;
    this.deaths = deaths;
  }
};

@Component({
  selector: 'app-countrytotaldeaths',
  templateUrl: './countrytotaldeaths.component.html',
  styleUrls: ['./countrytotaldeaths.component.css']
})
export class CountryTotalDeathsComponent implements OnInit {
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
      let rawData: any[][] = [['Date', 'Deaths']];
      sorted.forEach( (d: USHistoricalDaily) => {
        rawData.push( [this.convertDate(d.date.toString()), d.death]);

      })

      // Collect daily testing
      let options = {
        title: 'Total Deaths (US)',
        width: 1100,
        height: 700,
        seriesType: 'bars',
      };

      let newData = this.gLib.visualization.arrayToDataTable(rawData);
      let totalDeathChart = new this.gLib.visualization.ComboChart(document.getElementById('totalDeaths'));

      totalDeathChart.draw(newData, options);
      })
    }

}
