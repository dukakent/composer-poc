import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { DriversService } from '../../../services/drivers.service';
import { finalize } from 'rxjs/operators';
import { ChargesService } from '../../../services/charges.service';
import { BsModalService } from 'ngx-bootstrap';
import { AddCarComponent } from '../../../components/add-car/add-car.component';

@Component({
  selector: 'app-driver-details',
  templateUrl: './driver-details.component.html',
  styleUrls: ['./driver-details.component.scss']
})
export class DriverDetailsComponent {
  driver: any | null = null;
  cars: any[] = [];
  stationsNearby: any[] = [];

  newCarName = new FormControl('');
  disableAddCar = false;

  selectedCar: any | null = null;
  selectedStation: any | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly driversService: DriversService,
    private readonly chargesService: ChargesService,
    private readonly modalService: BsModalService
  ) {
    this.chargesService.getCharges().subscribe((charges: any[]) => this.stationsNearby = charges);

    this.route.data.subscribe(data => {
      this.driver = data.driver;
      this.refreshCars();
    });
  }

  addCar() {
    this.modalService.show(AddCarComponent);

    // if (!this.newCarName.value) { return; }
    //
    // this.disableAddCar = true;
    //
    // this.driversService.addCar(this.newCarName.value, this.driver.userId)
    //   .pipe(
    //     finalize(() => this.disableAddCar = false)
    //   )
    //   .subscribe(() => {
    //     this.newCarName.patchValue('');
    //     this.refreshCars();
    //   });
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
}
