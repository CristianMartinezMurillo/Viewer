import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatSort, MatTableDataSource, MatPaginator } from "@angular/material";
import { DangerConfirmationDialogComponent } from "../dialog/danger-confirmation-dialog/danger-confirmation-dialog.component"
import { faBuilding, faEdit, faPlusCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { isNullOrUndefined } from "util";
import { CompanyService} from "../_services/company.service";
import { NewCompanyDialogComponent } from "./new-company-dialog/new-company-dialog.component";
import { EditCompanyDialogComponent } from "./edit-company-dialog/edit-company-dialog.component";
import { DataTableConfig } from "../config/DataTable.config";
import { ErrorMessageComponent } from "../messages/error-message/error-message.component";

@Component({
  selector: 'app-admin-companies',
  templateUrl: './admin-companies.component.html',
  styleUrls: ['./admin-companies.component.css']
})
export class AdminCompaniesComponent implements OnInit {
    @ViewChild(ErrorMessageComponent) errorMessage;

    faCompanyEdit = faEdit;
    faCompanyDelete = faTrashAlt;
    faCompanies = faBuilding;
    faCompanyAdd = faPlusCircle;

    tablePageSize = 15;
    tablePageSizeOptions = [15, 50, 100];
    displayedColumns: string[] = ['name', 'business_key', 'description', 'actions'];
    dataSource = new MatTableDataSource([]);
    emptyTableText = 'No se encontraron datos';

    companiesArray = [];

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private companyService : CompanyService,
        private dialog: MatDialog,
        private dataTableConfig: DataTableConfig
    ) { }

    ngOnInit() {
        this.buildAdminCompanies();

        /**this.paginator._intl.firstPageLabel     = 'Inicio';
        this.paginator._intl.lastPageLabel      = 'Última página';
        this.paginator._intl.nextPageLabel      = 'Siguiente';
        this.paginator._intl.previousPageLabel  = 'Atrás';
        this.paginator._intl.itemsPerPageLabel  = 'Elementos por página';*/
    }

    buildAdminCompanies() {
        this.companyService.get().subscribe(result => {
            console.log(result);
            if(result.status === true){
                this.companiesArray = result.companies;
                this.refreshTable();
            }else{
                this.errorMessage.setErrorMessage(result);
            }
        }, error => {
            console.log('adminCompanies error getCompanies()');
            console.log(error);
            this.errorMessage.setErrorMessage(error);
        });
    }

    openEditCompany(row) {
        let dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.data = row;
        dialogConfig.maxWidth = '500px';

        const dialog = this.dialog.open(EditCompanyDialogComponent, dialogConfig);

        dialog.afterClosed().subscribe(updateData => {
            console.log(updateData);

            if(!isNullOrUndefined(updateData)) {
                this.updateRow(updateData.company);
            }
        });
    }

    updateRow(newData) {
        const foundIndex = this.companiesArray.findIndex(x => x.id === newData.id);
        this.companiesArray[foundIndex] = newData;
        const data = this.dataSource.data;
        this.dataSource.data = data;
    }

    openNewCompany() {
        let dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.maxWidth = '500px';

        const dialog = this.dialog.open(NewCompanyDialogComponent, dialogConfig);

        dialog.afterClosed().subscribe(result => {
            if(result.status){
                this.tableAddItem(result.company)
            }else{

            }
        });
    }

    tableAddItem(newItem) {
        console.log("add Item ");
        console.log(newItem);
        //this.dataSource.data.push() doesn't work, bug https://github.com/angular/material2/issues/8381
        const data = this.dataSource.data;
        data.push(newItem);
        this.dataSource.data = data;
    }

    deleteCompany(company) {
        console.log('delete Company')
        let dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {title: 'Precaución', textContent: '¿Realmente desea eliminar la empresa ' + company.name + ' ' + company.business_key};
        dialogConfig.maxWidth = '300px';
        dialogConfig.panelClass = 'dialog-confirmation-class';

        const dialog = this.dialog.open(DangerConfirmationDialogComponent, dialogConfig);

        dialog.afterClosed().subscribe(confirmation => {
            if(!isNullOrUndefined(confirmation) && confirmation.confirmation){
                this.companyService.delete(company.id).subscribe(result => {
                        console.log('deleteCompany');
                        console.log(result);

                        if( result.status ){
                            this.removeItemFromTable(company.id);
                        }
                    },
                    error => {
                        console.log('error deleteCompany');
                        console.log(error);
                        this.errorMessage.setErrorMessage(error);
                    }
                );
            }
        });
    }

    removeItemFromTable(idItem) {
        const data = this.dataSource.data;
        const index = data.findIndex(x => x.id === idItem);

        if (index > -1) {
            data.splice(index, 1);
        }

        this.dataSource.data = data;
    }

    refreshTable() {
        this.dataSource = new MatTableDataSource(this.companiesArray);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

    applyFilter (filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

}
