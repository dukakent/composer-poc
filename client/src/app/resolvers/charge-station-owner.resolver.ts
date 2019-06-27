import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { ChargesService } from '../services/charges.service';

@Injectable({providedIn: 'root'})
export class ChargeStationOwnerResolver implements Resolve<any> {
  constructor(private readonly chargesService: ChargesService) {}

  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get('id');

    return this.chargesService.getChargeStationOwner(id);
  }
}
