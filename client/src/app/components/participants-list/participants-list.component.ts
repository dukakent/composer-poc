import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-participants-list',
  templateUrl: './participants-list.component.html',
  styleUrls: ['./participants-list.component.scss']
})
export class ParticipantsListComponent {
  @Input() participants: any[] = [];
  @Input() selectedParticipant: any | null = null;

  @Output() participantSelect = new EventEmitter();

  selectParticipant(participant) {
    this.selectedParticipant = participant;
    this.participantSelect.emit(this.selectedParticipant);
  }
}
