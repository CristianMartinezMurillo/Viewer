import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, MatDialogConfig } from "@angular/material";
import { faEdit, faPlusCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { ErrorMessageComponent } from "../../messages/error-message/error-message.component"
import { DialogNewMetadataComponent } from "../new-metadata/dialog-new-metadata.component";
import { isNullOrUndefined, isObject } from "util";
import { CatDataTypeService } from "../../_services/cat-data-type.service";
import { DialogEditMetadataComponent } from "../edit-metadata/dialog-edit-metadata.component";
import { ProcessService } from "../../_services/process.service"
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { DangerConfirmationDialogComponent } from "../../dialog/danger-confirmation-dialog/danger-confirmation-dialog.component";
import { Store } from "@ngrx/store";
import * as ProcessReducer from '../../_store/reducers/process.reducer';
import * as ProcessActions from '../../_store/actions/process.actions';

@Component({
  selector: 'app-edit-process',
  templateUrl: './edit-process.component.html',
  styleUrls: ['./edit-process.component.css']
})
export class EditProcessComponent implements OnInit {

    @ViewChild(ErrorMessageComponent) errorMessage;

    faEdit = faEdit;
    faDelete = faTrashAlt;
    faAdd = faPlusCircle;

    process;

    displayedColumns: string[] = ['name', 'type', 'required', 'length', 'isInternal', 'isExternal' ,'actions'];
    dataSource = new MatTableDataSource([]);
    emptyTableText = 'De click en agregar metadato.';
    formGroup: FormGroup;

    metadataArray = [];

    catDataType;
    submitted = false;
    processId;

    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
        private catDataTypeService: CatDataTypeService,
        private processService: ProcessService,
        private activatedRoute: ActivatedRoute,
        private store: Store<ProcessReducer.State>
    ) { }

    ngOnInit(): void {
        this.formGroup = this.fb.group({
            field_name_text: [{value: '', disabled:true}, [Validators.required, Validators.minLength(2)]],
            // company_id: [{value: '', disabled:true}, [Validators.required]],
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

        this.refreshTable();

        this.setProcessData();
    }

    setProcessData() {
      this.processId = this.activatedRoute.snapshot.paramMap.get('id');

      this.processService.getProcessMetadata(this.processId).subscribe(
          result => {
            console.debug(result);
            this.process = result.process;
            this.metadataArray = this.process.metadata;
            this.refreshTable();
          },
          error => {
            console.debug(error);
            this.errorMessage.setErrorMessage(error);
          }
      );
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

        dialog.afterClosed().subscribe(dialogResponse => {

            if( !isNullOrUndefined(dialogResponse) && dialogResponse.hasOwnProperty('metadata')){
                this.processService.addMetadata(this.process.id, {metadata: dialogResponse.metadata}).subscribe(
                    success => {
                        console.log(success);
                        if(success.status){
                            let newMetadata = success.metadata;

                            dialogResponse.metadata.id = newMetadata.id;
                            dialogResponse.metadata.catalogData = newMetadata.catalogData;
                            dialogResponse.metadata.proceso_id = newMetadata.proceso_id;

                            this.store.dispatch(new ProcessActions.AddNewMetadataToProcess(this.processId, success.metadata));

                            this.tableAddItem(dialogResponse.metadata);
                        }
                    },
                    error => {
                        console.log(error);
                        this.errorMessage.setErrorMessage(error);
                    }
                );
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
        dialogConfig.data = {inputsData: row, catDataType: this.catDataType, updateProcess: true};
        dialogConfig.maxWidth = '500px';

        const dialog = this.dialog.open(DialogEditMetadataComponent, dialogConfig);

        dialog.afterClosed().subscribe(updateData => {
            if( isObject(updateData)){
                console.log("update data");
                console.log(updateData);

                updateData.field_name_text = row.field_name_text;

                this.processService.updateMetadata(this.process.id, row.id, {metadata: updateData}).subscribe(
                    response => {
                        console.debug(response);

                        if(response.status === true) {
                            // updateData.catDataType = {name: updateData.cat_dataTypeText};
                            this.store.dispatch(new ProcessActions.ModifyProcessMetadata(this.processId, updateData));
                            this.updateRow(updateData);
                        }
                        else
                            this.errorMessage.setErrorMessage(response);
                    },
                    error => {
                        console.debug(error);
                        this.errorMessage.setErrorMessage(error);
                    }
                );

            }
        });
    }

    updateRow(newData): void {
        const foundIndex = this.metadataArray.findIndex(x => x.id === newData.id);
        this.metadataArray[foundIndex] = newData;
        const data = this.dataSource.data;
        this.dataSource.data = data;
    }

    dialogDeleteMetadata(metadata){
        console.log(metadata);
        let dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {title: 'Precaución', textContent: '¿Realmente desea eliminar el metadato ' + metadata.field_name_text + '?'};
        dialogConfig.maxWidth = '300px';
        dialogConfig.panelClass = 'dialog-confirmation-class';

        const dialog = this.dialog.open(DangerConfirmationDialogComponent, dialogConfig);

        dialog.afterClosed().subscribe(confirmation => {
            if(!isNullOrUndefined(confirmation) && confirmation.confirmation){
                this.processService.deleteMetadata(metadata.proceso_id, metadata.id).subscribe(result => {
                        console.log('deleteMetadata');
                        console.log(result);

                        if( result.status ){
                            this.store.dispatch(new ProcessActions.DeleteMetadaFromProcess(this.processId, metadata.id));
                            this.deleteItem(metadata.id);
                        }
                    },
                    error => {
                  this.errorMessage.setErrorMessage(error);
                        console.log('error deleteMetadata');
                        console.log(error);
                    }
                );
            }
        });
    }

    deleteItem(idItem) {
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

    onSubmit() {

    }
}
