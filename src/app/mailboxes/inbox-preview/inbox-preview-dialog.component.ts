import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from "@angular/material";
import { FieldConfig } from "../../_models/field.interface";
import { DynamicFormBuilder } from "../../components/DynamicFormBuilder";
import { ActivatedRoute } from "@angular/router";
import { ErrorMessageComponent } from "../../messages/error-message/error-message.component";
import { DynamicFormComponent } from "../../components/dynamic-form/dynamic-form.component";
import { ProcessService } from "../../_services/process.service";
import { SubjectRequestService } from "../../_services/subject-request.service";
import { isArray, isNullOrUndefined, isObject } from "util";
import { UsersService } from "../../_services/users.service";
import { SubjectAnswerDialogComponent } from "../../share-components/subject-answer/subject-answer-dialog.component";
import { faReply } from "@fortawesome/free-solid-svg-icons/faReply";
import { faBan, faReplyAll } from "@fortawesome/free-solid-svg-icons";
import { WarningConfirmationDialogComponent } from "../../dialog/warning-confirmation-dialog/warning-confirmation-dialog.component";
import { SubjectService } from "../../_services/subject.service";
import { faCalendarCheck } from "@fortawesome/free-solid-svg-icons/faCalendarCheck";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons/faCheckCircle";
import { AvanzarDialogComponent } from "../../share-components/avanzar/avanzar-dialog.component";
import { NotifierComponent } from "../../notifier/notifier.component";
import * as MailboxSelector from "../../_store/selectors/mailbox.selector";
import { filter, take, takeUntil } from "rxjs/operators";
import { Store } from "@ngrx/store";
import * as MailboxReducer from "../../_store/reducers/mailbox.reducer";
import { AddresseeModel } from "../../_models/addresseeModel";
import * as SubjectReducer from '../../_store/reducers/subject.reducer';
import * as SubjectActions from '../../_store/actions/subject.actions';
import * as SubjectSelector from '../../_store/selectors/subject.selector';
import { SubjectRequestModel } from "../../_models/SubjectRequest.model";
import { Subject } from "rxjs";
import { Preview } from "../Preview";
import construct = Reflect.construct;

@Component({
  selector: 'app-inbox-preview-dialog',
  templateUrl: './inbox-preview-dialog.component.html',
  styleUrls: ['./inbox-preview-dialog.component.css']
})
export class InboxPreviewDialogComponent extends Preview implements OnInit, OnDestroy {
    @ViewChild( ErrorMessageComponent ) errorMessage;
    @ViewChild( DynamicFormComponent ) form: DynamicFormComponent;
    @ViewChild( NotifierComponent ) notifier;

    canRejectSubjectStatus = false;
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
      private store$: Store<MailboxReducer.State>,
      public dialogRef: MatDialogRef<InboxPreviewDialogComponent>,
      private subjectService: SubjectService,
      private subject$: Store<SubjectReducer.State>,
      @Inject(MAT_DIALOG_DATA) public subject: AddresseeModel
  ) {
      super();
  }

  ngOnInit() {
    this.buildSubjectForm();

      this.store$.select(MailboxSelector.getCurrentOrganizationalUnitId)
          .pipe(
              takeUntil(this.destroy),
              filter(data => data !== null)
          )
          .subscribe(
              response => {
                  this.organizationalUnitId = response;
              }
          );

      this.canRejectSubject();
  }

    buildSubjectForm(){
        let addresseeId = this.subject.id;

        this.subjectRequestService.subjectRequest(addresseeId).subscribe(
            response => {
                if(response.status){
                    this.subjectRequest = response.subject;
                    this.subject$.dispatch(new SubjectActions.StoreCurrentSubject(this.subjectRequest));
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
    //       if(isObject(this.subjectRequest.destinatario) && this.subjectRequest.destinatario.hasOwnProperty('organizationalUnitTasks')) {
    //         this.tasks = this.subjectRequest.destinatario.organizationalUnitTasks;
    //       }
    //
    //       if(isObject(this.subjectRequest.destinatario) && this.subjectRequest.destinatario.hasOwnProperty('userTasks')) {
    //         this.tasks = this.subjectRequest.destinatario.userTasks;
    //       }
    //   }


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

        dialogConfig.disableClose = true;
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
            //     if(isNullOrUndefined(this.subjectRequest.answers))
            //         this.subjectRequest.answers = [];
            //
            //     this.subjectRequest.answers.push(answer);
            //
            // }
        });

    }

    private isTitular(){
        return this.userService.isTitular(this.organizationalUnitId);
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

                            this.subjectRequest.destinatario.resuelto = true;

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
        dialogConfig.data = { subjectRequest:  this.subjectRequest, organizationalUnitId: this.organizationalUnitId };
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

    /**
     * valid if a user can finish a subject, only the sender, titular of the area or asistant can close the subject
     * @param addressee
     */
    canFinishSubject(addressee) : boolean {
        if (isNullOrUndefined(addressee) ||
            !addressee.hasOwnProperty('status') ||
            !addressee.hasOwnProperty('destinatario')) {
            return false;
        }

        return (addressee.status.code !== 'closed' && addressee.destinatario.isSender == true) ? true: false
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
                takeUntil(this.destroy),
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

    /**
     *
     * @param recipient
     */
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

    ngOnDestroy(): void {
        this.destroy.next();
    }
}
