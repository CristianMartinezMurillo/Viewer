import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ErrorMessageComponent } from "../../messages/error-message/error-message.component";
import { MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { NotifierComponent } from "../../notifier/notifier.component";
import { AdvancedSearchComponent } from "../advanced-search/advanced-search.component";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons/faFolderOpen";
import { ActivatedRoute, Router } from "@angular/router";
import { MailboxService } from "../../_services/mailbox.service";
import { AdvancedSearchService } from "../../_services/advanced-search.service";
import { Store} from "@ngrx/store";
import * as NewSubjectReducer from "../../_store/reducers";
import * as SubjectReducer from "../../_store/reducers/subject.reducer";
import { isNullOrUndefined, isObject } from "util";
import * as SubjectActions from "../../_store/actions/subject.actions";
import { ExternalFinishedPreviewComponent } from "../external-finished-preview/external-finished-preview.component";

@Component({
  selector: 'app-external-finished-mailbox',
  templateUrl: './external-finished-mailbox.component.html',
  styleUrls: ['./external-finished-mailbox.component.css']
})
export class ExternalFinishedMailboxComponent implements OnInit {

  @ViewChild( ErrorMessageComponent ) errorMessage;
  @ViewChild( MatSort ) sort: MatSort;
  @ViewChild( MatPaginator ) paginator: MatPaginator;
  @ViewChild( NotifierComponent ) notifier;
  @Input() dataSource = new MatTableDataSource([]);

  @ViewChild(AdvancedSearchComponent) advancedSearchComponent;

  subscription;

  tablePageSize = 15;
  tablePageSizeOptions = [15, 50, 100];
  displayedColumns: string[] = ['id','subjectTitle','created_at', 'untilDate', 'actions', 'status'];
  emptyTableText = 'No se encontraron datos';

  selectedRowIndex = -1;

  openIcon = faFolderOpen;

  constructor(
      private router: Router,
      private mailboxService: MailboxService,
      private dialog: MatDialog,
      private activatedRoute: ActivatedRoute,
      private advancedSearchService: AdvancedSearchService,
      private store$: Store<NewSubjectReducer.State>,
      private subject$: Store<SubjectReducer.State>,
  ) { }

  ngOnInit() {
    console.log('init');
    this.subscription = this.activatedRoute.params.subscribe(val => {
      // this.store$.dispatch(new MailboxActions.SetCurrentOrganizationalUnitId(this.organizationalUnitId));
      console.log('subscribe');
      this.getMailboxData();
    });

    console.log(this.subscription);

    this.advancedSearchService.performSearch.subscribe(formGroup => {
      this.getMailboxData(formGroup);
    });
  }

  get mailboxStatus() {
    return this.activatedRoute.snapshot.paramMap.get('mailboxName');
  }

  get mailboxType() {
    return this.activatedRoute.snapshot.paramMap.get('mailboxType');
  }

  get organizationalUnitId(): number {
    const organizationalUnitId =  this.activatedRoute.snapshot.paramMap.get('organizationalUnitId');

    return parseInt(organizationalUnitId);
  }

  /**
   *
   * @param mailboxType inbox|inboxoutput
   * @param subjectType Nuevo|Avanzado|Resuelto|Reactivado
   */
  getMailboxData(params = null) {
    if(! (this.organizationalUnitId > 0))
      return;

    console.log(this.mailboxStatus);
    console.log(this.mailboxType);

    if (this.mailboxType === 'inboxout') {
      return;
    }

    this.mailboxService.getExternalMailbox( this.mailboxType, this.mailboxStatus, this.organizationalUnitId, params).subscribe(
        response => {
          if(response.status) {
            this.buildTableInbox(response['mailbox']);
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

  buildTableInbox(mailbox) {
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

  applyFilter (filterValue: string) {
    console.log("aplyfilter");
    console.log(this.dataSource);
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

    const dialog = this.dialog.open(ExternalFinishedPreviewComponent, dialogConfig);

    dialog.afterClosed().subscribe(callbackData => {
      console.log(callbackData);
      if(isObject(callbackData)){
        if(callbackData.action === 'asuntoFinalizado') {
          this.notifier.show({
            message: "Asunto finalizado",
            type: "success"
          });

          this.deleteSubjectFromTable(subject.id)
        }
      }
    });
  }

  deleteSubjectFromTable(idItem) {
    const data = this.dataSource.data;
    const index = data.findIndex(x => x.id === idItem);

    if (index > -1) {
      data.splice(index, 1);
    }

    this.dataSource.data = data;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
