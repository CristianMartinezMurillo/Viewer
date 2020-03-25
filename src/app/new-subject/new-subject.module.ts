import { NgModule } from '@angular/core';
import { MaterialModule             } from "../material.module"
import { SharedModule } from "../shared.module"
import { NewSubjectComponent } from "./new-subject.component";
import { DynamicformsModule } from "../dynamicforms.module";
import { SubjectSentDialogComponent } from './subject-detail-dialog/subject-sent-dialog.component';
import { SummaryComponent } from './summary/summary.component';
import { RouterModule, Routes } from "@angular/router";
import { MetadataComponent } from "./metadata/metadata.component";
import { RecipientsComponent}  from "./recipients/recipients.component";
import {FormsModule} from "@angular/forms";

export const ROUTES: Routes = [
    { path: '', component: NewSubjectComponent }
];
@NgModule({
    imports: [
        MaterialModule,
        SharedModule,
        DynamicformsModule,
        RouterModule.forChild(ROUTES),
        FormsModule,
        // StoreModule.forFeature('newSubject', reducers, { metaReducers }),
        // StoreModule.forRoot({}),
    ],
    exports: [
    ],
    declarations: [
        NewSubjectComponent,
        SubjectSentDialogComponent,
        SummaryComponent,
        MetadataComponent,
        RecipientsComponent,
    ],
    entryComponents: [
        SubjectSentDialogComponent,
    ]
})
export class NewSubjectModule { }
