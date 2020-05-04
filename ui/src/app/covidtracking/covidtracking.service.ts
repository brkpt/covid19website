import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

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

export class TotalDeaths {
  public date: string = '';
  public deaths: number = 0;
  constructor(date: string, deaths: number) {
    this.date = date;
    this.deaths = deaths;
  }
}

export class DailyDeaths {
    public date: string = '';
    public deaths: number = 0;
    public sma: number = 0;
    constructor(date: string, deaths: number, sma: number) {
        this.date = date;
        this.deaths = deaths;
        this.sma = sma;
    }
};

export class DailyTesting {
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

export class DailyPositives {
    public date: string = '';
    public positiveRate: number = 0;
    public sma: number = 0;
    constructor(date: string, positiveRate: number, sma: number) {
        this.date = date;
        this.positiveRate = positiveRate;
        this.sma = sma;
    }
};

@Injectable({
    providedIn: 'root'
})
export class CovidTrackingService {
  private countryUrl = 'http://localhost:9000';
  private usData = '/api/us/current';
  private usDaily = '/api/us/daily';

  constructor(private http: HttpClient) {}

  public getCountryData(): Observable<USDailySnapshot[]> { 
    return this.http.get<USDailySnapshot[]>(this.countryUrl + this.usData);
  }

  public getCountryDaily(): Observable<USHistoricalDaily[]> {
    return this.http.get<USHistoricalDaily[]>(this.countryUrl + this.usDaily);
  }

}