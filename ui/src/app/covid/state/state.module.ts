import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateHospitalizedComponent } from './statehospitalized/statehospitalized.component';
import { StateTotalDeathsComponent } from './statedeaths/statetotaldeaths.component';

@NgModule({
  declarations: [
    StateHospitalizedComponent,
    StateTotalDeathsComponent
  ],
  imports: [
    CommonModule,
    StateTotalDeathsComponent,

  ]
})
export class StateModule { }
