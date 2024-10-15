import { Routes } from '@angular/router';

import { PageNotFoundComponent } from "./public/pages/page-not-found/page-not-found.component";
import { IssuesListComponent } from "./issue/pages/issues-list/issues-list.component";

export const routes: Routes = [{ path: 'issues', component: IssuesListComponent },
                                 { path: '', redirectTo: 'issues', pathMatch: 'full' },
                                 { path: '**', component: PageNotFoundComponent }];
