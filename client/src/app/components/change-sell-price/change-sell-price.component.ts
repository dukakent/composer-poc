import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-sell-price',
  templateUrl: './change-sell-price.component.html',
  styleUrls: ['./change-sell-price.component.scss']
})
export class ChangeSellPriceComponent {
  @Input() sellPrice = 1;
  @Output() sellPriceChange = new EventEmitter();

  onInputBlur(event) {
    const newValue = +event.target.value;

    if (newValue === this.sellPrice) { return; }

    this.sellPriceChange.emit(newValue);
  }
}
