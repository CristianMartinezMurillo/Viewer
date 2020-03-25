import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ForgotPasswordService } from "../_services/forgot-password.service";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { ErrorMessageComponent } from "../messages/error-message/error-message.component";
import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  @ViewChild(ErrorMessageComponent) errorMessage;

  formGroup : FormGroup;
  submitted : boolean = false;
  faLogin = faSignInAlt;
  message : string = null;
  disableButton : boolean = false;
  showSpinner : boolean = false;
  faSpinner = faSpinner;

  constructor(
      private fb : FormBuilder,
      private forgotPasswordService : ForgotPasswordService
  ) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  sendEmail() {
    Object.keys(this.form).forEach(field => { // {1}
      const control = this.formGroup.get(field);            // {2}
      control.markAsTouched({ onlySelf: true });       // {3}
    });

    // stop here if form is invalid
    if (this.formGroup.invalid) {
      return;
    }

    let params = this.formGroup.value;

    this.formGroup.disable();
    this.disableButton = true;
    this.showSpinner = true;

    this.forgotPasswordService.sendMail(params).subscribe(
        response => {
          this.showSpinner = false;
            if(response['status']) {
              this.message = response['message'];

            } else {
              this.disableButton = false;
              this.formGroup.enable();
              this.errorMessage.setErrorMessage(response);

            }
        },
        error => {
          console.error(error);

          this.showSpinner = false;

          this.disableButton = false;

          this.formGroup.enable();

          this.errorMessage.setErrorMessage(error);
        }
    );
  }

  get form() {
    return this.formGroup.controls;
  }
}
