import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { AppHttpInterceptorService } from './http-interceptor.service';
import { CountryDailyDeathsComponent} from './covid/country/countrydailydeaths/countrydailydeaths.component';
import { CountryTotalDeathsComponent} from './covid/country/countrytotaldeaths/countrytotaldeaths.component';
import { CountryTestingComponent} from './covid/country/countrytesting/countrytesting.component';
import { StateTotalDeathsComponent} from './covid/state/statedeaths/statetotaldeaths.component';
import { StateHospitalizedComponent} from './covid/state/statehospitalized/statehospitalized.component';

const routes: Routes = [
  {
    path: 'countrydeath',
    component: CountryTotalDeathsComponent
  },
  {
    path: 'countrydaily',
    component: CountryDailyDeathsComponent
  },
  {
    path: 'countrytesting',
    component: CountryTestingComponent
  },
  {
    path: 'statedeath',
    component: StateTotalDeathsComponent
  },
  {
    path: 'statehospitalized',
    component: StateHospitalizedComponent
  },
  {
    path: '',
    redirectTo: '/countrydeath',
    pathMatch: 'full'
  },
];

@NgModule({
  declarations: [
    AppComponent,
    CountryDailyDeathsComponent,
    CountryTotalDeathsComponent,
    CountryTestingComponent,
    StateTotalDeathsComponent,
    StateHospitalizedComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'Csrf-Token',
      headerName: 'Csrf-Token',
    }),
    RouterModule.forRoot(
      routes,
      {enableTracing: true}
    ),
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
