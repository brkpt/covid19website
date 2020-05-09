import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StateTotalDeathsComponent } from './statetotaldeaths.component';

describe('StatetotaldeathsComponent', () => {
  let component: StateTotalDeathsComponent;
  let fixture: ComponentFixture<StateTotalDeathsComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StateTotalDeathsComponent ]
    }
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StateTotalDeathsComponent);
    component = fixture.componentIstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
