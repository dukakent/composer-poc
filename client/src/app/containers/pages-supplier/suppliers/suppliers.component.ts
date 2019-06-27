import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { SuppliersService } from '../../../services/suppliers.service';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent implements OnDestroy {
  suppliers = [];

  internalSubscriptions = new Subscription();

  constructor(
    private readonly suppliersService: SuppliersService,
    private readonly router: Router
  ) {
    this.internalSubscriptions.add(
      this.suppliersService.allSuppliers$.subscribe(suppliers => this.suppliers = suppliers)
    );

    this.suppliersService.refreshSuppliers();
  }

  ngOnDestroy(): void {
    this.internalSubscriptions.unsubscribe();
  }

  selectSupplier(supplier: any) {
    this.router.navigate(['suppliers', supplier.userId]);
  }

  addSupplier(name: string) {
    this.suppliersService
      .createSupplier(name)
      .subscribe(() => this.suppliersService.refreshSuppliers());
  }
}
