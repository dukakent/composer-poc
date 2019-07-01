import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-charge-car',
  templateUrl: './charge-car.component.html',
  styleUrls: ['./charge-car.component.scss']
})
export class ChargeCarComponent implements OnInit, OnChanges {
  @Input() car: any | null = null;
  @Input() chargeStation: any | null = null;

  chargeGoalControl = new FormControl(0, [Validators.min(0), Validators.max(100)]);

  neededElectricity = 0;
  neededPrice = 0;

  ngOnInit(): void {
    this.chargeGoalControl.valueChanges.subscribe(() => {
      const currentElectricity = this.car.batteryCapacity * this.car.chargeLeft / 100;
      const goalElectricity = this.car.batteryCapacity * this.chargeGoalControl.value / 100;

      this.neededElectricity = goalElectricity - currentElectricity;
      this.neededPrice = this.neededElectricity * this.chargeStation.owner.electricitySellPrice;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('car' in changes) {
      this.chargeGoalControl.reset(this.car.chargeLeft);
    }
  }
}
