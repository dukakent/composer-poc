import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeCarComponent } from './charge-car.component';

describe('ChargeCarComponent', () => {
  let component: ChargeCarComponent;
  let fixture: ComponentFixture<ChargeCarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargeCarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeCarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
