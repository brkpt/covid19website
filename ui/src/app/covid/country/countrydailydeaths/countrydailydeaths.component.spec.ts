import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountrydailydeathsComponent } from './countrydailydeaths.component';

describe('CountrydailydeathsComponent', () => {
  let component: CountrydailydeathsComponent;
  let fixture: ComponentFixture<CountrydailydeathsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountrydailydeathsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountrydailydeathsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
