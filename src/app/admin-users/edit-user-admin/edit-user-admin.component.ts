import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from "@angular/material";
import { FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { UsersService } from "../../_services/users.service";
import { ErrorMessageComponent } from "../../messages/error-message/error-message.component"
import { OrganizationalUnitTreeDialogComponent } from "../../organizational-unit-tree-dialog/organizational-unit-tree-dialog.component";
import { isObject } from "util";
import { CatSystemUserModel } from "../../_models/CatSystemUserModel";
import { SystemUserRoleService } from "../../_services/systemUserRole.service";

@Component({
  selector: 'app-edit-user-admin',
  templateUrl: './edit-user-admin.component.html',
  styleUrls: ['./edit-user-admin.component.css']
})
export class EditUserAdminComponent implements OnInit {
    @ViewChild(ErrorMessageComponent) errorMessage;

    newUserform: FormGroup;
    submitted = false;
    userData;
    roles;
    systemUserRoles: Array<CatSystemUserModel>;

    constructor(
        private fb: FormBuilder,
        private usersService: UsersService,
        public dialogRef: MatDialogRef<EditUserAdminComponent>,
        private dialog: MatDialog,
        private systemUserRoleService: SystemUserRoleService,
        @Inject(MAT_DIALOG_DATA) public dialogData
    ) {
        this.userData = this.dialogData.user;
        this.roles = this.dialogData.roles;
    }

    ngOnInit() {
        this.newUserform = this.fb.group({
            name: new FormControl('', [Validators.required]),
            last_name: new FormControl('', [Validators.required]),
            mothers_last_name: new FormControl('', []),
            // organizational_unit_id: ['', [Validators.required]],
            // organizational_unit: ['', [Validators.required]],
            email: new FormControl({value: '', disabled:true}, [Validators.required, Validators.email]),
            // role_id: new FormControl({value: ''}, [Validators.required]),
            systemRole_id: [{disabled: (this.usersService.isRoot() || this.usersService.isAdmin())}, [Validators.required]],
        });

        this.setUserData();
        this.getSystemUserRoles();
    }

    getSystemUserRoles() {
        this.systemUserRoleService.get().subscribe(
            response => {
                if (response['status']) {
                    this.systemUserRoles = response['systemRoles'];
                } else {
                    this.errorMessage.setErrorMessage(response);
                }
            }, error => {
                console.error(error);
                this.errorMessage.setErrorMessage(error);
            }
        );
    }

    public setUserData() {
        for (const key of Object.keys(this.userData)){
            if(this.form.hasOwnProperty(key)){
                this.newUserform.controls[key].setValue(this.userData[key]);
            }
        }
    }

    public getSerializedUserData(){
        return this.newUserform.value;
    }

    // convenience getter for easy access to form fields
    get form() { return this.newUserform.controls; }

    saveUser() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.newUserform.invalid) {
            return;
        }

        let serialized = this.getSerializedUserData();

        let modifiedUser = serialized;

        delete modifiedUser.organizational_unit;

        this.userData = {...this.userData, ...modifiedUser};

        this.usersService.updateUser(this.userData.id, modifiedUser).subscribe(success => {
                console.log('modify user response');
                console.log(success);
                this.dialogRef.close(this.userData);
            },
            error => {
                console.log('modifyUser error response');
                console.log(error);

                this.errorMessage.message = error;
            }
        );
    }

    onSubmit() {

    }

}
