import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DriversComponent } from './containers/pages-driver/drivers/drivers.component';
import { DriverDetailsComponent } from './containers/pages-driver/driver-details/driver-details.component';
import { DriverResolver } from './resolvers/driver.resolver';
import { ChargeCompanyDetailsComponent } from './containers/pages-charges/charge-company-details/charge-company-details.component';
import { ChargeStationOwnerResolver } from './resolvers/charge-station-owner.resolver';
import { ChargesComponent } from './containers/pages-charges/charges/charges.component';
import { SuppliersComponent } from './containers/pages-supplier/suppliers/suppliers.component';
import { SupplierDetailsComponent } from './containers/pages-supplier/supplier-details/supplier-details.component';
import { SupplierResolver } from './resolvers/supplier.resolver';
import { SuppliersResolver } from './resolvers/suppliers.resolver';

const routes: Routes = [
  {
    path: 'drivers',
    component: DriversComponent,
    children: [
      {
        path: ':id',
        component: DriverDetailsComponent,
        resolve: {
          driver: DriverResolver
        }
      }
    ]
  },
  {
    path: 'charges',
    component: ChargesComponent,
    children: [
      {
        path: ':id',
        component: ChargeCompanyDetailsComponent,
        resolve: {
          chargeStationOwner: ChargeStationOwnerResolver,
          suppliers: SuppliersResolver
        }
      }
    ]
  },
  {
    path: 'suppliers',
    component: SuppliersComponent,
    children: [
      {
        path: ':id',
        component: SupplierDetailsComponent,
        resolve: {
          supplier: SupplierResolver
        }
      }
    ]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'drivers'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
