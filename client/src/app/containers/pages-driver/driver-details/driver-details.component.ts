import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { DriversService } from '../../../services/drivers.service';
import { ChargesService } from '../../../services/charges.service';
import { BsModalService } from 'ngx-bootstrap';
import { AddCarComponent } from '../../../components/add-car/add-car.component';
import { BuyEVCoinsComponent } from '../../../components/buy-evcoins/buy-evcoins.component';
import { Subscription } from 'rxjs';
import { WalletService } from '../../../services/wallet.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-driver-details',
  templateUrl: './driver-details.component.html',
  styleUrls: ['./driver-details.component.scss']
})
export class DriverDetailsComponent implements OnDestroy {
  driver: any | null = null;
  cars: any[] = [];
  stationsNearby: any[] = [];

  selectedCar: any | null = null;
  selectedStation: any | null = null;

  sellPrice = new FormControl(1, [Validators.min(1)]);

  chargeGoal = new FormControl(0, [Validators.required, Validators.min(0), Validators.max(100)])

  internalSubscriptions = new Subscription();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly driversService: DriversService,
    private readonly chargesService: ChargesService,
    private readonly modalService: BsModalService,
    private readonly walletService: WalletService
  ) {
    this.chargesService.getCharges().subscribe((charges: any[]) => this.stationsNearby = charges);

    this.route.data.subscribe(data => {
      this.driver = data.driver;
      this.refreshCars();
    });
  }

  ngOnDestroy(): void {
    this.internalSubscriptions.unsubscribe();
  }

  openAddCarModal() {
    const modalRef = this.modalService.show(AddCarComponent);

    const sub = modalRef.content.addCarSubmit.subscribe(value => {
      this.addCar(value);
      this.modalService.hide(1);
    });

    this.modalService.onHidden.pipe(take(1)).subscribe(() => sub.unsubscribe());
  }

  addCar(data: any) {
    data.chargeLeft = 0;

    this.driversService.addCar(this.driver.userId, data).subscribe(() => {
      this.refreshCars();
    });
  }

  deleteCar(car) {
    const index = this.cars.findIndex(car2 => car2.carId === car.carId);

    if (index >= 0) {
      this.cars.splice(index, 1);
    }

    if (this.selectedCar && this.selectedCar.carId === car.carId) {
      this.selectedCar = null;
    }

    this.driversService.deleteCar(car.carId).subscribe(() => this.refreshCars());
  }

  refreshCars() {
    this.driversService.getCarsByOwnerId(this.driver.userId).subscribe((cars: any[]) => this.cars = cars);
  }

  selectCar(car) {
    this.selectedCar = this.selectedCar && this.selectedCar.carId === car.carId ? null : car;
  }

  selectStation(station) {
    this.selectedStation = this.selectedStation && this.selectedStation.stationId === station.stationId ? null : station;
  }

  setChargeGoal() {
    if (!this.selectedCar || !this.selectStation) { return; }
  
    this.chargeGoal.reset(this.selectedCar);
  }

  openBuyEVCoinsModal() {
    const modalRef = this.modalService.show(BuyEVCoinsComponent);

    const sub = modalRef.content.submit.subscribe(newAmount => {
      this.updateWallet(newAmount);
      this.modalService.hide(1);
    });

    this.modalService.onHidden.pipe(take(1)).subscribe(() => sub.unsubscribe());
  }

  updateDriver() {
    const electricitySellPrice = this.sellPrice.value;

    const data: any = {
      name: this.driver.name,
      wallet: `resource:org.valor.evnet.EVCoinWallet#${this.driver.wallet.walletId}`,
      electricity: `resource:org.valor.evnet.ElectricityCounter#${this.driver.electricity.electricityId}`,
      electricitySellPrice
    };

    delete data.userId;
    delete data.$class;

    this.driversService
      .updateDriver(this.driver.userId, data)
      .subscribe();
  }

  updateWallet(newAmount) {
    const data = {
      amount: +this.driver.wallet.amount + newAmount
    };

    this.walletService.updateWallet(this.driver.wallet.walletId, data).subscribe(() => {
      this.driver.wallet.amount = data.amount;
    });
  }
}
