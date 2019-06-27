import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChargesService } from '../../../services/charges.service';
import { BuyElectricityService } from '../../../services/buy-electricity.service';

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

  constructor(
    private readonly route: ActivatedRoute,
    private readonly chargesService: ChargesService,
    private readonly buyElectricityService: BuyElectricityService
  ) {
    this.route.data.subscribe(data => {
      this.company = data.chargeStationOwner;
      this.suppliers = data.suppliers;
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
}
