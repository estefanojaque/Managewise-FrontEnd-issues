import { Component, OnInit } from '@angular/core';
import { IssuesService } from '../../services/issues.service';
import { Issue } from '../../model/issue.entity';
import { MatDialog } from '@angular/material/dialog';
import { IssueFormComponent } from '../../components/issue-form/issue-form.component';
import { IssueDetailsComponent } from '../../components/issue-details/issue-details.component';
import { AddHistoryEventComponent } from '../../components/add-history-event/add-history-event.component';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { NgClass, NgFor } from '@angular/common';
import { History } from '../../model/history.entity';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-issues-list',
  standalone: true,
  imports: [MatCardModule, FormsModule, NgFor, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './issues-list.component.html',
  styleUrls: ['./issues-list.component.css']
})
export class IssuesListComponent implements OnInit {
  issues: Issue[] = [];
  filteredIssues: Issue[] = [];

  sprints: number[] = [1, 2, 3, 4];
  priorities: string[] = ['Alta', 'Media', 'Baja'];
  selectedSprint: number | null = null;
  selectedPriority: string | null = null;

  constructor(private issuesService: IssuesService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadIssues();
  }

  loadIssues(): void {
    this.issuesService.getAllIssues().subscribe((data: Issue[]) => {
      this.issues = data;
      this.filteredIssues = data;
    });
  }

  filterIssues(): void {
    this.filteredIssues = this.issues.filter(issue => {
      return (!this.selectedSprint || issue.SprintAssociate === this.selectedSprint) &&
             (!this.selectedPriority || issue.priority === this.selectedPriority);
    });
  }

  openAddIssueForm(): void {
    const dialogRef = this.dialog.open(IssueFormComponent, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.issues.push(result); // Agregar nuevo issue sin recargar
      }
    });
  }

  openViewMore(issue: Issue): void {
    this.dialog.open(IssueDetailsComponent, {
      width: '600px',
      data: issue
    });
  }

  openEditIssueForm(issue: Issue): void {
    const dialogRef = this.dialog.open(IssueFormComponent, {
      width: '400px',
      data: issue
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.issues.findIndex(i => i.id === result.id);
        if (index !== -1) {
          this.issues[index] = result; // Actualizar issue sin recargar
        }
      }
    });
  }

  deleteIssue(issue: Issue): void {
    if (confirm('¿Estás seguro de que deseas eliminar este issue?')) {
      this.issuesService.delete(issue.id).subscribe(() => {
        this.issues = this.issues.filter(i => i.id !== issue.id); // Eliminar issue sin recargar
      });
    }
  }

  addHistoryEvent(issue: Issue): void {
    const dialogRef = this.dialog.open(AddHistoryEventComponent, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe((result: History) => {
      if (result) {
        issue.history.push(result);
        this.issuesService.update(issue.id, issue).subscribe(() => {
          // Actualizar issue con nuevo evento de historial sin recargar
        });
      }
    });
  }
}
