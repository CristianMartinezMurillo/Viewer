import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { UsersService } from "../_services/users.service";
import { ErrorMessageComponent } from "../messages/error-message/error-message.component";
import { Router } from "@angular/router";
import { OrganizationalUnitService } from "../_services/organizational-unit.service";
import { NotifierComponent } from "../notifier/notifier.component";
import { RolesService } from "../_services/roles.service";
import { MatDialog, MatDialogConfig } from "@angular/material";
import { isObject} from "util";
import { OrganizationalUnitTreeDialogComponent } from "../organizational-unit-tree-dialog/organizational-unit-tree-dialog.component";

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {
  @ViewChild( ErrorMessageComponent ) errorMessage;
  @ViewChild( NotifierComponent ) notifier;
  formGroup : FormGroup;
  submitted : boolean = false;
  organizationalUnit : any;
  roles : any;
  passwordMatch : boolean = false;
  disableButtonRegister = false;

  constructor(
      private fb : FormBuilder,
      private userService: UsersService,
      private router: Router,
      private rolesService : RolesService,
      private dialog: MatDialog,

  ) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      name: ['', [Validators.required]],
      organizational_unit_id: ['', [Validators.required]],
      organizational_unit: ['', [Validators.required]],
      role_id: ['', [Validators.required]],
      last_name: new FormControl('', [Validators.required]),
      mothers_last_name: new FormControl('', []),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(4)]),
      c_password: new FormControl('', [Validators.required, Validators.minLength(4)]),
      sendNotificationToAdmin: new FormControl(true, []),
    });

    this.fillRolesSelect();
  }

  get form() {
    return this.formGroup.controls;
  }

  saveUser() {
    this.submitted = true;

    Object.keys(this.formGroup.controls).forEach(field => { // {1}
      const control = this.formGroup.get(field);            // {2}
      control.markAsTouched({ onlySelf: true });       // {3}
    });

    // stop here if form is invalid
    if (this.formGroup.invalid) {
      if(this.form.password.value !== this.form.c_password.value){
        this.form.password.setErrors({'passwordMatch': false});
        this.form.c_password.setErrors({'passwordMatch': false});
        return;
      }

      return;
    }else{
      if(this.form.password.value !== this.form.c_password.value){
        this.form.password.setErrors({'passwordMatch': false});
        this.form.c_password.setErrors({'passwordMatch': false});
        return;
      }
    }

    this._disableButtonRegister();

    let params = this.formGroup.value;

    delete params['organizational_unit'];

    this.userService.signUp(params).subscribe(
        response => {
          if(response['status']) {
            this.disableForm();
            this.showSuccessNotification();
          } else {
            this.enableButtonRegister();
            this.errorMessage.setErrorMessage(response);
          }
        },
        error => {
          this.enableButtonRegister();
          this.errorMessage.setErrorMessage(error);
        }
    );
  }

  private async showSuccessNotification()
  {
    this.notifier.show({
      type: 'success',
      message: 'Te has registrado correctamente. Por favor inicia sesión.'
    });
    // Sleep thread for 3 seconds
    await this.delay(5000);

    this.redirectToLogin();
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

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

  enableButtonRegister() {
    this.disableButtonRegister = false;
  }

  _disableButtonRegister() {
    this.disableButtonRegister = true;
  }

  private delay(ms: number)
  {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  disableForm() {
    this.formGroup.disable();
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
      if(isObject(callbackData)){
          this.form.organizational_unit_id.setValue(callbackData.data.id)
          this.form.organizational_unit.setValue(callbackData.data.name)
      }
    });
  }
}
