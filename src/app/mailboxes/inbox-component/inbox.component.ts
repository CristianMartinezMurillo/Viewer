import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ErrorMessageComponent } from "../../messages/error-message/error-message.component";
import { ActivatedRoute, Router, UrlSegment} from "@angular/router";
import { MailboxService } from "../../_services/mailbox.service";
import { MatDialog, MatDialogConfig, MatSort, MatTableDataSource, MatPaginator } from "@angular/material";
import { isNullOrUndefined, isObject } from "util";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons/faFolderOpen";
import { InboxPreviewDialogComponent } from "../inbox-preview/inbox-preview-dialog.component";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons/faCalendarAlt";
import { NotifierComponent } from "../../notifier/notifier.component";
import { AdvancedSearchComponent } from "../advanced-search/advanced-search.component";
import { AdvancedSearchService } from "../../_services/advanced-search.service";
import * as MailboxActions from "../../_store/actions/mailbox.actions";
import { Store } from "@ngrx/store";
import * as MailboxReducer from "../../_store/reducers/mailbox.reducer";
import { MetadataModel } from "../../_models/metadata.model";
import { MailboxClass } from "../MailboxClass";
import { SubjectService } from "../../_services/subject.service";
import { AddresseeModel } from "../../_models/addresseeModel";
import { NUEVO_CODE } from "../../process-tree-panel/_models/MailboxNodes";
import * as SubjectReducer from '../../_store/reducers/subject.reducer';
import * as SubjectActions from '../../_store/actions/subject.actions';
import * as SubjectSelector from '../../_store/selectors/subject.selector';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent extends MailboxClass implements OnInit, OnDestroy {
    @ViewChild( ErrorMessageComponent ) errorMessage;
    @ViewChild( MatSort ) sort: MatSort;
    @ViewChild( MatPaginator ) paginator: MatPaginator;
    @ViewChild( NotifierComponent ) notifier;
    @ViewChild(AdvancedSearchComponent) advancedSearchComponent;
    @Input() dataSource = new MatTableDataSource([]);

    openIcon = faFolderOpen;

    tablePageSize = 15;
    tablePageSizeOptions = [15, 50, 100];
    displayedColumns: string[] = ['id','subjectTitle' ,'sender','created_at', 'untilDate', 'actions', 'status'];
    lastIndexDefaultFields = 7; //
    emptyTableText = 'No se encontraron datos';

    selectedRowIndex = -1;

    subjects: Array<AddresseeModel>;

    constructor(
      private mailboxService: MailboxService,
      public dialog: MatDialog,
      private activatedRoute: ActivatedRoute,
      private advancedSearchService: AdvancedSearchService,
      public store$: Store<MailboxReducer.State>,
      private subjectService: SubjectService,
      private subject$: Store<SubjectReducer.State>
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

    buildMailboxTable(mailbox){
        this.subjects = mailbox;
        this.refreshTable()
    }

    refreshTable() {
        this.dataSource = new MatTableDataSource(this.subjects);

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

    applyFilter (filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    selectedSubject(subject){
        if(isNullOrUndefined(subject))
          return;

        this.selectedRowIndex = subject.id;
    }

    openSubject(addressee: AddresseeModel){
        if(!addressee.wasRead) {

            this.markSubjectAsRead(addressee)
        }

        let dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = addressee;
        dialogConfig.width = '96%';
        // dialogConfig.height = '90%';
        // dialogConfig.panelClass = 'dialog-class';

        const dialog = this.dialog.open(InboxPreviewDialogComponent, dialogConfig);

        dialog.afterClosed().subscribe(callbackData => {
            this.subject$.dispatch(new SubjectActions.ClearSubject());
            if(isObject(callbackData)){
                if(callbackData.action === 'asuntoFinalizado') {
                    this.notifier.show({
                        message: "Asunto finalizado",
                        type: "success"
                    });

                    this.deleteSubjectFromTable(addressee.id)
                }

                if(callbackData.action === 'asuntoResuelto') {
                    this.notifier.show({
                        message: "Asunto resuelto",
                        type: "success"
                    });

                    this.deleteSubjectFromTable(addressee.id)

                }
            }
        });
    }

    /**
     *
     * @param addressee
     */
    markSubjectAsRead(addressee) {
        let data = this.dataSource.data.map(subject_ => {
            if(subject_.id === addressee.id)
                return {...subject_, wasRead: true};
            return subject_;
        });

        this.store$.dispatch(new MailboxActions.SubtractUnreadMailbox(NUEVO_CODE));

        this.dataSource.data = data;
    }

    deleteSubjectFromTable(idItem) {
        const data = this.dataSource.data;
        const index = data.findIndex(x => x.id === idItem);

        if (index > -1) {
            data.splice(index, 1);
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
    setMailbox(params = null): void {

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

    ngOnDestroy(): void {
        this.store$.dispatch(new MailboxActions.ClearAllProcess());
        this.clearStore();
    }

}
