import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { SuppliersService } from '../services/suppliers.service';

@Injectable({providedIn: 'root'})
export class SuppliersResolver implements Resolve<any> {
  constructor(private readonly suppliersService: SuppliersService) {}

  resolve() {
    return this.suppliersService.getSuppliers();
  }
}
