import { Component, OnDestroy } from '@angular/core';
import { DriversService } from '../../../services/drivers.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss']
})
export class DriversComponent implements OnDestroy {
  drivers = [];

  internalSubscriptions = new Subscription();

  constructor(
    private readonly driversService: DriversService,
    private readonly router: Router
  ) {
    this.internalSubscriptions.add(
      this.driversService.allDrivers$.subscribe(drivers => this.drivers = drivers)
    );

    this.driversService.refreshDrivers();
  }

  ngOnDestroy(): void {
    this.internalSubscriptions.unsubscribe();
  }

  selectDriver(driver: any) {
    this.router.navigate(['drivers', driver.userId]);
  }

  addDriver(name: string) {
    this.driversService.createDriver(name).subscribe(() => this.driversService.refreshDrivers());
  }
}
