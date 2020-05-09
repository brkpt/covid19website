import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryDailyDeathsComponent } from './countrydailydeaths/countrydailydeaths.component';
import { CountryTotalDeathsComponent } from './countrytotaldeaths/countrytotaldeaths.component';
import { CountryTestingComponent } from './countrytesting/countrytesting.component';

@NgModule({
  declarations: [
    CountryDailyDeathsComponent, 
    CountryTotalDeathsComponent, 
    CountryTestingComponent
  ],
  imports: [
    CommonModule
  ]
})
export class CountryModule { }
