import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, FormGroup, Validators} from "@angular/forms";
import { ErrorMessageComponent } from "../../messages/error-message/error-message.component"
import { faEdit, faBan, faSitemap } from "@fortawesome/free-solid-svg-icons";
import { OrganizationalUnitService } from "../../_services/organizational-unit.service";
import { CompanyService } from "../../_services/company.service";

@Component({
  selector: 'app-edit-organizational-unit-dialog',
  templateUrl: './edit-organizational-unit-dialog.component.html',
  styleUrls: ['./edit-organizational-unit-dialog.component.css']
})
export class EditOrganizationalUnitDialogComponent implements OnInit {
    @ViewChild(ErrorMessageComponent) errorMessage;

    faEdit = faEdit;
    faCancel = faBan;
    formGroup: FormGroup;
    submitted = false;
    organizationalUnitIconTitle = faSitemap;
    companies = [];

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<EditOrganizationalUnitDialogComponent>,
        private companiesService: CompanyService,
        private service: OrganizationalUnitService,
        @Inject(MAT_DIALOG_DATA) public dialogData
    ) { }

    ngOnInit() {
        this.formGroup = this.fb.group({
            name:        ['', [Validators.required]],
            code:        ['', [Validators.required]],
            description: ['', []],
            canReceiveSubjects: [true, [Validators.required]]
        });

        this.setData();
    }

    // convenience getter for easy access to form fields
    get form() { return this.formGroup.controls; }

    setData(){
        for (const key of Object.keys(this.dialogData)){
            if(this.form.hasOwnProperty(key)){
                this.formGroup.controls[key].setValue(this.dialogData[key]);
            }
        }
    }

    save(){
        this.submitted = true;

        Object.keys(this.formGroup.controls).forEach(field => { // {1}
            const control = this.formGroup.get(field);            // {2}
            control.markAsTouched({ onlySelf: true });       // {3}
        });

        if(this.formGroup.invalid){
            console.log('invalid formGroup');
            return 0;
        }

        let data = this.formGroup.value;
        data.id = this.dialogData.id;

        this.service.update(this.dialogData.id, data).subscribe(
            response => {
                console.log('update OrganizationalUnit');
                console.log(response);

                if( response.status ){
                    this.dialogRef.close(data);
                }
            },
            error => {
                console.log('error');
                console.log(error);
                this.errorMessage.setErrorMessage(error);
            }
        );
    }

}
