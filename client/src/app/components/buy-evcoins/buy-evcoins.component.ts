import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-buy-evcoins',
  templateUrl: './buy-evcoins.component.html',
  styleUrls: ['./buy-evcoins.component.scss']
})
export class BuyEVCoinsComponent {
  @Output() submit = new EventEmitter();

  evCoinsToBuy = new FormControl(0, [Validators.min(0)]);

  submitForm() {
    const value = +this.evCoinsToBuy.value;

    if (isNaN(value) || value < 0) {
      return;
    }

    this.submit.emit(value);
  }
}
