import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { History } from '../../model/history.entity';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, NgForm } from "@angular/forms";
import { NgClass, NgFor } from "@angular/common";
import { ChangeDetectionStrategy } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-add-history-event',
  standalone: true,
  imports: [MatCardModule, FormsModule, NgFor, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './add-history-event.component.html',
  styleUrls: ['./add-history-event.component.css']
})
export class AddHistoryEventComponent {
  newHistory: History = new History();

  constructor(private dialogRef: MatDialogRef<AddHistoryEventComponent>) {
    this.newHistory.date = new Date().toISOString().split('T')[0];  // Fecha automática
  }

  onSubmit(): void {
    if (this.newHistory.date && this.newHistory.user && this.newHistory.event && this.newHistory.description) {
      this.dialogRef.close(this.newHistory);  // Devolvemos el nuevo evento al componente padre
    } else {
      console.error('Faltan datos en el nuevo evento de historial');
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);  // Cancelamos el evento
  }
}
