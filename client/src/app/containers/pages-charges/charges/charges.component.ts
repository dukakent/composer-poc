import { Component, OnDestroy } from '@angular/core';
import { ChargesService } from '../../../services/charges.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-charges',
  templateUrl: './charges.component.html',
  styleUrls: ['./charges.component.scss']
})
export class ChargesComponent implements OnDestroy {
  chargeCompanies = [];

  private readonly internalSubscriptions = new Subscription();

  constructor(
    private readonly chargesService: ChargesService,
    private readonly router: Router
  ) {
    this.internalSubscriptions.add(
      this.chargesService.allCompanies$.subscribe(companies => this.chargeCompanies = companies)
    );

    this.chargesService.refreshCompanies();
  }

  ngOnDestroy(): void {
    this.internalSubscriptions.unsubscribe();
  }

  selectCompany(company: any) {
    this.router.navigate(['charges', company.userId]);
  }

  addCompany(name: string) {
    this.chargesService
      .createChargeStationCompany(name)
      .subscribe(() => this.chargesService.refreshCompanies());
  }
}
