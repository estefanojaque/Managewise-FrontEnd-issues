import { Injectable } from '@angular/core';
import { BaseService } from "../../shared/services/base.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { Issue } from "../model/issue.entity";

@Injectable({
  providedIn: 'root'
})
export class IssuesService extends BaseService<Issue> {
  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.resourceEndpoint = '/issues';
  }

  // Nuevo método específico para IssuesService
  getAllIssues(): Observable<Issue[]> {
    return this.httpClient.get<Issue[]>(`${this.basePath}${this.resourceEndpoint}`, this.httpOptions);
  }

   deleteIssue(id: number): Observable<void> {
         return this.httpClient.delete<void>(`${this.basePath}${this.resourceEndpoint}/${id}`, this.httpOptions);
       }

  // Método específico para actualizar un issue existente
    override update(id: number, issue: Issue): Observable<Issue> {
      return this.httpClient.put<Issue>(`${this.basePath}${this.resourceEndpoint}/${id}`, issue, this.httpOptions);
    }
}
