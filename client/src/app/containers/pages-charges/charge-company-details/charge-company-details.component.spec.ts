import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeCompanyDetailsComponent } from './charge-company-details.component';

describe('ChargeCompanyDetailsComponent', () => {
  let component: ChargeCompanyDetailsComponent;
  let fixture: ComponentFixture<ChargeCompanyDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargeCompanyDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeCompanyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
