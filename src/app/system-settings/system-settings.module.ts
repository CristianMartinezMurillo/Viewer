import { NgModule } from '@angular/core';
import { MaterialModule             } from "../material.module"
import { SharedModule } from "../shared.module"
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { RouterModule, Routes } from "@angular/router";
import { SystemSettingsComponent } from "./system-settings.component";
import { EmailSettingsComponent } from "./email-settings/email-settings.component";

export const ROUTES: Routes = [
    { path: '', component: SystemSettingsComponent },
];
@NgModule({
  imports: [
      MaterialModule,
      FontAwesomeModule,
      SharedModule,
      RouterModule.forChild(ROUTES)
  ],
    exports: [
    ],
  declarations: [
      SystemSettingsComponent,
      EmailSettingsComponent
  ],
    entryComponents: [

    ]

})
export class SystemSettingsModule { }
