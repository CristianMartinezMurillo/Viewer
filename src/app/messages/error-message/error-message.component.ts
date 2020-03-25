import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import {isNullOrUndefined} from "util";
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.css']
})
export class ErrorMessageComponent implements OnInit {
    hideErrors = false;
    faEyeSlash = faEyeSlash;
  @Input() message;
  errorValidationParams = [];
  constructor() { }

  ngOnInit() {

  }

  clearErrorMessage(){
      this.hideErrors = true;
      this.message = [];
  }

  setErrorMessage(errorMessage) {
      this.hideErrors = false;
      this.message = errorMessage;
      this.errorValidationParams = [];

      if (errorMessage.hasOwnProperty('error') && errorMessage.error.hasOwnProperty('validations')){
          for (let key in errorMessage.error.validations) {
            let validation = errorMessage.error.validations[key];

            for (let rules in validation) {
                this.errorValidationParams.push(validation[rules]);
            }
          }
      }

      if(!isNullOrUndefined(errorMessage.status)){

      }

  }

  hide(){
        this.hideErrors = true;
  }

}
