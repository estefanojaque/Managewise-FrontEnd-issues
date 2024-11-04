// issue-form.component.ts
import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Issue } from '../../model/issue.entity';
import { History } from '../../model/history.entity';
import { IssuesService } from '../../services/issues.service';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from "@angular/forms";
import { NgClass, NgFor } from "@angular/common";
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AddHistoryEventComponent } from '../add-history-event/add-history-event.component';

@Component({
  selector: 'app-issue-form',
  standalone: true,
  imports: [MatCardModule, FormsModule, NgFor, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './issue-form.component.html',
  styleUrls: ['./issue-form.component.css']
})
export class IssueFormComponent {
  newIssue: Issue;
  newHistory: History = new History();

  constructor(
    private issuesService: IssuesService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<IssueFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Issue
  ) {
    this.newIssue = data ? { ...data } : new Issue();
  }


  onSubmit(): void {


    function getFormattedDateTime(): string {
      return new Date().toLocaleString('es-PE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true // Para mostrar AM/PM en el formato de 12 horas
      });
    }

    const currentDateTime = getFormattedDateTime();
    if (!this.newIssue.id) {
      this.newIssue.createdIn = currentDateTime;

      // Historial de creación del Issue
      const creationHistory = new History();
      creationHistory.id = 1;  // Primer ID para el historial
      creationHistory.date = currentDateTime;
      creationHistory.event = 'Creación';
      creationHistory.user = this.newIssue.madeBy;
      creationHistory.description = `Issue creado por ${this.newIssue.madeBy}`;
      this.newIssue.history.push(creationHistory);

      // Historial de asignación del Issue
      const assignmentHistory = new History();
      assignmentHistory.id = 2;  // Segundo ID para el historial
      assignmentHistory.date = currentDateTime;
      assignmentHistory.event = `Asignado a ${this.newIssue.assignedTo}`;
      assignmentHistory.user = this.newIssue.madeBy;
      assignmentHistory.description = `El issue fue asignado a ${this.newIssue.assignedTo}`;
      this.newIssue.history.push(assignmentHistory);

      this.issuesService.create(this.newIssue).subscribe((createdIssue) => {
        this.dialogRef.close(createdIssue);
      });
    } else {
      this.issuesService.update(this.newIssue.id, this.newIssue).subscribe(() => {
        this.dialogRef.close(this.newIssue);
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  addHistoryEvent(): void {
    const dialogRef = this.dialog.open(AddHistoryEventComponent, { width: '400px' });
    dialogRef.afterClosed().subscribe((result: History) => {
      if (result) {
        // Genera el próximo ID automáticamente basado en el historial actual
        const maxId = this.newIssue.history.length > 0
          ? Math.max(...this.newIssue.history.map(h => h.id)) // Encuentra el ID más alto
          : 0;
        result.id = maxId + 1;  // Asigna el siguiente ID disponible

        // Agrega el nuevo evento de historial
        this.newIssue.history.push(result);

        if (this.newIssue.id) {
          this.issuesService.update(this.newIssue.id, this.newIssue).subscribe(() => {
            console.log('Historial actualizado y guardado correctamente.');
          });
        } else {
          this.issuesService.create(this.newIssue).subscribe((createdIssue) => {
            this.newIssue = createdIssue;
            console.log('Nuevo issue creado y guardado correctamente.');
          });
        }
      }
    });
  }
}
