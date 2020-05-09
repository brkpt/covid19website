import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountrytotaldeathsComponent } from './countrytotaldeaths.component';

describe('CountrytotaldeathsComponent', () => {
  let component: CountrytotaldeathsComponent;
  let fixture: ComponentFixture<CountrytotaldeathsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountrytotaldeathsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountrytotaldeathsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
