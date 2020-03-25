import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import {ErrorMessageComponent} from "../../messages/error-message/error-message.component";
import {UsersService} from "../../_services/users.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-members-dialog',
  templateUrl: './members-dialog.component.html',
  styleUrls: ['./members-dialog.component.css']
})
export class MembersDialogComponent implements OnInit {
  @ViewChild( ErrorMessageComponent ) errorMessage;

  users;
  submitted = false;
  formGroup: FormGroup;

  constructor(
      private fb: FormBuilder,
      private userService: UsersService,
      public dialogRef: MatDialogRef<MembersDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public dialogData
  ) { }

  ngOnInit() {
      this.formGroup = this.fb.group({
          memberSelect: ['', [Validators.required]],
      });

      this.users = this.dialogData.users;
  }

  getUsers(){
    // this.userService.getOperadoresByUnidadOrganizacional().subscribe(
    //     response => {
    //       if(response["status"]){
    //         this.users = response["users"];
    //       }else{
    //         this.errorMessage.setErrorMessage(response);
    //       }
    //     },
    //     error => {
    //         console.error(error);
    //         this.errorMessage.setErrorMessage(error);
    //     }
    // );
  }

  selectUser(){
      this.submitted = true;

      Object.keys(this.formGroup.controls).forEach(field => { // {1}
          const control = this.formGroup.get(field);            // {2}
          control.markAsTouched({ onlySelf: true });       // {3}
      });

      // stop here if form is invalid
      if (this.formGroup.invalid) {
          return;
      }

      let user = this.form.memberSelect.value;

      this.dialogRef.close(user);
  }

    get form() { return this.formGroup.controls; }


}
