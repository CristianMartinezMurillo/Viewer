import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, MatDialogConfig } from "@angular/material";
import { faEdit, faPlusCircle, faTrashAlt, faCogs } from '@fortawesome/free-solid-svg-icons';
import { ErrorMessageComponent } from "../../messages/error-message/error-message.component"
import { DialogNewMetadataComponent } from "../new-metadata/dialog-new-metadata.component";
import { isNullOrUndefined, isObject } from "util";
import { CatDataTypeService } from "../../_services/cat-data-type.service";
import { DialogEditMetadataComponent } from "../edit-metadata/dialog-edit-metadata.component";
import { ProcessService } from "../../_services/process.service"
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CompanyService } from "../../_services/company.service";
import { Router } from "@angular/router";
import {ProcessTreePanelService} from "../../process-tree-panel/process-tree-panel.service";
import * as ProcessReducer from '../../_store/reducers/process.reducer';
import * as ProcessActions from '../../_store/actions/process.actions';
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-new-process',
  templateUrl: './new-process.component.html',
  styleUrls: ['./new-process.component.css']
})
export class NewProcessComponent implements OnInit{

    @ViewChild(ErrorMessageComponent) errorMessage;

    faEdit = faEdit;
    faDelete = faTrashAlt;
    faAdd = faPlusCircle;
    faBuild = faCogs;

    displayedColumns: string[] = ['name', 'type', 'required', 'length', 'isInternal', 'isExternal', 'actions'];
    dataSource = new MatTableDataSource([]);
    emptyTableText = 'De click en agregar metadato.';
    formGroup: FormGroup;

    companiesArray = [];
    catDataType;
    submitted = false;

    metadataArray = [
        // {id: 1, field_name_text: 'Fecha inicio', cat_dataTypeText: 'Fecha', requiredText: 'si', defaultField: true},
        // {id: 2, field_name_text: 'Fecha fin', cat_dataTypeText: 'Fecha',requiredText: 'si', defaultField: true}
    ];

    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
        private catDataTypeService: CatDataTypeService,
        private processService: ProcessService,
        private companyService: CompanyService,
        private router: Router,
        private processTreeService: ProcessTreePanelService,
        private store: Store<ProcessReducer.State>
    ) { }

    ngOnInit(): void {
        this.formGroup = this.fb.group({
            field_name_text: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
            // company_id: ['', [Validators.required]],
        });

        this.catDataTypeService.get().subscribe(
            result => {
                if(result.status){
                    this.catDataType = result.cat;
                }
            },
            error => {
            this.errorMessage.setErrorMessage(error);
            }
        );

        this.companyService.get().subscribe(
            result => {
                if(result.status){
                    this.companiesArray = result.companies;
                }
            },
            error => {
                this.errorMessage.setErrorMessage(error);
            }
        );

        this.refreshTable();
    }

    // convenience getter for easy access to form fields
    get form() { return this.formGroup.controls; }

    refreshTable(): void {
        this.dataSource = new MatTableDataSource(this.metadataArray);
    }


    dialogAddNewMetadata(): void {
        let dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.maxWidth = '500px';
        dialogConfig.data = this.catDataType;

        const dialog = this.dialog.open(DialogNewMetadataComponent, dialogConfig);

        dialog.afterClosed().subscribe(callback => {
            console.log(callback);

            if( !isNullOrUndefined(callback) && callback.hasOwnProperty('metadata')){
                this.tableAddItem(callback.metadata);
            }
        });
    }

    tableAddItem(newItem): void {
        this.metadataArray.push(newItem);
        this.dataSource.data = this.metadataArray;
    }

    dialogEditMetadata(row): void {
        console.log(row);
        let dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.data = { inputsData: row, catDataType: this.catDataType };
        dialogConfig.maxWidth = '500px';

        const dialog = this.dialog.open(DialogEditMetadataComponent, dialogConfig);

        dialog.afterClosed().subscribe(updateData => {
            if( isObject(updateData)){
                console.log("update data");
                console.log(updateData);
                this.updateRow(updateData);
            }
        });
    }

    updateRow(newData): void {
        const foundIndex = this.metadataArray.findIndex(x => x.id === newData.id);
        this.metadataArray[foundIndex] = newData;
        const data = this.dataSource.data;
        this.dataSource.data = data;
    }

    deleteMetadata(idItem) {
        const data = this.dataSource.data;
        const index = data.findIndex(x => x.id === idItem);

        if (index > -1) {
            data.splice(index, 1);
        }

        this.dataSource.data = data;
    }

    public getSerializeFormData(){
        return this.formGroup.value;
    }

    buildProcess() {
        this.submitted = true;

        Object.keys(this.formGroup.controls).forEach(field => { // {1}
            const control = this.formGroup.get(field);            // {2}
            control.markAsTouched({ onlySelf: true });       // {3}
        });

        if( this.formGroup.invalid ) {
            console.log('invalid formGroup');
            return 0;
        }

        let params = {
            metadata: this.metadataWithoutDefaultFields(),
            // company_id: this.form.company.value,
            process_name_text: this.form.field_name_text.value
        };

        this.processService.buildProcess(params).subscribe(
            response => {
                if(response.status){
                    this.metadataArray = [];
                    this.store.dispatch(new ProcessActions.AddNewProcess(response.process));
                    this.redirectToProcessInterface();
                }else{
                    this.errorMessage.setErrorMessage(response)
                }
            },
            error => {
                console.log(error);
                this.errorMessage.setErrorMessage(error);
            }
        );
    }

    metadataWithoutDefaultFields(){
        let metadataFiltered = [];

        this.dataSource.data.forEach(metadata => {
            if(!(!isNullOrUndefined(metadata.defaultField) && metadata.defaultField === true)) //only default fields
                metadataFiltered.push(metadata);
        });

        return metadataFiltered;
    }

    redirectToProcessInterface(){
        this.router.navigate(['panel/process']);
    }

    onSubmit() {

    }

}
