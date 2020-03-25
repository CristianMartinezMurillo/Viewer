import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from "@angular/material";
import { FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { UsersService } from "../../_services/users.service";
import { ErrorMessageComponent } from "../../messages/error-message/error-message.component"
import { OrganizationalUnitTreeDialogComponent } from "../../organizational-unit-tree-dialog/organizational-unit-tree-dialog.component";
import { RolesService } from "../../_services/roles.service";
import { SystemUserRoleService } from "../../_services/systemUserRole.service";
import { CAT_SYSTEM_USER_ROLE } from "../../_constants/CatSystemUserRoleConstants";
import { CatSystemUserModel } from "../../_models/CatSystemUserModel";

@Component({
  selector: 'app-new-user-dialog-body',
  templateUrl: './new-user-dialog-body.component.html',
  styleUrls: ['./new-user-dialog-body.component.css']
})
export class NewUserDialogBodyComponent implements OnInit, AfterViewInit {
    @ViewChild(ErrorMessageComponent) errorMessage;
    newUserform: FormGroup;
    submitted = false;
    passwordMatch = false;
    roles;
    systemUserRoles: Array<CatSystemUserModel>;

  constructor(
      private fb: FormBuilder,
      private usersService: UsersService,
      public dialogRef: MatDialogRef<NewUserDialogBodyComponent>,
      @Inject(MAT_DIALOG_DATA) public userData,
      private dialog: MatDialog,
      private rolesService: RolesService,
      private systemUserRoleService: SystemUserRoleService
  ) { }

  ngOnInit() {
      this.newUserform = this.fb.group({
          name: new FormControl('', [Validators.required]),
          last_name: new FormControl('', [Validators.required]),
          mothers_last_name: new FormControl('', []),
          email: new FormControl('', [Validators.required, Validators.email]),
          organizational_unit_id: ['', [Validators.required]],
          organizational_unit: ['', [Validators.required]],
          role_id: ['', [Validators.required]],
          systemRole_id: ['', [Validators.required]],
          password: new FormControl('', [Validators.required, Validators.minLength(4)]),
          c_password: new FormControl('', [Validators.required, Validators.minLength(4)]),
      });

      this.fillRolesSelect();
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

  defaultUserRole() : number {
      if (this.systemUserRoles === undefined)
          return null;

      const role = this.systemUserRoles.find((role) => role.code === CAT_SYSTEM_USER_ROLE.USER);

      return role.id;
  }

    fillRolesSelect() {
        this.rolesService.getRoles().subscribe(
            response => {
                if(response['status']) {
                    this.roles = response['roles'];
                } else {
                    this.errorMessage.setErrorMessage(response);
                }
            },
            error => {
                this.errorMessage.setErrorMessage(error);
            }
        );
    }

  public getSerializedUserData(){
    return this.newUserform.value;
  }

    // convenience getter for easy access to form fields
    get form() { return this.newUserform.controls; }

    saveUser() {
        this.submitted = true;

        Object.keys(this.newUserform.controls).forEach(field => { // {1}
            const control = this.newUserform.get(field);            // {2}
            control.markAsTouched({ onlySelf: true });       // {3}
        });

        // stop here if form is invalid
        if (this.newUserform.invalid) {

            if(this.form.password.value !== this.form.c_password.value){
                this.form.password.setErrors({'passwordMatch': false});
                this.form.c_password.setErrors({'passwordMatch': false});
                console.log('invalid passowrd');
                return;
            }

            return;
        }else{
            if(this.form.password.value !== this.form.c_password.value){
                this.form.password.setErrors({'passwordMatch': false});
                this.form.c_password.setErrors({'passwordMatch': false});
                console.log('invalid passowrd');
                return;
            }
        }

        let serialized = this.getSerializedUserData();

        this.usersService.newUser(serialized).subscribe(success => {
            this.dialogRef.close( success.user);
            },
            error => {
            console.log('newUser error response');
            console.log(error);
            this.errorMessage.setErrorMessage(error);
        });

    }

    openOrganizationalUnit() {
        let dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {};
        dialogConfig.width = '600px';
        // dialogConfig.height = '600px';
        // dialogConfig.panelClass = 'dialog-confirmation-class';

        const dialog = this.dialog.open(OrganizationalUnitTreeDialogComponent, dialogConfig);

        dialog.afterClosed().subscribe(callbackData => {
            console.log(callbackData);
            if (Object.keys(callbackData).length > 0) {
                this.form.organizational_unit_id.setValue(callbackData.data.id)
                this.form.organizational_unit.setValue(callbackData.data.name)
            }
        });
    }

    onSubmit() {

    }

    ngAfterViewInit() {

    }

}
