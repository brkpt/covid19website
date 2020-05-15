import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StateventilatorComponent } from './stateventilator.component';

describe('StateventilatorComponent', () => {
  let component: StateventilatorComponent;
  let fixture: ComponentFixture<StateventilatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StateventilatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StateventilatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
