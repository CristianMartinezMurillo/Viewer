import { NgModule } from "@angular/core";
import { ErrorMessageComponent } from "./messages/error-message/error-message.component";
import { CommonModule } from "@angular/common";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ReactiveFormsModule } from "@angular/forms"
import { UploadFileComponent } from "./share-components/upload-file/upload-file.component";
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NotifierModule, NotifierOptions } from "angular-notifier";
import { AddresseeTreeComponent } from "./new-subject/addressee-tree/addressee-tree.component";
import { TreeModule } from "angular-tree-component";
import { MaterialModule } from "./material.module";
import { SubjectSettingsComponent } from "./share-components/subject-settings/subject-settings.component";
import { OrganizationalUnitTreeDialogComponent } from "./organizational-unit-tree-dialog/organizational-unit-tree-dialog.component";
import { SubjectFlowComponent } from "./subject-flow/subject-flow.component";
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { SanitizeHtmlPipe } from "./_pipe/SanitizeHtmlPipe";
import { NotifierComponent } from "./notifier/notifier.component";
import { GraphComponent } from './subject-flow/graph/graph.component';
import { DetailsComponent } from './subject-flow/details/details.component';
import { DocumentsComponent } from './subject-flow/documents/documents.component';
import { NewTaskDialogComponent } from "./new-subject/new-task/new-task-dialog.component";
import { LegendsComponent } from './legends/legends.component';
import { NotifyOptions } from "./notifier/Options";

@NgModule({
    imports: [
        CommonModule,
        FontAwesomeModule,//Error message uses Fontawesome
        ReactiveFormsModule,
        NotifierModule.withConfig(NotifyOptions),
        TreeModule.forRoot(),
        MaterialModule,
        PdfViewerModule,
        NgxGraphModule,
        NgxChartsModule,
    ],
    declarations: [
        ErrorMessageComponent,
        UploadFileComponent,
        AddresseeTreeComponent,
        SubjectSettingsComponent,
        OrganizationalUnitTreeDialogComponent,
        SubjectFlowComponent,
        SanitizeHtmlPipe,
        NotifierComponent,
        GraphComponent,
        DetailsComponent,
        DocumentsComponent,
        NewTaskDialogComponent,
        LegendsComponent
    ],
    exports: [
        FontAwesomeModule,
        ErrorMessageComponent,
        ReactiveFormsModule,
        UploadFileComponent,
        PdfViewerModule,
        // BrowserModule,
        NotifierModule,
        AddresseeTreeComponent,
        NewTaskDialogComponent,
        SubjectSettingsComponent,
        OrganizationalUnitTreeDialogComponent,
        SubjectFlowComponent,
        NgxGraphModule,
        NgxChartsModule,
        SanitizeHtmlPipe,
        NotifierComponent,
        LegendsComponent
    ],
    entryComponents: [
        OrganizationalUnitTreeDialogComponent,
        NewTaskDialogComponent
    ]
})
export class SharedModule {}
