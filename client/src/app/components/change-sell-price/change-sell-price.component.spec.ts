import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeSellPriceComponent } from './change-sell-price.component';

describe('ChangeSellPriceComponent', () => {
  let component: ChangeSellPriceComponent;
  let fixture: ComponentFixture<ChangeSellPriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeSellPriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeSellPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
