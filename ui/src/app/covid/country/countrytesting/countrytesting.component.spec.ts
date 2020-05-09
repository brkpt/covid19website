import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountrytestingComponent } from './countrytesting.component';

describe('CountrytestingComponent', () => {
  let component: CountrytestingComponent;
  let fixture: ComponentFixture<CountrytestingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountrytestingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountrytestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
