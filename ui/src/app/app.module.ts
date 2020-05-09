import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { AppHttpInterceptorService } from './http-interceptor.service';
import { CountryComponent } from './covid/country/country.component';
import { StateComponent } from './covid/state/state.component';
import { CountryDailyDeathsComponent} from './covid/country/countrydailydeaths/countrydailydeaths.component';
import { CountryTotalDeathsComponent} from './covid/country/countrytotaldeaths/countrytotaldeaths.component';

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
    path: 'country',
    component: CountryComponent
  },
  {
    path: 'state',
    component: StateComponent
  },
  {
    path: '',
    redirectTo: '/country',
    pathMatch: 'full'
  },
];

@NgModule({
  declarations: [
    AppComponent,
    CountryComponent,
    StateComponent,
    CountryDailyDeathsComponent,
    CountryTotalDeathsComponent
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
