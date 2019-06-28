import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.scss']
})
export class AddCarComponent {
  @Output() addCarSubmit = new EventEmitter();

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    capacity: new FormControl(1, [Validators.required, Validators.min(1)])
  });

  onSubmit() {
    if (!this.form.valid) { return; }

    const formValues = this.form.getRawValue();

    this.addCarSubmit.emit({
      name: formValues.name,
      batteryCapacity: formValues.capacity
    });
  }
}
