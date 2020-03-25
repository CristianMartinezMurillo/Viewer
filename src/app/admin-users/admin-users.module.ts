import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule             } from "../material.module"
import { SharedModule } from "../shared.module"
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { RouterModule, Routes } from "@angular/router";
import { AdminUsersComponent } from "./admin-users.component";
import { NewUserDialogBodyComponent } from "./new-user-dialog-body/new-user-dialog-body.component";
import { EditUserAdminComponent } from "./edit-user-admin/edit-user-admin.component";

export const ROUTES: Routes = [
    { path: '', component: AdminUsersComponent },
];
@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        FontAwesomeModule,
        SharedModule,
        RouterModule.forChild(ROUTES)
    ],
    exports: [],
    declarations: [
        AdminUsersComponent,
        NewUserDialogBodyComponent,
        EditUserAdminComponent
    ],
    entryComponents: [
        NewUserDialogBodyComponent,
        EditUserAdminComponent
    ]
})
export class AdminUsersModule { }
