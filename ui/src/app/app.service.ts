import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/index';
import { USDailySnapshot, USHistoricalDaily } from './country/country.component';
import { AppModule } from './app.module';

declare var google: any;

/**
 * Class representing application service.
 *
 * @class AppService.
 */
@Injectable() 
export class AppService {
  private google: any;
  private serviceUrl = '/api/summary';
  private dataPostTestUrl = '/api/postTest';
  private countryUrl = 'http://localhost:9000';
  private usData = '/api/us/current';
  private usDaily = '/api/us/daily';

  constructor(private http: HttpClient) {
    this.google = google;
  }

  /**
   * Makes a http get request to retrieve the welcome message from the backend service.
   */
  public getWelcomeMessage() {
    return this.http.get(this.serviceUrl).pipe(
      map(response => response)
    );
  }

  /**
   * Makes a http post request to send some data to backend & get response.
   */
  public sendData(): Observable<any> {
    return this.http.post(this.dataPostTestUrl, {});
  }

  public getCountryData(): Observable<USDailySnapshot[]> { 
    return this.http.get<USDailySnapshot[]>(this.countryUrl + this.usData);
  }

  public getCountryDaily(): Observable<USHistoricalDaily[]> {
    return this.http.get<USHistoricalDaily[]>(this.countryUrl + this.usDaily);
  }

  public getGoogle(): any { 
    return this.google;
  }
}
