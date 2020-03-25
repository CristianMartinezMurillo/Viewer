import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, FormGroup, Validators} from "@angular/forms";
import { ErrorMessageComponent } from "../../messages/error-message/error-message.component"
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons/faPlusCircle";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import { OrganizationalUnitService } from "../../_services/organizational-unit.service";
import { faSitemap } from '@fortawesome/free-solid-svg-icons';
import { CompanyService } from "../../_services/company.service";
import { isNullOrUndefined } from "util";

const ORGANIZATIONAL_UNIT_NODE = "organizationalUnit";
const COMPANY_NODE = "company";

@Component({
  selector: 'app-new-organizational-unit-dialog',
  templateUrl: './new-organizational-unit-dialog.component.html',
  styleUrls: ['./new-organizational-unit-dialog.component.css']
})
export class NewOrganizationalUnitDialogComponent implements OnInit {
    @ViewChild(ErrorMessageComponent) errorMessage;

    organizationalUnitIconTitle = faSitemap;
    faPlus = faPlusCircle;
    faCancel = faBan;
    formGroup: FormGroup;
    submitted = false;
    companies = [];

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<NewOrganizationalUnitDialogComponent>,
        private service: OrganizationalUnitService,
        private companiesService: CompanyService,
        @Inject(MAT_DIALOG_DATA) public dialogData
    ) { }

    ngOnInit() {
        this.formGroup = this.fb.group({
            name:        ['', [Validators.required]],
            code:        ['', [Validators.required]],
            description: ['', []],
            canReceiveSubjects: [true, [Validators.required]]
        });

        this.companiesService.get().subscribe(
            response => {
                if(response.status){
                    this.companies = response.companiesNProcess;
                }else{
                    this.errorMessage.setErrorMessage(response);
                }
            },
            error => {
                console.log(error);
                this.errorMessage.setErrorMessage(error);
            }
        );
    }

    // convenience getter for easy access to form fields
    get form() { return this.formGroup.controls; }

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

        data.parent_id = this.getParentId();
        data.company_id = this.getCompanyId();
        data.level = this.dialogData.level + 1;

        this.service.add(data).subscribe(
            response => {
                console.log('new OrganizationalUnit');
                console.log(response);

                if( response.status ){
                    this.dialogRef.close(response);
                }
            },
            error => {
                console.log('error');
                console.log(error);
                this.errorMessage.setErrorMessage(error);
            }
        );
    }

    getParentId(){
        return (!isNullOrUndefined(this.dialogData.nodeType) && this.dialogData.nodeType === COMPANY_NODE) ? 0 : this.dialogData.id;
    }

    getCompanyId(){
        return (!isNullOrUndefined(this.dialogData.nodeType) && this.dialogData.nodeType === COMPANY_NODE) ?  this.dialogData.company_id : this.dialogData.company_id ;
    }

    onSubmit() {

    }

}
