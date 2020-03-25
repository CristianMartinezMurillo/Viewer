import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { MatDialog, MatDialogConfig, MatSort, MatTableDataSource, MatPaginator } from "@angular/material";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons/faPlusCircle";
import { faBan, faTrashAlt, faEdit } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-dialog-new-metadata',
  templateUrl: './dialog-new-metadata.component.html',
  styleUrls: ['./dialog-new-metadata.component.css']
})
export class DialogNewMetadataComponent implements OnInit {
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
        public dialogRef: MatDialogRef<DialogNewMetadataComponent>,
        @Inject(MAT_DIALOG_DATA) public dialogData
    ) { }

    ngOnInit() {
        this.formGroup = this.fb.group({
            field_name_text: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
            cat_dataType_id: ['', [Validators.required]],
            required:        ['', []],
            max_length:      ['', [
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

        this.catDataType = this.dialogData;

        this.formGroup.get('max_length').disable();
    }

    public getSerializeFormData(){
        return this.formGroup.value;
    }

    // convenience getter for easy access to form fields
    get form() { return this.formGroup.controls; }
    get metadataForm() { return this.metadataformGroup.controls; }

    addMetadata() {
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


        let fieldType = this.getFieldTypeSelected(serialized);

        serialized.id = this.ID();
        serialized.cat_dataTypeText = fieldType.name;
        serialized.catDataType = fieldType;
        serialized.required = (serialized.required === true) ? true : false;
        serialized.requiredText = (serialized.required === true) ? 'si' : 'No';
        serialized.max_length = (serialized.hasOwnProperty('max_length')) ? serialized.max_length : 0;
        serialized.isCatalog = false;


        if(fieldType.name === 'Catálogo'){
            serialized.catalogData = this.dataSource.data;
            serialized.isCatalog = true;
            serialized.required = true;
        }

        if(serialized.isCatalog && this.dataSource.data.length === 0){
            return 0;
        }

        if(serialized.isExternal === false && serialized.isInternal === false) {
            this.form.isInternal.setErrors({'required': true});
            return 0;
        }


        this.dialogRef.close({status: true, metadata: serialized});

    }

    getFieldTypeSelected(serialized){
        let idDataType = serialized.cat_dataType_id;
        const indexDataType = this.dialogData.findIndex(x => x.id === idDataType);
        let fieldType = this.dialogData[indexDataType];

        return fieldType;
    }

    /**
     * On select a metadata type
     */
    selectMetadataChanged(){
        let idDataType = this.formGroup.get('cat_dataType_id').value;
        const indexDataType = this.dialogData.findIndex(x => x.id === idDataType);
        let fieldType = this.dialogData[indexDataType];

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
        console.log('addCatalogOption');

        if(!this.metadataformGroup.valid)
            return 0;

        let newOption = this.metadataForm.metadataField.value;

        formDirective.resetForm();
        this.metadataformGroup.reset();

        this.addNewOptionCatalogTable(
            {
                name: newOption
            }
        );
    }

    editCatalogOption(option){
    }

    deleteCatalogOption(option){
        this.removeFromCatalogOptionTable(option.id);
    }

    addNewOptionCatalogTable(newItem) {
        //this.dataSource.data.push() doesn't work, bug https://github.com/angular/material2/issues/8381
        const data = this.dataSource.data;
        data.push(newItem);
        this.dataSource.data = data;

        //this.metadataformGroup.get('metadataField').setErrors(null);
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
