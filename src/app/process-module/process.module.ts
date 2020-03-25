import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule             } from "../material.module"
import { NewProcessComponent } from "./new-process/new-process.component"
import { SharedModule } from "../shared.module"
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { DialogNewMetadataComponent } from './new-metadata/dialog-new-metadata.component';
import { DialogEditMetadataComponent } from './edit-metadata/dialog-edit-metadata.component';
import { ProcessAdminComponent } from './process-admin/process-admin.component';
import { EditProcessComponent } from './edit-process/edit-process.component';
import { RouterModule, Routes } from "@angular/router";

export const ROUTES: Routes = [
    { path: '', component: ProcessAdminComponent },
    { path: 'newProcess', component: NewProcessComponent },
    { path: 'process', component: ProcessAdminComponent },
    { path: ':id/edit', component: EditProcessComponent },
];
@NgModule({
  imports: [
    CommonModule,
      MaterialModule,
      FontAwesomeModule,
      SharedModule,
      RouterModule.forChild(ROUTES)
  ],
    exports: [
        NewProcessComponent,
    ],
  declarations: [
      NewProcessComponent,
      DialogNewMetadataComponent,
      DialogEditMetadataComponent,
      ProcessAdminComponent,
      EditProcessComponent,
  ],
    entryComponents: [
        DialogNewMetadataComponent,
        DialogEditMetadataComponent
    ]

})
export class ProcessModule { }
