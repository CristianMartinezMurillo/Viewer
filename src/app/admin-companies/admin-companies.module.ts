import { NgModule } from '@angular/core';
import { MaterialModule             } from "../material.module"
import { SharedModule } from "../shared.module"
import { RouterModule, Routes } from "@angular/router";
import { AdminCompaniesComponent } from "./admin-companies.component";
import { EditCompanyDialogComponent } from "./edit-company-dialog/edit-company-dialog.component";
import { NewCompanyDialogComponent } from "./new-company-dialog/new-company-dialog.component";

export const ROUTES: Routes = [
    { path: '', component: AdminCompaniesComponent }
];
@NgModule({
    imports: [
        MaterialModule,
        SharedModule,
        RouterModule.forChild(ROUTES),
    ],
    exports: [
    ],
    declarations: [
        AdminCompaniesComponent,
        EditCompanyDialogComponent,
        NewCompanyDialogComponent
    ],
    entryComponents: [
        EditCompanyDialogComponent,
        NewCompanyDialogComponent
    ]
})
export class AdminCompaniesModule { }
