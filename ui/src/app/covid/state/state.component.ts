import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoogleChartService } from '../../google-chart/google-chart.service';
import { 
    CovidTrackingService,
    StateHistorical,
    TotalDeaths
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

    private getStateHistorical() {
        this.covidTrackingServices.getStateHistorical().subscribe((data: StateHistorical[]) => {
            // Collect the data
            const utahData = data.filter((d: StateHistorical) => d.state == 'UT');
            const stateData = utahData.sort((a: StateHistorical, b: StateHistorical) => {
                return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
            });

            let deaths: TotalDeaths[] = [];
            for(let i=0; i < stateData.length; i++) {
                deaths.push(new TotalDeaths(this.convertDate(stateData[i].date.toString()), stateData[i].death));
            };

            let rawData: any[][] = [['Date','Deaths']];
            deaths.forEach( (d: TotalDeaths) => {
                let data = [d.date, d.deaths];
                rawData.push(data);
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
        });
    }
}