import { MatDialog, MatDialogConfig, MatTableDataSource } from "@angular/material";
import { FilterTableComponent } from "./filter-table/filter-table.component";
import { isObject } from "util";
import { ProcessModel } from "../_models/process.model";
import { MetadataModel } from "../_models/metadata.model";
import * as MailboxSelector from "../_store/selectors/mailbox.selector";
import { take } from "rxjs/operators";
import * as MailboxActions from "../_store/actions/mailbox.actions";
import { Input } from "@angular/core";
import { Store } from "@ngrx/store";
import * as ReceptionType from "../_constants/ReceptionType.constants";

export abstract class MailboxClass {
    @Input() dataSource = new MatTableDataSource([]);

    lastIndexDefaultFields: number; //
    filterSelected: Array<MetadataModel> = [];
    displayedColumns: Array<any>;

    protected constructor(
        public dialog: MatDialog,
        public store$: Store<any>,

    ) {}

    openTableFilters() {
        let dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {};
        dialogConfig.width = '500px';
        // dialogConfig.height = '90%';
        // dialogConfig.panelClass = 'dialog-class';

        const dialog = this.dialog.open(FilterTableComponent, dialogConfig);

        dialog.afterClosed().subscribe(filters => {
            if(isObject(filters)) {
                if(filters.callback === 'applyFilters')
                    this.applyColumnFilters(filters);
                if(filters.callback === 'removeFilters')
                    this.restoreTableFromState();
            }
        });
    }

    /**
     * Apply filter in columns
     * @param process
     */
    applyColumnFilters(filters: {process: ProcessModel, metadata: Array<MetadataModel>, callback: string}) {

        if(this.filterSelected.length === this.lastIndexDefaultFields) {
            this.filterSubjects(filters, this.dataSource.data);
        }
        else {
            this.loadTableFromStore(filters);
        }

    }

    loadTableFromStore(filters) {
        let self = this;

        this.store$.select(MailboxSelector.getMailboxSubjects)
            .pipe(take(1))
            .subscribe(
                response => {
                    self.filterSubjects(filters, response);
                }
            );

    }

    filterSubjects(filters, mailboxSubject: Array<any>) {
        let self = this;

        let subjects = mailboxSubject.reduce(function(result, subject) {
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

    removeColumnFiltersSelected() {
        this.store$.dispatch(new MailboxActions.ClearColumnFiltersSelected());
    }

    restoreTableFromState() {
        this.store$.select(MailboxSelector.getMailboxSubjects).
        pipe(take(1))
            .subscribe(
                response => {
                    let subjects = response;
                    this.resetTableHeaders();
                    this.removeColumnFiltersSelected();
                    this.refreshTable(subjects);

                },
                error => {
                    console.error(error);
                }
            );
    }

    resetTableHeaders() {
        this.displayedColumns = this.displayedColumns.slice(0, this.lastIndexDefaultFields);
    }

    removeMailboxSubjectsFromState() {
        this.store$.dispatch(new MailboxActions.ClearMailboxSubjects());
    }

    clearStore() {
        this.removeColumnFiltersSelected();
        this.removeMailboxSubjectsFromState();
    }

    abstract refreshTable(subjects);

    /**
     *
     * @param recipient
     */
     getReceptionType(recipient): string {
        if ( recipient.TURNAR === true || recipient.TURNAR === 1) {
            return ReceptionType.TURNAR;
        }

        if (recipient.CC === true || recipient.CC === 1) {
            return ReceptionType.CC;
        }

        if (recipient.CCC === true || recipient.CCC === 1) {
            return ReceptionType.CCC;
        }

        return "";
    }
}
