import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ErrorMessageComponent } from "../../messages/error-message/error-message.component";
import { DynamicFormComponent }  from "../../components/dynamic-form/dynamic-form.component";
import { NotifierComponent } from "../../notifier/notifier.component";
import { faReply } from "@fortawesome/free-solid-svg-icons/faReply";
import { faBan, faReplyAll } from "@fortawesome/free-solid-svg-icons";
import { faCalendarCheck } from "@fortawesome/free-solid-svg-icons/faCalendarCheck";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons/faCheckCircle";
import { FieldConfig } from "../../_models/field.interface";
import { SubjectRequestService } from "../../_services/subject-request.service";
import { ProcessService } from "../../_services/process.service";
import { ActivatedRoute } from "@angular/router";
import { DynamicFormBuilder } from "../../components/DynamicFormBuilder";
import { UsersService } from "../../_services/users.service";
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material";
import { SubjectService } from "../../_services/subject.service";
import { isNullOrUndefined, isObject } from "util";
import { SubjectAnswerDialogComponent } from "../../share-components/subject-answer/subject-answer-dialog.component";
import { WarningConfirmationDialogComponent } from "../../dialog/warning-confirmation-dialog/warning-confirmation-dialog.component";
import { SubjectPreview } from "../SubjectPreview";
import { Store } from "@ngrx/store";
import * as SubjectReducer from "../../_store/reducers/subject.reducer";
import * as SubjectActions from "../../_store/actions/subject.actions";
import * as MailboxReducer from "../../_store/reducers/mailbox.reducer";
import * as MailboxSelector from "../../_store/selectors/mailbox.selector";
import { filter, takeUntil } from "rxjs/operators";
import {Observable, Subject, Subscription} from "rxjs";
import { SubjectRequestModel } from "../../_models/SubjectRequest.model";
import { AvanzarDialogComponent } from "../../share-components/avanzar/avanzar-dialog.component";
import { NUEVO } from "../../_constants/SubjectStatus.constants";
import * as SubjectSelector from '../../_store/selectors/subject.selector';

@Component({
  selector: 'app-external-preview-dialog',
  templateUrl: './external-preview-dialog.component.html',
  styleUrls: ['./external-preview-dialog.component.css']
})
export class ExternalPreviewDialogComponent extends SubjectPreview implements OnInit {
  @ViewChild( ErrorMessageComponent ) errorMessage;
  @ViewChild( DynamicFormComponent ) form: DynamicFormComponent;
  @ViewChild( NotifierComponent ) notifier;

  subjectSubscription:  Subject<void> = new Subject();

  destroy: Subject<void> = new Subject();
  faAnswer = faReply;
  faCancel = faBan;
  faFinish = faCalendarCheck;
  faResolver = faCheckCircle;
  faTurnar = faReplyAll;

  formConfig: FieldConfig[] = [];

  subjectRequest: SubjectRequestModel;
  tasks;
  organizationalUnitId: number = null;
  canRejectSubjectStatus = false;

  constructor(
      private subjectRequestService: SubjectRequestService,
      private processService: ProcessService,
      private activatedRoute: ActivatedRoute,
      private formBuilder: DynamicFormBuilder,
      public userService: UsersService,
      private dialog: MatDialog,
      public dialogRef: MatDialogRef<ExternalPreviewDialogComponent>,
      private subjectService: SubjectService,
      private store$: Store<MailboxReducer.State>,
      private subject$: Store<SubjectReducer.State>,
      @Inject(MAT_DIALOG_DATA) public dialogData
  ) {
    super();
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

    this.canRejectSubject();
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
      if (isObject(answer)) {
      }
    });

  }

  isTitular(){
    return this.userService.isTitular(this.organizationalUnitId);
  }

  finalizarAsunto() {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {title: 'Finalizar Asunto', textContent: 'Esta a punto de finalizar el asunto ¿Desea continuar?'};
    dialogConfig.maxWidth = '300px';
    dialogConfig.panelClass = 'dialog-confirmation-class';

    const dialog = this.dialog.open(WarningConfirmationDialogComponent, dialogConfig);

    dialog.afterClosed().subscribe(userConfirmation => {
      if (!isNullOrUndefined(userConfirmation) && userConfirmation.confirmation) {
        this.subjectService.finalizarAsunto(this.subjectRequest.id).subscribe(
            response => {
              if(response['status']) {
                this.dialogRef.close({
                  'action': 'asuntoFinalizado',
                });
              } else {
                this.errorMessage.setErrorMessage(response);
              }
            },
            error => {
              this.errorMessage.setErrorMessage(error);
            }
        );
      }
    });

  }

  avanzar() {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { subjectRequest: this.subjectRequest, organizationalUnitId: this.organizationalUnitId };
    dialogConfig.maxWidth = '800px';
    dialogConfig.width = '800px';
    // dialogConfig.panelClass = 'dialog-confirmation-class';

    const dialog = this.dialog.open(AvanzarDialogComponent, dialogConfig);

    dialog.afterClosed().subscribe(result => {
      if(isObject(result)) {
        this.notifier.show({
          message: "Asunto avanzado",
          type: "success"
        });
      }
    });
  }

  private canFinishSubject(subjectRequest: SubjectRequestModel): boolean {
    if (subjectRequest === undefined)
      return false;

    return subjectRequest.status.code === NUEVO && subjectRequest.user_id === this.userService.userData.id;
  }

  marcarResuelto(recipient) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {title: 'Confirmación', textContent: '¿Desea marcar como Resuelto el asunto?'};
    dialogConfig.maxWidth = '300px';
    dialogConfig.panelClass = 'dialog-confirmation-class';

    const dialog = this.dialog.open(WarningConfirmationDialogComponent, dialogConfig);

    let status = 1;

    dialog.afterClosed().subscribe(userConfirmation => {
      if (!isNullOrUndefined(userConfirmation) && userConfirmation.confirmation) {
        this.subjectService.marcarResuelto(recipient.id, status).subscribe(
            response => {
              if( response['status'] ) {

                recipient = {...recipient, resuelto: true};

                this.dialogRef.close({
                  'action': 'asuntoResuelto',
                });

              } else {
                this.errorMessage.setErrorMessage(response);
              }
            },
            error => {
              this.errorMessage.setErrorMessage(error);
            }
        );
      }
    });
  }

  /**
   * verify if the user can reject the subject.
   * He must not have added answers to the subject
   * He must not have completed tasks
   * He must not have added answer to the tasks
   * @param subjectRequest
   */
  canRejectSubject() {
    this.subject$.select(SubjectSelector.getCurrentSubject)
        .pipe(
            takeUntil(this.subjectSubscription),
            filter(data => data !== null))
        .subscribe(subjectRequest => {
      console.log(subjectRequest);
      let allow = true;

      const subjectAnswers = subjectRequest.answers.filter(answer => {
        if ( this.userService.isAsistente(this.organizationalUnitId) || this.userService.isTitular(this.organizationalUnitId)) {
          return answer.organizationalUnitId === this.organizationalUnitId &&
              answer.step === subjectRequest.destinatario.step;
        } else {
          return answer.organizationalUnitId === this.organizationalUnitId &&
              answer.step === subjectRequest.destinatario.step;
        }
      });

      console.log(subjectAnswers);

      const advancedSubject = subjectRequest.recipients.filter(recipient => {
        if ( this.userService.isAsistente(this.organizationalUnitId) || this.userService.isTitular(this.organizationalUnitId)) {
          return recipient.step > subjectRequest.destinatario.step && recipient.sender_organizationalUnit_id === this.organizationalUnitId
        } else {
          return recipient.step < subjectRequest.destinatario.step
              && recipient.sender_organizationalUnit_id === this.organizationalUnitId
              && recipient.sender_user_id === this.userService.userData.id
        }
      });

      console.log(advancedSubject);

      const tasks = subjectRequest.tasks.filter(task => {
        if ( this.userService.isAsistente(this.organizationalUnitId) || this.userService.isTitular(this.organizationalUnitId)) {
          return task.organizationalUnit_id === this.organizationalUnitId && (task.answers.length > 0 || task.completed || task.userAssigned !== null);
        } else {
          return task.organizationalUnit_id === this.organizationalUnitId && task.user_id === this.userService.userData.id && (task.answers.length > 0 || task.completed);
        }
      });

      console.log(tasks);

      if (advancedSubject.length > 0 || subjectAnswers.length > 0 || tasks.length > 0) {
        allow = false;
      }

      this.canRejectSubjectStatus = allow;
    });

  }

  private rejectSubject(recipient) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {title: 'Confirmación', textContent: '¿Realmente desea rechazar el asunto? el emisor recibirá una notificación sobre esta acción.'};
    dialogConfig.maxWidth = '300px';
    dialogConfig.panelClass = 'dialog-confirmation-class';

    const dialog = this.dialog.open(WarningConfirmationDialogComponent, dialogConfig);

    dialog.afterClosed().subscribe(userConfirmation => {
      if (!isNullOrUndefined(userConfirmation) && userConfirmation.confirmation) {
        this.subjectService.rejectSubject(recipient.id).subscribe(
            response => {
              if( response['status'] ) {

                recipient = {...recipient, resuelto: true};

                this.dialogRef.close({
                  'action': 'rejected',
                });

              } else {
                this.errorMessage.setErrorMessage(response);
              }
            },
            error => {
              this.errorMessage.setErrorMessage(error);
            }
        );
      }
    });
  }

  ngOnDestroy() {
    this.subjectSubscription.next()
  }

}
