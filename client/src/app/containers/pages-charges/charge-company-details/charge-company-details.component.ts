import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChargesService } from '../../../services/charges.service';
import { BuyElectricityService } from '../../../services/buy-electricity.service';
import { BuyEVCoinsComponent } from '../../../components/buy-evcoins/buy-evcoins.component';
import { BsModalService } from 'ngx-bootstrap';
import { WalletService } from '../../../services/wallet.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-charge-company-details',
  templateUrl: './charge-company-details.component.html',
  styleUrls: ['./charge-company-details.component.scss']
})
export class ChargeCompanyDetailsComponent {
  company: any | null = null;
  chargeStations: any[] = [];
  suppliers: any[] = [];

  newChargeStationName = new FormControl('');

  selectedChargeStation: any | null = null;
  selectedSupplier: any | null = null;

  buyElectricityAmount = new FormControl(0);

  sellPrice = new FormControl(1, [Validators.min(1)]);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly chargesService: ChargesService,
    private readonly buyElectricityService: BuyElectricityService,
    private readonly modalService: BsModalService,
    private readonly walletService: WalletService
  ) {
    this.route.data.subscribe(data => {
      this.company = data.chargeStationOwner;
      this.suppliers = data.suppliers;
      this.sellPrice.reset(this.company.electricitySellPrice);
      this.refreshChargeStations();
    });
  }

  refreshChargeStations() {
    this.chargesService.getChargeStationsByOwnerId(this.company.userId)
      .subscribe((stations: any[]) => this.chargeStations = stations);
  }

  addChargeStation() {
    if (!this.newChargeStationName.value) { return; }

    this.chargesService.addChargeStation(this.newChargeStationName.value, this.company.userId)
      .subscribe(() => {
        this.newChargeStationName.patchValue('');
        this.refreshChargeStations();
      });
  }

  deleteChargeStation(station) {
    const index = this.chargeStations.findIndex(station2 => station2.stationId === station.stationId);

    if (index >= 0) {
      this.chargeStations.splice(index, 1);
    }

    if (this.selectedChargeStation && this.selectedChargeStation.stationId === station.stationId) {
      this.selectedChargeStation = null;
    }

    this.chargesService.deleteChargeStation(station.stationId).subscribe(() => this.refreshChargeStations());
  }

  selectSupplier(supplier: any) {
    this.selectedSupplier = supplier;
  }

  buyElectricity() {
    const amount = +this.buyElectricityAmount.value;

    if (!amount.toFixed || amount < 1) { return; }

    this.buyElectricityService.buyElectricity(
      'ElectricitySupplier',
      'ChargeStationOwner',
      this.selectedSupplier.userId,
      this.company.userId, +amount
    ).subscribe();
  }

  updateCompany() {
    const electricitySellPrice = this.sellPrice.value;

    const data: any = {
      name: this.company.name,
      wallet: `resource:org.valor.evnet.EVCoinWallet#${this.company.wallet.walletId}`,
      electricity: `resource:org.valor.evnet.ElectricityCounter#${this.company.electricity.electricityId}`,
      electricitySellPrice
    };

    delete data.userId;
    delete data.$class;

    this.chargesService
      .updateCompany(this.company.userId, data)
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
      amount: +this.company.wallet.amount + newAmount
    };

    this.walletService.updateWallet(this.company.wallet.walletId, data).subscribe(() => {
      this.company.wallet.amount = data.amount;
    });
  }
}
