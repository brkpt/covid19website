import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StateHospitalizedComponent } from './statehospitalized.component';

describe('StatehospitalizedComponent', () => {
  let component: StateHospitalizedComponent;
  let fixture: ComponentFixture<StateHospitalizedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StateHospitalizedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StateHospitalizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
