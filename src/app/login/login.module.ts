import { NgModule } from '@angular/core';
import { MaterialModule             } from "../material.module"
import { SharedModule } from "../shared.module"
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./login.component";

export const ROUTES: Routes = [
    { path: '', component: LoginComponent }
];
@NgModule({
    imports: [
        MaterialModule,
        SharedModule,
        RouterModule.forChild(ROUTES)
    ],
    exports: [
    ],
    declarations: [
        LoginComponent
    ],
    entryComponents: [
    ]
})
export class LoginModule { }
