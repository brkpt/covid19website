import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryDailyDeathsComponent } from './countrydailydeaths/countrydailydeaths.component';
import { CountryTotalDeathsComponent } from './countrytotaldeaths/countrytotaldeaths.component';

@NgModule({
  declarations: [
    CountryDailyDeathsComponent, 
    CountryTotalDeathsComponent
  ],
  imports: [
    CommonModule
  ]
})
export class CountryModule { }
