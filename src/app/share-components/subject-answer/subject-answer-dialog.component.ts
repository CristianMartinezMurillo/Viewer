import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ErrorMessageComponent } from "../../messages/error-message/error-message.component";
import { UsersService } from "../../_services/users.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { faBan, faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { UploadFileComponent } from "../upload-file/upload-file.component";
import { SubjectService } from "../../_services/subject.service";
import { faReply } from "@fortawesome/free-solid-svg-icons/faReply";
import { Store } from "@ngrx/store";
import * as NewSubjectReducer from '../../_store/reducers/new-subject.reducer';
import * as MailboxSelector from '../../_store/selectors/mailbox.selector';
import { take } from "rxjs/operators";
import { SubjectRequestModel } from "../../_models/SubjectRequest.model";
import { RecipientModel } from "../../_models/new-subject.model";
import { AddresseeModel } from "../../_models/addresseeModel";
import * as SubjectActions from "../../_store/actions/subject.actions";
import * as SubjectReducer from "../../_store/reducers/subject.reducer";

@Component({
  selector: 'app-subject-answer-dialog',
  templateUrl: './subject-answer-dialog.component.html',
  styleUrls: ['./subject-answer-dialog.component.css']
})
export class SubjectAnswerDialogComponent implements OnInit {
  @ViewChild( ErrorMessageComponent ) errorMessage;
  @ViewChild( UploadFileComponent ) uploadFiles;

  title: string;

  faAttachment = faPaperclip;
  faCancel = faBan;
  faAnswer = faReply;

  submitted = false;
  formGroup: FormGroup;
  currentOrganizationalUnitId: number;

  constructor(
      private fb: FormBuilder,
      private subjectService: SubjectService,
      private userService: UsersService,
      public dialogRef: MatDialogRef<SubjectAnswerDialogComponent>,
      private store$: Store<NewSubjectReducer.State>,
      private subject$: Store<SubjectReducer.State>,
      @Inject(MAT_DIALOG_DATA) public subjectRequest: SubjectRequestModel
  ) {
    this.title = 'Responder al asunto "' + this.subjectRequest.title + '"';
  }

  ngOnInit() {
    console.log(this.subjectRequest);
    this.formGroup = this.fb.group({
      answer: ['', [Validators.required]],
    });

    this.store$.select(MailboxSelector.getCurrentOrganizationalUnitId).pipe(take(1)).subscribe(organizationalUnitId => {
      this.currentOrganizationalUnitId = organizationalUnitId;
    });
  }

  get form(){ return this.formGroup.controls; }

  addAnswer(recipient: AddresseeModel){
    console.log(recipient);
    this.submitted = true;

    Object.keys(this.formGroup.controls).forEach(field => { // {1}
      const control = this.formGroup.get(field);            // {2}
      control.markAsTouched({ onlySelf: true });       // {3}
    });

    // stop here if form is invalid
    if (this.formGroup.invalid) {
      return;
    }

    let attachments = this.getFilesAttached();

    let answerParams = {
      answer: this.form.answer.value,
      subjectRequest_id: this.subjectRequest.id,
      user_id: this.userService.userData.id,
      organizationalUnitId: this.currentOrganizationalUnitId,
      // recipientId: (this.subjectRequest.destinatario !== null) ? this.subjectRequest.destinatario.id : null,
    };

    attachments.append('answer', JSON.stringify(answerParams));

    this.subjectService.addAnswer(attachments, recipient.id).subscribe(
        response => {
          if(response['status']){
            /**
             * answer returned from server
             *
             * answer = {
             *     answer: "answer description",
             *     user {
             *         id:
             *         name:
             *         last_name,
             *
             *     },
             *     documents: {
             *
             *     }
             * }
             */
            this.subject$.dispatch(new SubjectActions.AddSubjectAnswer(response['answer']));
            this.dialogRef.close( response['answer'] );
          }else{
            this.errorMessage.setErrorMessage(response);
          }
        },
        error => {
          console.error(error);
          this.errorMessage.setErrorMessage(error);
        }
    );

  }

  attachDocuments(){
    this.uploadFiles.openAddFilesDialog();
  }

  getFilesAttached(){
    return this.uploadFiles.getFilesForm();
  }


}
