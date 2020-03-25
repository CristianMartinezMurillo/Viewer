import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ErrorMessageComponent } from "../../messages/error-message/error-message.component";
import { MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { NotifierComponent } from "../../notifier/notifier.component";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons/faFolderOpen";
import { MailboxService } from "../../_services/mailbox.service";
import { Store} from "@ngrx/store";
import * as MailboxReducer from "../../_store/reducers/mailbox.reducer";
import { ProcessService } from "../../_services/process.service";
import { ActivatedRoute } from "@angular/router";
import { isNullOrUndefined, isObject} from "util";
import * as MailboxActions from "../../_store/actions/mailbox.actions";
import { InternalHistoricoPreviewDialogComponent } from "../internal-historico-preview/internal-historico-preview-dialog.component";
import { MailboxClass } from "../MailboxClass";

@Component({
  selector: 'app-external-historico',
  templateUrl: './external-historico.component.html',
  styleUrls: ['./external-historico.component.css']
})
export class ExternalHistoricoComponent extends MailboxClass implements OnInit, OnDestroy {
  @ViewChild( ErrorMessageComponent ) errorMessage;
  @ViewChild( MatSort ) sort: MatSort;
  @ViewChild( MatPaginator ) paginator: MatPaginator;
  @ViewChild( NotifierComponent ) notifier;

  openIcon = faFolderOpen;

  tablePageSize = 15;
  tablePageSizeOptions = [15, 50, 100];
  displayedColumns: string[] = ['id', 'name', 'finalizar_datetime', 'actions'];
  @Input() dataSource = new MatTableDataSource([]);
  emptyTableText = 'No se encontraron datos';

  selectedRowIndex = -1;

  lastIndexDefaultFields = 4; //


  constructor(
      private mailboxService: MailboxService,
      public dialog: MatDialog,
      public store$: Store<MailboxReducer.State>,
      private processService: ProcessService,
      private activatedRoute: ActivatedRoute,
  ) {
    super(dialog, store$);
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(val => {
      this.getRoutes();
    });
  }

  getRoutes(){
    this.clearStore();
    this.setMailbox();
  }

  setMailbox(): void {
    if (!(this.organizationalUnitId > 0))
      return;

    this.mailboxService.externalHistorico(this.organizationalUnitId).subscribe(
        response => {
          if(response['status']) {
            this.store$.dispatch(new MailboxActions.StoreMailboxSubjects(response['mailbox']));
            this.buildTable(response['mailbox']);
          } else {
            this.errorMessage.setErrorMessage(response);
          }
        },
        error => {
          console.error(error);
          this.errorMessage.setErrorMessage(error);
        }
    );
  }
  buildTable(mailbox) {
    this.refreshTable(mailbox)
  }

  refreshTable(subjects) {
    this.dataSource = new MatTableDataSource(subjects);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
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
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = subject;
    dialogConfig.width = '96%';
    // dialogConfig.height = '90%';
    // dialogConfig.panelClass = 'dialog-class';

    const dialog = this.dialog.open(InternalHistoricoPreviewDialogComponent, dialogConfig);

    dialog.afterClosed().subscribe(callbackData => {
      console.log(callbackData);
      if(isObject(callbackData)){

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

  filterSubjects(filters, mailboxSubject: Array<any>) {
    let self = this;

    let subjects = mailboxSubject.reduce(function(result, subject) {
      console.log(subject);
      if(subject.process.id === filters.process.id) {
        let filtersSelected = [];

        filters.metadata.forEach(function(metadata) {
          let metadataValue = subject.metadataValue.find(metadata_ => metadata_.field.id === metadata.id);

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

  get organizationalUnitId(): number {
    const organizationalUnitId =  parseInt(this.activatedRoute.snapshot.paramMap.get('organizationalUnitId'));

    return (organizationalUnitId > 0) ? organizationalUnitId : 0;
  }

  ngOnDestroy(): void {
    this.clearStore();
  }



}
