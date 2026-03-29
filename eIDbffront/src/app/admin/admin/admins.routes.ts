import { Route } from '@angular/router';
import { Page404Component } from '../../authentication/page404/page404.component';
import { AllAdminComponent } from './all-admin/all-admin.component';
import { AddAdminComponent } from './add-admin/add-admin.component';
import { EditAdminComponent } from './edit-admin/edit-admin.component';

export const ADMIN_ADMIN_ROUTE: Route[] = [
  {
    path: 'all-admin',
    component: AllAdminComponent,
  },
  {
    path: 'add-admin',
    component: AddAdminComponent,
  },
  {
    path: 'edit-admin',
    component: EditAdminComponent,
  },
  { path: '**', component: Page404Component },
];
