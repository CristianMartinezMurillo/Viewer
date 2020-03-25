import { Component, OnInit, ViewChild } from '@angular/core';
import { faUserSecret } from "@fortawesome/free-solid-svg-icons/faUserSecret";
import { UsersService } from "../../_services/users.service";
import { MatHorizontalStepper } from "@angular/material";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthClass } from "../../auth/Auth.class";
import { LocalstorageService } from "../../_services/Localstorage.service";
import { Router } from "@angular/router";
import { NotifierService } from "angular-notifier";

@Component({
  selector: 'app-user-reset-password',
  templateUrl: './user-reset-password.component.html',
  styleUrls: ['./user-reset-password.component.css']
})
export class UserResetPasswordComponent implements OnInit {
  @ViewChild('stepper') stepperComponent : MatHorizontalStepper;

  formGroup : FormGroup;
  titleIcon = faUserSecret;
  validPassword : Boolean = false;
  submitted : Boolean = false;
  incorrectPassword : Boolean = false;
  disableButton: boolean = false;
  passwordMatch: boolean = false;

  newPasswordForm : FormGroup;
  showTimer : boolean = false;

  /** timer */
  timeLeft: number = 5;
  interval;

  constructor(
      private auth: AuthClass,
      private localStorage: LocalstorageService,
      private router: Router,
      private userService : UsersService,
      private fb : FormBuilder,
      private notifier : NotifierService
  ) {
    this.formGroup = this.fb.group({
      password: new FormControl('', [Validators.required, Validators.minLength(4)]),
    });

    this.newPasswordForm = this.fb.group({
        password: new FormControl('', [Validators.required, Validators.minLength(4)]),
        password_confirmation: new FormControl('', [Validators.required, Validators.minLength(4)]),
    });
  }

  ngOnInit() {
  }

  get form() {
    return this.formGroup.controls;
  }

  get formNewPassword() {
    return this.newPasswordForm.controls;
  }

  validateCurrentPassword()  {
    this.submitted = true;

    Object.keys(this.form).forEach(field => { // {1}
      const control = this.formGroup.get(field);            // {2}
      control.markAsTouched({ onlySelf: true });       // {3}
    });

    if(this.formGroup.invalid)
      return 0;

    this.validPassword = false;
    this.disableButton = true;

    let params = {
      password: this.formGroup.get("password").value
    };

    this.userService.checkPassword(params).subscribe(
        response => {
          console.log(response)

          this.disableButton = false;

          if( response['status'] === true ) {
              console.log("success");
            this.validPassword = true;
            this.incorrectPassword = false;
            this.stepperComponent.next();
          } else {
            this.validPassword = false;
            this.incorrectPassword = true;
          }
        },
        error => {
          this.disableButton = false;

          if(error.status === 300) {
            this.logout();
          } else {
            console.log(error);
          }
        }
    );
  }

  logout() {
    this.auth.logout().subscribe(
        response => {
          if (response.status){
            this.localStorage.clearSessionStorage();
            this.router.navigate(["/login"]);
          }
        },
        error => {
          console.error(error);
        }
    );
  }

  changePassword() {
    Object.keys(this.formNewPassword).forEach(field => { // {1}
      const control = this.newPasswordForm.get(field);            // {2}
      control.markAsTouched({ onlySelf: true });       // {3}
    });

    // stop here if form is invalid
    if (this.newPasswordForm.invalid) {
      if(this.formNewPassword.password.value !== this.formNewPassword.password_confirmation.value){
        this.formNewPassword.password.setErrors({'passwordMatch': false});
        this.formNewPassword.password_confirmation.setErrors({'passwordMatch': false});
        return;
      }

      return;
    }else{
      if(this.formNewPassword.password.value !== this.formNewPassword.password_confirmation.value){
        this.formNewPassword.password.setErrors({'passwordMatch': false});
        this.formNewPassword.password_confirmation.setErrors({'passwordMatch': false});
        return;
      }
    }

    let params = this.newPasswordForm.value;

    this.userService.changePassword(params).subscribe(
        response => {
          if(response['status']) {
            this.showSuccessMessage();

          } else {

          }
        },
        error => {
          console.error(error);
        }
    );
  }

  async showSuccessMessage() {
    this.notifier.show({
      type: 'success',
      message: 'Contraseña actualizada correctamente. Por favor vuelva a inicia sesión.'
    });

    this.showTimer = true;

    this.startTimer();

    await this.delay(5000);

    this.logout();
  }

  private delay(ms: number)
  {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  startTimer() {
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.interval);
      }
    },1000)
  }

}
