import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, FormGroup, Validators} from "@angular/forms";
import { CompanyService } from "../../_services/company.service";
import { ErrorMessageComponent } from "../../messages/error-message/error-message.component";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons/faPlusCircle";
import { faBan } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-new-company-dialog',
  templateUrl: './new-company-dialog.component.html',
  styleUrls: ['./new-company-dialog.component.css']
})
export class NewCompanyDialogComponent implements OnInit {
    faPlus = faPlusCircle;
    faCancel = faBan;
    @ViewChild(ErrorMessageComponent) errorMessage;
    formGroup: FormGroup;
    submitted = false;

    constructor(
        private fb: FormBuilder,
        private companyService: CompanyService,
        public dialogRef: MatDialogRef<NewCompanyDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public dialogData
    ) { }

    ngOnInit() {
        this.formGroup = this.fb.group({
            name:        ['', [Validators.required]],
            business_key: ['', [Validators.required]],
            description: ['', []],
        });
    }

    public getSerializeFormData(){
        return this.formGroup.value;
    }

    // convenience getter for easy access to form fields
    get form() { return this.formGroup.controls; }

    save() {
        this.submitted = true;

        Object.keys(this.formGroup.controls).forEach(field => { // {1}
            const control = this.formGroup.get(field);            // {2}
            console.log(control);
            control.markAsTouched({ onlySelf: true });       // {3}
        });

        // stop here if form is invalid
        if (this.formGroup.invalid) {
            return;
        }

        let serialized = this.getSerializeFormData();

        this.companyService.add(serialized).subscribe(
            result => {
                console.log('new company response');
                console.log(result);

                if(result.status === true)
                    this.dialogRef.close(result);
                else
                    this.errorMessage.setErrorMessage(result);
            },
            error => {
                console.log('newCompany error response');
                console.log(error);
                this.errorMessage.setErrorMessage(error);
            }
        );

    }

    onSubmit() {

    }

}
