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
    const currentDateTime = new Date().toLocaleString('es-PE');

    if (!this.newIssue.id) {
      this.newIssue.createdIn = currentDateTime;

      const creationHistory = new History();
      creationHistory.date = currentDateTime;
      creationHistory.event = 'Creación';
      creationHistory.user = this.newIssue.madeBy;
      creationHistory.description = `Issue creado por ${this.newIssue.madeBy}`;
      this.newIssue.history.push(creationHistory);

      const assignmentHistory = new History();
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
