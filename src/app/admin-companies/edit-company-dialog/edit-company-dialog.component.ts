import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, FormGroup, Validators} from "@angular/forms";
import { CompanyService } from "../../_services/company.service";
import { ErrorMessageComponent } from "../../messages/error-message/error-message.component";
import { faEdit, faBan } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-edit-company-dialog',
  templateUrl: './edit-company-dialog.component.html',
  styleUrls: ['./edit-company-dialog.component.css']
})
export class EditCompanyDialogComponent implements OnInit {
    faEdit = faEdit;
    faCancel = faBan;
    formGroup: FormGroup;
    submitted = false;
    @ViewChild(ErrorMessageComponent) errorMessage;

  constructor(
      private fb: FormBuilder,
      private service: CompanyService,
      public dialogRef: MatDialogRef<EditCompanyDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public dialogData
  ) { }

  ngOnInit() {
      this.formGroup = this.fb.group({
          name:        ['', [Validators.required]],
          business_key: ['', [Validators.required]],
          description: ['', []],
      });

      this.setUserData();
  }

    public setUserData() {
        for (const key of Object.keys(this.dialogData)){
            if(this.form.hasOwnProperty(key)){
                this.formGroup.controls[key].setValue(this.dialogData[key]);
            }
        }
    }

    public getSerializedUserData(){
        return this.formGroup.value;
    }

    // convenience getter for easy access to form fields
    get form() { return this.formGroup.controls; }

    update() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.formGroup.invalid) {
            console.log('invalid formgroup');
            return;
        }

        let serialized = this.getSerializedUserData();

        let updateData = serialized;
        //concat idUser
        updateData.id = this.dialogData.id;

        this.service.update(this.dialogData.id, updateData).subscribe(result => {
                console.log('modify response');
                console.log(result);

                if(result.status === true){
                    result.company = updateData;
                    this.dialogRef.close(result);
                }
                else
                    this.errorMessage.message = result;
            },
            error => {
                console.log('error response');
                console.log(error);

                this.errorMessage.setErrorMessage(error);
            }
        );
    }

    onSubmit() {

    }

}
