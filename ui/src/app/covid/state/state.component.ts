import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoogleChartService } from '../../google-chart/google-chart.service';
import { 
    CovidTrackingService,
    StateHistorical,
} from 'src/app/covidtracking/covidtracking.service';

@Component({
    selector: 'state-selector',
    templateUrl: './state.component.html',
    styleUrls: ['./state.component.css']
})

export class StateComponent {
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
            this.getStateHistorical();
        } else {
            // Check again in 3 seconds
            setTimeout(this.checkLoading, 1000);
        }
    }

    public convertDate(oldDate: string) {
        return oldDate.slice(4,6) + '-' + oldDate.slice(6,8) + '-' + oldDate.slice(0,4);
    }

    private updateDailyDeathChart(stateData: StateHistorical[]) {
        let rawData: any[][] = [['Date','Deaths']];
        stateData.forEach( (d: StateHistorical) => {
            rawData.push( [this.convertDate(d.date.toString()), d.death]);
        });
        let chartData = this.gLib.visualization.arrayToDataTable(rawData);

        let options = {
            title: 'Total Deaths (US)',
            width: 1100,
            height: 700,
            seriesType: 'bars',
        };

        let totalDeathChart = new this.gLib.visualization.ComboChart(document.getElementById('totalDeaths'));

        totalDeathChart.draw(chartData, options);
    }

    private updateDailyHospitalizedChart(stateData: StateHistorical[]) {
        let rawData: any[][] = [['Date','Hospitalizations']];
        stateData.forEach( (d: StateHistorical) => {
            rawData.push( [this.convertDate(d.date.toString()), d.hospitalizedIncrease]);
        });
        let chartData = this.gLib.visualization.arrayToDataTable(rawData);

        let options = {
            title: 'Total Hospitalizations (UT)',
            width: 1100,
            height: 700,
            seriesType: 'bars',
        };

        let totalDeathChart = new this.gLib.visualization.ComboChart(document.getElementById('hospitalizations'));

        totalDeathChart.draw(chartData, options);

    }
    
    private getStateHistorical() {
        this.covidTrackingServices.getHistoricalByState('ut').subscribe((data: StateHistorical[]) => {
            const stateData = data.sort((a: StateHistorical, b: StateHistorical) => {
                return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
            });

            this.updateDailyDeathChart(stateData);
            this.updateDailyHospitalizedChart(stateData);
        });
    }
}