import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ErrorMessageComponent } from "../../messages/error-message/error-message.component";
import { UsersService } from "../../_services/users.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { faBan, faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { UploadFileComponent } from "../upload-file/upload-file.component";
import { TaskService } from "../../_services/task.service";

@Component({
  selector: 'app-task-answer-dialog',
  templateUrl: './task-answer-dialog.component.html',
  styleUrls: ['./task-answer-dialog.component.css']
})
export class TaskAnswerDialogComponent implements OnInit {
  @ViewChild( ErrorMessageComponent ) errorMessage;
  @ViewChild( UploadFileComponent ) uploadFiles;

  faAttachment = faPaperclip;
  faCancel = faBan;

  users;
  submitted = false;
  formGroup: FormGroup;

  constructor(
      private fb: FormBuilder,
      private taskService: TaskService,
      public dialogRef: MatDialogRef<TaskAnswerDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public task
  ) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      answer: ['', [Validators.required]],
    });
  }

  get form(){ return this.formGroup.controls; }

  addAnswer(){
    this.submitted = true;

    Object.keys(this.formGroup.controls).forEach(field => { // {1}
      const control = this.formGroup.get(field);            // {2}
      control.markAsTouched({ onlySelf: true });       // {3}
    });

    // stop here if form is invalid
    if (this.formGroup.invalid) {
      return;
    }

    let answerText = this.formGroup.value;

    let attachments = this.getFilesAttached();

    let answerParams = {
      answer: this.form.answer.value,
      task_id: this.task.id
    };

    attachments.append('answer', JSON.stringify(answerParams));

    this.taskService.addAnswer(attachments).subscribe(
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
