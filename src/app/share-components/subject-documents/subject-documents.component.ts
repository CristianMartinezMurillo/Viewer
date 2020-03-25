import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { faDownload } from "@fortawesome/free-solid-svg-icons/faDownload";
import { SubjectDocumentService } from "../../_services/subject-document.service";
import { ViewerService } from "../../document-viewer/viewer.service";
import { isNullOrUndefined } from "util";
import { faWindowClose } from "@fortawesome/free-solid-svg-icons/faWindowClose";
import { isObject } from "rxjs/internal-compatibility";
import { File } from "../../_helpers/file";
import { UsersService } from "../../_services/users.service";
import { Store } from "@ngrx/store";
import * as SubjectReducer from '../../_store/reducers/subject.reducer';
import * as SubjectSelector from '../../_store/selectors/subject.selector';
import * as SubjectActions from '../../_store/actions/subject.actions';
import { Observable } from "rxjs";
import { DocumentModel } from "../../_models/Document.model";
import {filter, map, take} from "rxjs/operators";

@Component({
  selector: 'app-subject-documents',
  templateUrl: './subject-documents.component.html',
  styleUrls: ['./subject-documents.component.css']
})
export class SubjectDocumentsComponent implements OnInit {
    @Input() fileNameDownload: string = new Date().toISOString() + ".zip";
    @Input() repositoryType: string; // tasks || subject || answer

    documents: Observable<Array<DocumentModel>>;
    File: File;
    faClose = faWindowClose;
    faDownload = faDownload;

    showError: boolean = false;
    errorMessage: string = null;

    constructor(
        private subjectDocumentServices: SubjectDocumentService,
        private viewerService: ViewerService,
        public userService: UsersService,
        private subject$: Store<SubjectReducer.State>
    ) {
        this.File = new File();
    }

    ngOnInit() {
        this.documents = this.subject$.select(SubjectSelector.getSubjectDocuments);
    }

    downloadAll() {
        let documentIds = [];
        let self = this;

        this.documents.pipe(
            take(1),
            filter(data => data !== null)
        ).subscribe(documents => {
                console.log(documents);
            documents.map(document => {
                if( this.isDownloableDocument(document) ) {
                    documentIds.push(document.id);
                }
            });
            console.log(documentIds);
        });

        console.log('downloading...');
        this.download(documentIds, null);
    }

    downloadSingleFile(document: DocumentModel) {
        if (this.isDownloableDocument(document)) {
            this.download([document.id], document.filename);
        }
    }

    download(documentIds: Array<any>, fileNameDownload) {
        this.resetError();

        let request = {
            documentIds: documentIds,
            repositoryType: this.repositoryType
        }

        this.subjectDocumentServices.download(request).subscribe(
            response => {
                const blob = new Blob([response], {type: response.type});

                const element = document.createElement('a');
                element.href = URL.createObjectURL(blob);
                element.download = (isNullOrUndefined(fileNameDownload)) ? this.fileNameDownload : fileNameDownload;
                document.body.appendChild(element);
                element.click();
            },
            error => {
                if (error.status == 420) {
                    this.displayError("No tiene permisos de descarga de documentos");
                } else {
                    this.displayError("Error en la descarga de documentos");
                }

            }
        );
    }

    openDocument(document) {
        this.viewerService.openDocument(this.repositoryType, document);
    }

    resetError() {
        this.showError = false;
        this.errorMessage = '';
    }

    displayError(errorMessage) {
        this.showError = true;
        this.errorMessage = errorMessage;
    }

    // ngOnChanges(changes: SimpleChanges): void {
    //
    //     if (isNullOrUndefined(changes.documents.currentValue))
    //         return;
    //
    //     changes.documents.currentValue.forEach(function (document) {
    //         if (!isNullOrUndefined(document.config)) {
    //             let config = JSON.parse(document.config);
    //
    //             if (isObject(config)) {
    //                 document = {...document, config: config}
    //             }
    //
    //         } else {
    //             document = {...document, config: {}};
    //         }
    //     });
    //
    // }

    icon(filename: string) {
        return this.File.icon(filename);
    }

    canDownloadAll(): Observable<boolean> {
        return this.documents.pipe(
            take(1),
            filter(data => data !== null),
            map(documents => {
                console.log(documents);
                return documents.filter(document => {
                    // let canDownloadFiles: boolean = false;
                    // let self = this;

                    // if (isNullOrUndefined(this.documents))
                    //     return false;

                    // this.documents.forEach(function (document) {

                    // if (self.isDownloableDocument(document)) {
                    //     canDownloadFiles = true;
                    // }
                    // });

                    // return canDownloadFiles;
                    return this.isDownloableDocument(document);
                }).length > 0;
            })
        );
    }

    /**
     *
     * @param document
     */
    isDownloableDocument(document: DocumentModel): boolean {
        return (this.userService.userData.id == document.createdByUserId) ? true : (document.canDownload == true) ? true : false;
    }
}
