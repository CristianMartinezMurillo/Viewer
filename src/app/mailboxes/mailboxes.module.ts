import { NgModule } from '@angular/core';
import { MaterialModule             } from "../material.module"
import { SharedModule } from "../shared.module"
import { RouterModule, Routes } from "@angular/router";
import { MailboxesComponent } from "./mailboxes.component";
import { InboxComponent } from "./inbox-component/inbox.component";
import { InboxoutComponent} from "./inboxout/inboxout.component";
import { InboxPreviewDialogComponent} from "./inbox-preview/inbox-preview-dialog.component";
import { InboxoutPreviewDialogComponent} from "./inboxout-preview/inboxout-preview-dialog.component";
import { DynamicformsModule} from "../dynamicforms.module";
import { ExternalInboxComponent} from "./external-inbox/external-inbox.component";
import { ExternalPreviewDialogComponent} from "./external-preview-dialog/external-preview-dialog.component";
import { HistoricoComponent} from "./historico-component/historico.component";
import { InternalHistoricoPreviewDialogComponent} from "./internal-historico-preview/internal-historico-preview-dialog.component";
import { FilterTableComponent} from "./filter-table/filter-table.component";
import { AdvancedSearchComponent} from "./advanced-search/advanced-search.component";
import { SubjectTasksComponent} from "../share-components/subject-tasks/subject-tasks.component";
import { SubjectDocumentsComponent} from "../share-components/subject-documents/subject-documents.component";
import { SubjectAnswerDialogComponent} from "../share-components/subject-answer/subject-answer-dialog.component";
import { SubjectAnswersComponent} from "../share-components/subject-answer/subject-answers.component";
import { DocumentViewerComponent} from "../document-viewer/document-viewer.component";
import { MembersDialogComponent } from "../share-components/members/members-dialog.component";
import { TaskAnswerDialogComponent } from "../share-components/task-answer/task-answer-dialog.component";
import {AvanzarDialogComponent} from "../share-components/avanzar/avanzar-dialog.component";
import { SubjectReviewedComponent } from './subject-reviewed/subject-reviewed.component';
import { SubjectHeaderComponent } from './subject-header/subject-header.component';
import { ExternalInboxoutComponent } from './external-inboxout/external-inboxout.component';
import { ExternalInboxoutPreviewComponent } from './external-inboxout-preview/external-inboxout-preview.component';
import { ExternalMailboxComponent } from './external-mailbox/external-mailbox.component';
import { ExternalFinishedMailboxComponent } from './external-finished-mailbox/external-finished-mailbox.component';
import { ExternalFinishedPreviewComponent } from './external-finished-preview/external-finished-preview.component';
import { ExternalHistoricoComponent } from './external-historico/external-historico.component';
import { ExternalHistoricoPreviewComponent } from './external-historico-preview/external-historico-preview.component';
import { AddAttachmentsSubjectComponent } from './add-attachments-subject/add-attachments-subject.component';

export const ROUTES: Routes = [
    { path: '', component: MailboxesComponent },
    {
        path: 'inbox/:mailboxName/:organizationalUnitId',
        component: MailboxesComponent
    },
    {
        path: 'inbox/:mailboxName',
        component: MailboxesComponent
    },
    {
        path: 'inboxout/:mailboxName/:organizationalUnitId',
        component: MailboxesComponent
    },
    // {
    //     path: 'mailbox/mailboxExternal/:mailboxName/:organizationalUnitId',
    //     component: ExternalSubjectComponent
    // },
    {
        path: 'mailboxHistorical/historico/:organizationalUnitId',
        component: HistoricoComponent
        // loadChildren: './mailboxes/mailboxes.module#MailboxesModule'
    },
    {
        path: 'external/mailboxHistorical/historico/:organizationalUnitId',
        component: ExternalHistoricoComponent
        // loadChildren: './mailboxes/mailboxes.module#MailboxesModule'
    },
    {
        path: 'external/:mailboxType/:mailboxName/:organizationalUnitId',
        // loadChildren: './mailboxes/mailboxes.module#MailboxesModule'
        component: ExternalMailboxComponent
    },
    {
        path: 'external/:mailboxName/:organizationalUnitId',
        // loadChildren: './mailboxes/mailboxes.module#MailboxesModule'
        component: ExternalFinishedMailboxComponent
    },

];
@NgModule({
    imports: [
        MaterialModule,
        SharedModule,
        DynamicformsModule,
        RouterModule.forChild(ROUTES)
    ],
    exports: [
    ],
    declarations: [
        MailboxesComponent,
        InboxComponent,
        InboxoutComponent,
        InboxPreviewDialogComponent,
        InboxoutPreviewDialogComponent,
        ExternalInboxComponent,
        ExternalPreviewDialogComponent,
        HistoricoComponent,
        InternalHistoricoPreviewDialogComponent,
        FilterTableComponent,
        AdvancedSearchComponent,
        SubjectTasksComponent,
        SubjectDocumentsComponent,
        SubjectAnswerDialogComponent,
        SubjectAnswersComponent,
        DocumentViewerComponent,
        MembersDialogComponent,
        TaskAnswerDialogComponent,
        AvanzarDialogComponent,
        SubjectReviewedComponent,
        SubjectHeaderComponent,
        ExternalInboxoutComponent,
        ExternalInboxoutPreviewComponent,
        ExternalMailboxComponent,
        ExternalFinishedMailboxComponent,
        ExternalFinishedPreviewComponent,
        ExternalHistoricoComponent,
        ExternalHistoricoPreviewComponent,
        AddAttachmentsSubjectComponent,
    ],
    entryComponents: [
        InboxPreviewDialogComponent,
        InboxoutPreviewDialogComponent,
        ExternalPreviewDialogComponent,
        InternalHistoricoPreviewDialogComponent,
        FilterTableComponent,
        SubjectAnswerDialogComponent,
        MembersDialogComponent,
        TaskAnswerDialogComponent,
        AvanzarDialogComponent,
        ExternalFinishedPreviewComponent,
        ExternalInboxoutPreviewComponent,
        ExternalHistoricoPreviewComponent,
        AddAttachmentsSubjectComponent
    ]
})
export class MailboxesModule { }
