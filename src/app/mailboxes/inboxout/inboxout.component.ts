import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { ErrorMessageComponent } from "../../messages/error-message/error-message.component";
import { MailboxService } from "../../_services/mailbox.service";
import { MatDialog, MatDialogConfig, MatSort, MatTableDataSource, MatPaginator } from "@angular/material";
import { isNullOrUndefined, isObject } from "util";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons/faFolderOpen";
import { InboxoutPreviewDialogComponent } from "../inboxout-preview/inboxout-preview-dialog.component";
import { NotifierComponent } from "../../notifier/notifier.component";
import { ActivatedRoute } from "@angular/router";
import { AdvancedSearchService } from "../../_services/advanced-search.service";
import { AdvancedSearchComponent } from "../advanced-search/advanced-search.component";
import { MailboxClass } from "../MailboxClass";
import { Store } from "@ngrx/store";
import * as MailboxReducer from "../../_store/reducers/mailbox.reducer";
import * as MailboxActions from "../../_store/actions/mailbox.actions";

@Component({
    selector: 'app-inboxout',
    templateUrl: './inboxout.component.html',
    styleUrls: ['./inboxout.component.css']
})
export class InboxoutComponent extends MailboxClass implements OnInit, OnDestroy {
    @ViewChild( ErrorMessageComponent ) errorMessage;
    @ViewChild( MatSort ) sort: MatSort;
    @ViewChild( MatPaginator ) paginator: MatPaginator;
    @ViewChild( NotifierComponent ) notifier;

    @ViewChild(AdvancedSearchComponent) advancedSearchComponent;

    openIcon = faFolderOpen;

    tablePageSize = 15;
    tablePageSizeOptions = [15, 50, 100];
    displayedColumns: string[] = ['id', 'name', 'created_at', 'actions'];
    @Input() dataSource = new MatTableDataSource([]);
    emptyTableText = 'No se encontraron datos';

    lastIndexDefaultFields = 4;

    selectedRowIndex = -1;

    constructor(
        private mailboxService: MailboxService,
        public dialog: MatDialog,
        private activatedRoute: ActivatedRoute,
        private advancedSearchService: AdvancedSearchService,
        public store$: Store<MailboxReducer.State>,

    ) {
        super(dialog, store$);
    }

    ngOnInit() {
        this.advancedSearchService.performSearch.subscribe(formGroup => {
            this.setMailbox(formGroup);
        });

        this.activatedRoute.params.subscribe(val => {
            this.getRoutes();
        });
    }

    getRoutes(){
        if(isNullOrUndefined(this.mailboxStatus))
            return 0;

        this.clearStore();
        this.setMailbox();
    }

    buildMailboxTable(mailbox) {
        this.refreshTable(mailbox)
    }

    refreshTable(subjects) {
        this.dataSource = new MatTableDataSource(subjects);
        this.dataSource.filterPredicate = (data, filter: string)  => {
            const accumulator = (currentTerm, key) => {
                return this.nestedFilterCheck(currentTerm, data, key);
            };
            const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
            // Transform the filter by converting it to lowercase and removing whitespace.
            const transformedFilter = filter.trim().toLowerCase();
            return dataStr.indexOf(transformedFilter) !== -1;
        };
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

    nestedFilterCheck(search, data, key) {
        if (typeof data[key] === 'object') {
            for (const k in data[key]) {
                if (data[key][k] !== null) {
                    search = this.nestedFilterCheck(search, data[key], k);
                }
            }
        } else {
            search += data[key];
        }
        return search;
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    selectedSubject(subject){
        if(isNullOrUndefined(subject))
            return;

        this.selectedRowIndex = subject.id;
    }

    openSubject(subject){
        let dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = subject;
        dialogConfig.width = '96%';
        // dialogConfig.height = '90%';
        // dialogConfig.panelClass = 'dialog-class';

        const dialog = this.dialog.open(InboxoutPreviewDialogComponent, dialogConfig);

        dialog.afterClosed().subscribe(callbackData => {
            console.log(callbackData);
            if(isObject(callbackData)){
                if(callbackData.action === 'asuntoFinalizado') {
                    this.notifier.show({
                        message: "Asunto finalizado",
                        type: "success"
                    });

                    this.deleteSubjectFromTable(subject.subjectRequest.id);
                }

                if(callbackData.action === 'asuntoResuelto') {
                    console.log("asunto resuelto");
                    this.notifier.show({
                        message: "Asunto resuelto",
                        type: "success"
                    });

                    // this.deleteSubjectFromTable(subject.id)

                }

                if (callbackData.action === 'cancelSubject') {
                    this.notifier.show({
                        message: "Asunto cancelado",
                        type: "success"
                    });

                    this.deleteSubjectFromTable(subject.subjectRequest.id);
                }
            }

        });
    }

    deleteSubjectFromTable(subjectRequestId) {
        let data = this.dataSource.data;

        const index = data.findIndex(x => x.subjectRequest.id === subjectRequestId);

        if (index > -1) {
            data = data.filter(subject => subject.subjectRequest.id !== subjectRequestId);
        }

        this.dataSource.data = data;
    }


    get mailboxType() : string {
        return this.activatedRoute.snapshot.url[0].path;
    }

    get mailboxStatus() {
        return (this.activatedRoute.snapshot.url.length > 1) ? this.activatedRoute.snapshot.url[1].path : null;
    }

    get organizationalUnitId(): number {
        return (!isNullOrUndefined(this.activatedRoute.snapshot.url[2])) ? parseInt(this.activatedRoute.snapshot.url[2].path) : 0;
    }

    /**
     *
     * @param mailboxType inbox|inboxoutput
     * @param subjectType Nuevo|Avanzado|Resuelto|Reactivado
     */
    setMailbox(params = null){
        if(! (this.organizationalUnitId > 0))
            return;

        this.mailboxService.getMailbox(this.mailboxType, this.mailboxStatus, this.organizationalUnitId, params).subscribe(
            response => {
                if(response.status) {
                    this.buildMailboxTable(response.mailbox);
                    this.store$.dispatch(new MailboxActions.StoreMailboxSubjects(response.mailbox));
                }else{
                    this.errorMessage.setErrorMessage(response);
                }
            },
            error => {
                console.error(error);
                this.errorMessage.setErrorMessage(error);
            }
        );
    }

    /**
     *
     * @param filters
     * @param mailboxSubject
     */
    filterSubjects(filters, mailboxSubject: Array<any>) {
        let self = this;

        let subjects = mailboxSubject.reduce(function(result, subject) {
            console.log(subject);
            if(subject.subjectRequest.process.id === filters.process.id) {
                let filtersSelected = [];

                filters.metadata.forEach(function(metadata) {
                    let metadataValue = subject.subjectRequest.metadataValue.find(metadata_ => metadata_.field.id === metadata.id);

                    if(metadataValue.field.catDataType.field_name === 'catalog') {
                        let catalogData = metadataValue.field.catalogData.find(option => option.id === parseInt(metadataValue.value));
                        filtersSelected.push(catalogData.name);
                    } else {
                        filtersSelected.push(metadataValue.value);
                    }
                });

                result.push({...subject, filters: filtersSelected});

            }

            return result;

        }, []);

        this.resetTableHeaders();

        filters.metadata.forEach(function(metadata) {
            self.displayedColumns.push(metadata.field_name_text);
            self.filterSelected.push(metadata);
        });

        this.refreshTable(subjects);

    }

    ngOnDestroy(): void {
        this.store$.dispatch(new MailboxActions.ClearAllProcess());
        this.clearStore();
    }
}
