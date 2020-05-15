import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StateicuComponent } from './stateicu.component';

describe('StateicuComponent', () => {
  let component: StateicuComponent;
  let fixture: ComponentFixture<StateicuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StateicuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StateicuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
