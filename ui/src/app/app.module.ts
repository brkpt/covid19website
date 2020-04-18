import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { RouteExampleComponent } from './route-example/route-example.component';

import { AppService } from './app.service';
import { AppHttpInterceptorService } from './http-interceptor.service';
import { CovidComponent } from './covid/covid.component';
import { StateComponent } from './state/state.component';
import { CountryComponent } from './country/country.component';

import { GoogleChartsModule } from 'angular-google-charts';

const routes: Routes = [
  {
    path: 'state',
    component: StateComponent,
  },
  {
    path: 'country',
    component: CountryComponent,
  },
  {
    path: 'covid',
    component: CovidComponent,
    data: { technology: 'Covid'}
  },
  {
    path: '**',
    redirectTo: '/state',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    RouteExampleComponent,
    CovidComponent,
    StateComponent,
    CountryComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'Csrf-Token',
      headerName: 'Csrf-Token',
    }),
    RouterModule.forRoot(routes),
    GoogleChartsModule
  ],
  providers: [
    AppService,
    {
      multi: true,
      provide: HTTP_INTERCEPTORS,
      useClass: AppHttpInterceptorService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
