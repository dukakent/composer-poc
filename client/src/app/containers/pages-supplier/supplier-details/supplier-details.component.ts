import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SuppliersService } from '../../../services/suppliers.service';
import { BsModalService } from 'ngx-bootstrap';
import { WalletService } from '../../../services/wallet.service';
import { BuyEVCoinsComponent } from '../../../components/buy-evcoins/buy-evcoins.component';
import { take } from 'rxjs/operators';

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
    private readonly suppliersService: SuppliersService,
    private readonly modalService: BsModalService,
    private readonly walletService: WalletService
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

  openBuyEVCoinsModal() {
    const modalRef = this.modalService.show(BuyEVCoinsComponent);

    const sub = modalRef.content.submit.subscribe(newAmount => {
      this.updateWallet(newAmount);
      this.modalService.hide(1);
    });

    this.modalService.onHidden.pipe(take(1)).subscribe(() => sub.unsubscribe());
  }

  updateWallet(newAmount) {
    const data = {
      amount: +this.supplier.wallet.amount + newAmount
    };

    this.walletService.updateWallet(this.supplier.wallet.walletId, data).subscribe(() => {
      this.supplier.wallet.amount = data.amount;
    });
  }
}
