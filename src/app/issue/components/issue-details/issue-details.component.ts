import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Issue } from '../../model/issue.entity';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, NgForm } from "@angular/forms";
import { NgClass, NgFor } from "@angular/common";

@Component({
  selector: 'app-issue-details',
  standalone: true,
  imports: [MatCardModule, FormsModule, NgFor],
  templateUrl: './issue-details.component.html',
  styleUrls: ['./issue-details.component.css']
})
export class IssueDetailsComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public issue: Issue) {}
}
