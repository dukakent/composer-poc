import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-participant',
  templateUrl: './add-participant.component.html',
  styleUrls: ['./add-participant.component.scss']
})
export class AddParticipantComponent {
  newName = new FormControl('');

  @Output() add = new EventEmitter();

  submit() {
    const name = this.newName.value;

    if (!name) { return; }

    this.newName.reset();

    this.add.emit(name);
  }
}
