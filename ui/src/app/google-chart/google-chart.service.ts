import { Injectable } from '@angular/core';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleChartService {
  private google: any;
  private loaded: boolean = false;
  
  constructor() { 
    this.google = google;
    this.google.charts.load('current', {'packages': ['corechart']});
    this.google.charts.setOnLoadCallback(this.setLoaded());
  }

  public setLoaded() {
    this.loaded = true;
  }

  public getLoaded() {
    return this.loaded;
  }

  public getGoogle() {
    return this.google;
  }
}
