import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { faBan, faTrashAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons/faPlusCircle";
import { MatDialog, MatDialogConfig, MatSort, MatTableDataSource, MatPaginator } from "@angular/material";
import { isNullOrUndefined } from "util";
import { CatalogService } from "../../_services/catalog.service";
import { ErrorMessageComponent } from "../../messages/error-message/error-message.component";

@Component({
  selector: 'app-dialog-edit-metadata',
  templateUrl: './dialog-edit-metadata.component.html',
  styleUrls: ['./dialog-edit-metadata.component.css']
})
export class DialogEditMetadataComponent implements OnInit {
    @ViewChild(ErrorMessageComponent) errorMessage;

    faEdit = faEdit;
    faDelete = faTrashAlt;
    faPlus = faPlusCircle;
    faCancel = faBan;
    formGroup: FormGroup;
    metadataformGroup: FormGroup;
    submitted = false;

    catDataType;
    showCatalogoptions = false;

    displayedColumns: string[] = ['name', 'actions'];
    dataSource = new MatTableDataSource([]);
    emptyTableText = 'El catálogo esta vacio';

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<DialogEditMetadataComponent>,
        private serviceCatalog: CatalogService,
        @Inject(MAT_DIALOG_DATA) public dialogData
    ) { }

  ngOnInit() {
      const field_name_text_options = (this.dialogData.hasOwnProperty('updateProcess')) ? {value: '', disabled: true} : {value: ''};
      const catDatatypeOptions = ((this.isBuildingNewProcess() === false) && (this.isCatalog() === true)) ? {value: '', disabled: true} : {value: ''} ;

      this.formGroup = this.fb.group({
          field_name_text:  [field_name_text_options, [Validators.required]],
          cat_dataType_id:  [catDatatypeOptions, [Validators.required]],
          required:         ['', []],
          max_length:       ['', [
              Validators.required,
              Validators.max(255),
              Validators.min(1),
              Validators.pattern('^[0-9]*$')]
          ],
          isInternal: [false, []],
          isExternal: [false, []],
      });

      this.metadataformGroup = this.fb.group({
          metadataField: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
      });

      const currentField = this.getFieldTypeSelected(this.dialogData.inputsData.cat_dataType_id);

      this.catDataType = this.dialogData.catDataType.filter(type => {

          if (currentField.field_name === 'catalog' && type.field_name === 'catalog') {
              return true;
          }

          if(type.field_name === 'catalog') {
              return false;
          }

          return true;
      });

      if(!isNullOrUndefined(this.dialogData.inputsData.catalogData)){
          this.dataSource.data = this.dialogData.inputsData.catalogData;
      }

      this.setMetadataValues();
      this.selectMetadataChanged();
  }

    /**
     * flag that indicates if the user is creating a new process or if he is editing a metadata field
     * @returns {Boolean}
     */
  isBuildingNewProcess(): Boolean{
        return this.dialogData.hasOwnProperty('updateProcess') ? false : true;
  }

  isCatalog(){
      return (this.dialogData.inputsData.catDataType.name === 'Catálogo') ? true: false;
  }

  public setMetadataValues() {
      let inputsData = this.dialogData.inputsData;

      for (const key of Object.keys(inputsData)){
          if(this.formGroup.controls.hasOwnProperty(key)){
              this.formGroup.controls[key].setValue(inputsData[key]);
          }
      }
  }

    // convenience getter for easy access to form fields
    get form() { return this.formGroup.controls; }
    get metadataForm() { return this.metadataformGroup.controls; }

    public getSerializeFormData(){
      let serialized =  {...this.dialogData.inputsData,...this.formGroup.value};

        // let fieldType = this.getFieldTypeSelected(serialized);

        // serialized.id = this.dialogData.inputsData.id;
        // serialized.catDataType = fieldType;
        // serialized.catDataType = this.catDataType;
        // serialized.cat_dataTypeText = fieldType.name;
        serialized.required = (serialized.required === true) ? 1 : 0;
        serialized.requiredText = (serialized.required === true) ? 'si' : 'No';
        serialized.max_length = (serialized.hasOwnProperty('max_length')) ? parseInt(serialized.max_length) : 0;
        serialized.isCatalog = false;

        // if(fieldType.name === 'Catálogo'){
        //     serialized.catalogData = this.dataSource.data;
        //     serialized.isCatalog = true;
        //     serialized.required = true;
        // }

        return serialized;
    }

    modifyMetadata() {
        this.submitted = true;

        Object.keys(this.formGroup.controls).forEach(field => { // {1}
            const control = this.formGroup.get(field);            // {2}
            control.markAsTouched({ onlySelf: true });       // {3}
        });

        this.form.isInternal.setErrors(null);

        // stop here if form is invalid
        if (this.formGroup.invalid) {
            console.log('invalid formGroup');
            return;
        }

        let serialized = this.getSerializeFormData();

        if(this.dialogData.inputsData.isCatalog &&  this.dataSource.data.length === 0){
            return 0;
        }

        if(serialized.isExternal == 0 && serialized.isInternal == 0) {
            this.form.isInternal.setErrors({'required': true});
            return 0;
        }
        this.dialogRef.close(serialized);
    }

    selectMetadataChanged(){
        let idDataType = this.formGroup.get('cat_dataType_id').value;
        const indexDataType = this.dialogData.catDataType.findIndex(x => x.id === idDataType);
        let fieldType = this.dialogData.catDataType[indexDataType];

        if(idDataType > 0 && fieldType.max_length > 0){
            this.formGroup.get('max_length').enable();
        }else{
            this.formGroup.get('max_length').disable();
        }

        if(fieldType.name === 'Catálogo'){
            this.showCatalogoptions = true;
            this.formGroup.get('required').disable();
        }
        else{
            this.showCatalogoptions = false;
            this.formGroup.get('required').enable();
        }

    }

    getFieldTypeSelected(idDataType){
        const indexDataType = this.dialogData.catDataType.findIndex(x => x.id === idDataType);
        let fieldType = this.dialogData.catDataType[indexDataType];

        return fieldType;
    }

    ID () {
        // Math.random should be unique because of its seeding algorithm.
        // Convert it to base 36 (numbers + letters), and grab the first 9 characters
        // after the decimal.
        return '_' + Math.random().toString(36).substr(2, 9);
    };

    /**
     * Add options to the catalog table content
     */
    addCatalogOption(formDirective: FormGroupDirective){
        if(!this.metadataformGroup.valid)
            return 0;

        let newOptionValue = this.metadataForm.metadataField.value;

        let newOptionParams = {
            name: newOptionValue
        };

        this.resetForm(formDirective);

        if(this.isBuildingNewProcess()){
            this.addNewOptionCatalogTable(newOptionParams);
        }else{
            let idMetadata = this.dialogData.inputsData.id;

            this.serviceCatalog.add(idMetadata, newOptionParams).subscribe(
                response => {
                    if(response.status){
                        this.addNewOptionCatalogTable(response.newOption);
                    }else{
                        console.error(response);
                        this.errorMessage.setErrorMessage(response);
                    }
                },
                error => {
                    console.error(error);
                    this.errorMessage.setErrorMessage(error);
                }
            );
        }
    }

    resetForm(formDirective){
        formDirective.resetForm();
        this.metadataformGroup.reset();
    }

    editCatalogOption(option){
    }

    deleteCatalogOption(option){
        console.log(option);
        if(this.isBuildingNewProcess()) {
            this.removeFromCatalogOptionTable(option.id);
        }else{
            this.serviceCatalog.delete(option.id).subscribe(
                response => {
                    if(response.status){
                        this.removeFromCatalogOptionTable(option.id);
                    }else{
                        this.errorMessage.setErrorMessage(response);
                        console.error(response);
                    }
                },
                error => {
                    console.error(error);
                    this.errorMessage.setErrorMessage(error);
                }
            );
        }
    }

    addNewOptionCatalogTable(newItem) {
        //this.dataSource.data.push() doesn't work, bug https://github.com/angular/material2/issues/8381
        const data = this.dataSource.data;
        data.push(newItem);
        this.dataSource.data = data;

    }

    removeFromCatalogOptionTable(idItem) {
        const data = this.dataSource.data;
        const index = data.findIndex(x => x.id === idItem);

        if (index > -1) {
            data.splice(index, 1);
        }

        this.dataSource.data = data;
    }

    onSubmit() {

    }
}
