import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule             } from "../material.module"
import { SharedModule } from "../shared.module"
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { OrganizationalUnitAdminComponent } from "./organizational-unit-admin/organizational-unit-admin.component"
import { TreeModule } from 'angular-tree-component';
import { NewOrganizationalUnitDialogComponent } from './new-organizational-unit/new-organizational-unit-dialog.component';
import { EditOrganizationalUnitDialogComponent } from './edit-organizational-unit/edit-organizational-unit-dialog.component';
import { MembersDialogComponent } from './members-dialog/members-dialog.component';
import { TableEnableUsersComponent } from './table-enable-users/table-enable-users.component';
import { MembersComponent } from './members/members.component';
import { RouterModule, Routes } from "@angular/router";

export const ROUTES: Routes = [
    { path: '', component: OrganizationalUnitAdminComponent }
];

@NgModule({
  imports: [
    CommonModule,
      MaterialModule,
      FontAwesomeModule,
      SharedModule,
      TreeModule.forRoot(),
      RouterModule.forChild(ROUTES)
  ],
  declarations: [
      OrganizationalUnitAdminComponent,
      NewOrganizationalUnitDialogComponent,
      EditOrganizationalUnitDialogComponent,
      MembersDialogComponent,
      TableEnableUsersComponent,
      MembersComponent,
  ],
    entryComponents: [
        NewOrganizationalUnitDialogComponent,
        EditOrganizationalUnitDialogComponent,
        MembersDialogComponent
    ]
})
export class OrganizationalUnitModule { }
