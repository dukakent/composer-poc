import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { DriversService } from '../services/drivers.service';

@Injectable({providedIn: 'root'})
export class DriverResolver implements Resolve<any> {
  constructor(private readonly driversService: DriversService) {}

  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get('id');

    return this.driversService.getDriver(id);
  }
}
