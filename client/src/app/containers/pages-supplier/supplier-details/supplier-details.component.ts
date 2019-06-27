import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SuppliersService } from '../../../services/suppliers.service';

@Component({
  selector: 'app-supplier-details',
  templateUrl: './supplier-details.component.html',
  styleUrls: ['./supplier-details.component.scss']
})
export class SupplierDetailsComponent implements OnDestroy {
  supplier: any | null = null;

  sellPrice = new FormControl(1, [Validators.min(1)]);

  internalSubscriptions = new Subscription();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly suppliersService: SuppliersService
  ) {
    this.route.data.subscribe(data => {
      this.supplier = data.supplier;
      this.sellPrice.reset(this.supplier.electricitySellPrice);
    });
  }

  ngOnDestroy(): void {
    this.internalSubscriptions.unsubscribe();
  }

  updateSupplier() {
    const electricitySellPrice = this.sellPrice.value;

    const data: any = {
      name: this.supplier.name,
      wallet: `resource:org.valor.evnet.EVCoinWallet#${this.supplier.wallet.walletId}`,
      electricity: `resource:org.valor.evnet.ElectricityCounter#${this.supplier.electricity.electricityId}`,
      electricitySellPrice
    };

    delete data.userId;
    delete data.$class;

    this.suppliersService
      .updateSupplier(this.supplier.userId, data)
      .subscribe();
  }
}
