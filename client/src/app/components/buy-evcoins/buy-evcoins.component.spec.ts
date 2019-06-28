import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyEVCoinsComponent } from './buy-evcoins.component';

describe('BuyEVCoinsComponent', () => {
  let component: BuyEVCoinsComponent;
  let fixture: ComponentFixture<BuyEVCoinsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyEVCoinsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyEVCoinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
