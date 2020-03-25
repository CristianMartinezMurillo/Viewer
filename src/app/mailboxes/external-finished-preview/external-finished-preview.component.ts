import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ErrorMessageComponent } from "../../messages/error-message/error-message.component";
import { DynamicFormComponent } from "../../components/dynamic-form/dynamic-form.component";
import { NotifierComponent } from "../../notifier/notifier.component";
import { Subject } from "rxjs";
import { faReply } from "@fortawesome/free-solid-svg-icons/faReply";
import { faBan, faReplyAll } from "@fortawesome/free-solid-svg-icons";
import { faCalendarCheck } from "@fortawesome/free-solid-svg-icons/faCalendarCheck";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons/faCheckCircle";
import { FieldConfig } from "../../_models/field.interface";
import { SubjectRequestModel } from "../../_models/SubjectRequest.model";
import { SubjectRequestService } from "../../_services/subject-request.service";
import { ProcessService } from "../../_services/process.service";
import { ActivatedRoute } from "@angular/router";
import { DynamicFormBuilder } from "../../components/DynamicFormBuilder";
import { UsersService } from "../../_services/users.service";
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material";
import { SubjectService } from "../../_services/subject.service";
import { Store } from "@ngrx/store";
import * as MailboxReducer from "../../_store/reducers/mailbox.reducer";
import * as SubjectReducer from "../../_store/reducers/subject.reducer";
import * as MailboxSelector from "../../_store/selectors/mailbox.selector";
import { filter, takeUntil } from "rxjs/operators";
import * as SubjectActions from "../../_store/actions/subject.actions";
import { isNullOrUndefined, isObject } from "util";
import { SubjectAnswerDialogComponent } from "../../share-components/subject-answer/subject-answer-dialog.component";
import { WarningConfirmationDialogComponent } from "../../dialog/warning-confirmation-dialog/warning-confirmation-dialog.component";
import { AvanzarDialogComponent } from "../../share-components/avanzar/avanzar-dialog.component";

@Component({
  selector: 'app-external-finished-preview',
  templateUrl: './external-finished-preview.component.html',
  styleUrls: ['./external-finished-preview.component.css']
})
export class ExternalFinishedPreviewComponent implements OnInit {
  @ViewChild( ErrorMessageComponent ) errorMessage;
  @ViewChild( DynamicFormComponent ) form: DynamicFormComponent;
  @ViewChild( NotifierComponent ) notifier;

  destroy: Subject<void> = new Subject();
  faAnswer = faReply;
  faCancel = faBan;
  faFinish = faCalendarCheck;
  faResolver = faCheckCircle;
  faTurnar = faReplyAll;

  formConfig: FieldConfig[] = [];

  subjectRequest: SubjectRequestModel;
  // tasks;
  organizationalUnitId: number = null;

  constructor(
      private subjectRequestService: SubjectRequestService,
      private processService: ProcessService,
      private activatedRoute: ActivatedRoute,
      private formBuilder: DynamicFormBuilder,
      public userService: UsersService,
      private dialog: MatDialog,
      public dialogRef: MatDialogRef<ExternalFinishedPreviewComponent>,
      private subjectService: SubjectService,
      private store$: Store<MailboxReducer.State>,
      private subject$: Store<SubjectReducer.State>,
      @Inject(MAT_DIALOG_DATA) public dialogData
  ) {
  }

  ngOnInit() {
    this.store$.select(MailboxSelector.getCurrentOrganizationalUnitId)
        .pipe((takeUntil(this.destroy)),
            filter(response => response !== null && response > 0))
        .subscribe(
            response => {
              this.organizationalUnitId = response;
              this.destroy.next();
            }
        )

    this.buildSubjectForm();
  }

  buildSubjectForm(){
    const addresseeId = this.dialogData.id;
    this.subject$.dispatch(new SubjectActions.ClearSubject());

    this.subjectRequestService.getExternalSubjectRequest(addresseeId).subscribe(
        response => {
          if(response.status){
            this.subjectRequest = response.subject;
            this.subject$.dispatch(new SubjectActions.StoreCurrentSubject(response.subject));
            this.mapFieldsAndBuildForm();
            // this.setTasks();
          }else{
            this.errorMessage.setErrorMessage(response);
          }
        },
        error => {
          console.error(error);
        }
    );
  }

  // setTasks(){
  //   if(isObject(this.subjectRequest.destinatario) && this.subjectRequest.destinatario.hasOwnProperty('organizationalUnitTasks')) {
  //     this.tasks = this.subjectRequest.destinatario.organizationalUnitTasks;
  //   }
  //
  //   if(isObject(this.subjectRequest.destinatario) && this.subjectRequest.destinatario.hasOwnProperty('userTasks')) {
  //     this.tasks = this.subjectRequest.destinatario.userTasks;
  //   }
  // }


  mapFieldsAndBuildForm(){
    let metadata = [];
    let metadataValue = this.subjectRequest.metadataValue;

    this.subjectRequest.process.metadata.forEach(function(field, index){
      let metadataFieldValue = metadataValue.find(metadataValueField => metadataValueField.metadata_id === field.id);

      if(isNullOrUndefined(metadataFieldValue))
        return;

      field = {...field, value: metadataFieldValue.value};
      metadata.push(field);
    });

    this.formConfig.splice(0,this.formConfig.length)

    this.formConfig = this.formBuilder.buildForm(this.formConfig, metadata);

    // this.formConfig.push(this.buttonConfig());

    this.form.createControls();
  }

  openSubjectAnswerDialog(){
    let dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = this.subjectRequest;
    dialogConfig.maxWidth = '1000px';
    dialogConfig.width = '800px';
    // dialogConfig.maxHeight = '700px';
    // dialogConfig.panelClass = 'dialog-confirmation-class';

    const dialog = this.dialog.open(SubjectAnswerDialogComponent, dialogConfig);

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

    dialog.afterClosed().subscribe(answer => {
      // if (isObject(answer)) {
      //
      //   if(isNullOrUndefined(this.subjectRequest.answers))
      //     this.subjectRequest.answers = [];
      //
      //   let answers = Object.assign([], this.subjectRequest.answers);
      //   answers.push(answer);
      //
      //   this.subjectRequest = {...this.subjectRequest, answers: answers};
      //
      // }
    });

  }

  isTitular(){
    return this.userService.isTitular(this.organizationalUnitId);
  }

}
