import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StateGeoComponent } from './state-geo.component';

describe('StateGeoComponent', () => {
  let component: StateGeoComponent;
  let fixture: ComponentFixture<StateGeoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StateGeoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StateGeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
