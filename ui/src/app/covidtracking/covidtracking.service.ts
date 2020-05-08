import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface USDailySnapshot {
    positive: number;
    negative: number;
    pending: number;
    hospitalizedCurrently: number;
    hospitalizedCumulative: number;
    inIcuCurrently: number;
    inIcuCumulative: number;
    onVentilatorCurrently: number;
    onVentilatorCumulative: number;
    recovered: number;
    hash: number;
    lastModified: string;
    death: number;
    hospitalized: number;
    total: number;
    totalTestResults: number;
    posNeg: number;
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


export interface StateHistorical {
  date: number;
  state: string;
  positive: number;
  negative: number;
  pending: number;
  hospitalizedCurrently: number;
  hospitalizedCumulative: number;
  inIcuCurrently: number;
  inIcuCumulative: number;
  onVentilatorCurrently: number;
  onVentilatorCumulative: number;
  recovered: number;
  hash: string;
  dateChecked: string;
  death: number;
  hospitalized: number;
  total: number;
  totalTestResults: number;
  posNeg: number;
  fips: string;
  deathIncrease: number;
  hospitalizedIncrease: number;
  negativeIncrease: number;
  positiveIncrease: number;
  totalTestResultsIncrease: number;
}

@Injectable({
    providedIn: 'root'
})
export class CovidTrackingService {
  private countryUrl = 'http://localhost:9000';
  private usData = '/api/us/current';
  private usDaily = '/api/us/daily';
  private stateHistorical = '/api/states/historical';

  constructor(private http: HttpClient) {}

  public getCountryData(): Observable<USDailySnapshot[]> { 
    return this.http.get<USDailySnapshot[]>(this.countryUrl + this.usData);
  }

  public getCountryDaily(): Observable<USHistoricalDaily[]> {
    return this.http.get<USHistoricalDaily[]>(this.countryUrl + this.usDaily);
  }

  public getStateHistorical(): Observable<StateHistorical[]> {
    return this.http.get<StateHistorical[]>(this.stateHistorical);
  }

  public getHistoricalByState(state: string): Observable<StateHistorical[]> {
    let params = new HttpParams().set('state', 'ut');
    return this.http.get<StateHistorical[]>(this.stateHistorical, { params });
  }
}