import { Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router} from "@angular/router";
import { ForgotPasswordService } from "../_services/forgot-password.service";
import { ErrorMessageComponent } from "../messages/error-message/error-message.component";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner";
import { NotifierComponent } from "../notifier/notifier.component";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  @ViewChild(ErrorMessageComponent) errorMessage;
  @ViewChild( NotifierComponent ) notifier;

  formGroup : FormGroup;
  submitted : boolean = false;
  disableButton : boolean = false;
  showSpinner : boolean = false;
  faSpinner = faSpinner;

  constructor(
      private activatedRoute : ActivatedRoute,
      private fb : FormBuilder,
      private forgotPasswordService : ForgotPasswordService,
      private router : Router
  ) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      password: new FormControl('', [Validators.required, Validators.minLength(4)]),
      password_confirmation: new FormControl('', [Validators.required, Validators.minLength(4)]),
    });
  }

  get token() {
    return this.activatedRoute.snapshot.paramMap.get('token');
  }

  get email() {
    return this.activatedRoute.snapshot.paramMap.get('email');
  }

  get form() {
    return this.formGroup.controls;
  }

  resetPassword() {
    this.submitted = true;

    Object.keys(this.formGroup.controls).forEach(field => { // {1}
      const control = this.formGroup.get(field);            // {2}
      control.markAsTouched({ onlySelf: true });       // {3}
    });

    // stop here if form is invalid
    if (this.formGroup.invalid) {
      if(this.form.password.value !== this.form.password_confirmation.value){

        this.form.password.setErrors({'passwordMatch': false});
        this.form.password_confirmation.setErrors({'passwordMatch': false});

        return;
      }

      return;
    }else{
      if(this.form.password.value !== this.form.password_confirmation.value){

        this.form.password.setErrors({'passwordMatch': false});
        this.form.password_confirmation.setErrors({'passwordMatch': false});

        return;
      }

    }

    let params = this.formGroup.value;

    params.token = this.token;
    params.email = this.email;

    this.disableButton = true;

    this.formGroup.disable();

    console.log(params);

    this.forgotPasswordService.resetPassword(params).subscribe(
        response => {

          if(response['status']) {
            this.showSuccessNotification(response['message']);
          } else {
            this.formGroup.enable();
            this.disableButton = false;
            this.errorMessage.setErrorMessage(response);
          }

        },
        error => {
          this.formGroup.enable();
          this.disableButton = false;

          this.errorMessage.setErrorMessage(error);
        }
    );

  }

  private async showSuccessNotification(message)
  {
    this.notifier.show({
      type: 'success',
      message: message
    });
    // Sleep thread for 3 seconds
    await this.delay(4000);

    this.redirectoToLogin();
  }

  private delay(ms: number)
  {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  redirectoToLogin() {
    this.router.navigate(['/panel/mailbox/inboxout/nuevo']);
  }

}
