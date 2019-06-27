import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { SuppliersService } from '../services/suppliers.service';

@Injectable({providedIn: 'root'})
export class SupplierResolver implements Resolve<any> {
  constructor(private readonly suppliersService: SuppliersService) {}

  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get('id');

    return this.suppliersService.getSupplier(id);
  }
}
