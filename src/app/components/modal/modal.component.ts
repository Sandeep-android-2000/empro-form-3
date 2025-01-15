import { Component, Input, Output, EventEmitter } from '@angular/core';
 
@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  // @Input() message: string = '';
  // @Output() close = new EventEmitter<void>();
 
  // onClose() {
  //   this.close.emit();
  // }

  @Input() message: string = ''; // Message to display in the modal
  @Output() close = new EventEmitter<string>(); // Emits the user's response when the modal is closed

  // Handle the user's response
  onResponse(response: string): void {
    // Emit the response ('yes' or 'no') to the parent component
    this.close.emit(response);
  }
}
 