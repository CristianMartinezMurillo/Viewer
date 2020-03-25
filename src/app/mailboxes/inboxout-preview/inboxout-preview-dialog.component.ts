import { Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from "@angular/material";
import { FieldConfig } from "../../_models/field.interface";
import { DynamicFormBuilder } from "../../components/DynamicFormBuilder";
import { ActivatedRoute } from "@angular/router";
import { ErrorMessageComponent } from "../../messages/error-message/error-message.component";
import { DynamicFormComponent } from "../../components/dynamic-form/dynamic-form.component";
import { ProcessService } from "../../_services/process.service";
import { SubjectRequestService } from "../../_services/subject-request.service";
import { isNullOrUndefined, isObject } from "util";
import { SubjectAnswerDialogComponent } from "../../share-components/subject-answer/subject-answer-dialog.component";
import { faReply } from "@fortawesome/free-solid-svg-icons/faReply";
import { faBan, faReplyAll } from "@fortawesome/free-solid-svg-icons";
import { faCalendarCheck } from "@fortawesome/free-solid-svg-icons/faCalendarCheck";
import { SubjectService } from "../../_services/subject.service";
import { WarningConfirmationDialogComponent } from "../../dialog/warning-confirmation-dialog/warning-confirmation-dialog.component";
import { UsersService } from "../../_services/users.service";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons/faCheckCircle";
import { AvanzarDialogComponent } from "../../share-components/avanzar/avanzar-dialog.component";
import { NotifierComponent } from "../../notifier/notifier.component";
import { Store } from "@ngrx/store";
import * as MailboxReducer from "../../_store/reducers/mailbox.reducer";
import * as MailboxSelector from "../../_store/selectors/mailbox.selector";
import * as SubjectReducer from "../../_store/reducers/subject.reducer";
import * as SubjectSelector from "../../_store/selectors/subject.selector";
import { filter, take, takeUntil} from "rxjs/operators";
import { AddresseeModel } from "../../_models/addresseeModel";
import * as SubjectActions from "../../_store/actions/subject.actions";
import { Subject} from "rxjs";
import { Preview} from "../Preview";
import { SubjectRequestModel} from "../../_models/SubjectRequest.model";
import * as SubjectSelect from '../../_store/selectors/subject.selector';

@Component({
  selector: 'app-inboxout-preview-dialog',
  templateUrl: './inboxout-preview-dialog.component.html',
  styleUrls: ['./inboxout-preview-dialog.component.css']
})
export class InboxoutPreviewDialogComponent extends Preview implements OnInit, OnDestroy {
    @ViewChild( ErrorMessageComponent ) errorMessage;
    @ViewChild( DynamicFormComponent ) form: DynamicFormComponent;
    @ViewChild( NotifierComponent ) notifier;

    canCancelSubject$: boolean = false;

    destroy: Subject<void> = new Subject();

    faAnswer = faReply;
    faCancel = faBan;
    faFinish = faCalendarCheck;
    faResolver = faCheckCircle;
    faTurnar = faReplyAll;

    formConfig: FieldConfig[] = [];
    // tasks;
    subjectRequest: SubjectRequestModel;
    organizationalUnitId: number = null;

    constructor(
        private subjectRequestService: SubjectRequestService,
        private subjectService: SubjectService,
        private processService: ProcessService,
        private activatedRoute: ActivatedRoute,
        private formBuilder: DynamicFormBuilder,
        public dialogRef: MatDialogRef<InboxoutPreviewDialogComponent>,
        public userService: UsersService,
        private dialog: MatDialog,
        private store$: Store<MailboxReducer.State>,
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

        this.canCancelSubject();
    }

    buildSubjectForm(){
        let addresseeId = this.subject.id;

        this.subjectRequestService.subjectRequest(addresseeId).subscribe(
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
    //     if(isObject(this.subjectRequest.destinatario) && this.subjectRequest.destinatario.hasOwnProperty('organizationalUnitTasks')) {
    //         this.tasks = this.subjectRequest.destinatario.organizationalUnitTasks;
    //     }
    //
    //     if(isObject(this.subjectRequest.destinatario) && this.subjectRequest.destinatario.hasOwnProperty('userTasks')) {
    //         this.tasks = this.subjectRequest.destinatario.userTasks;
    //     }
    // }

    mapFieldsAndBuildForm(){
        let metadata = [];
        let metadataValue = this.subjectRequest.metadataValue;

        this.subjectRequest.process.metadata.forEach(function(field, index){
            let metadataFieldValue = metadataValue.find(metadataValueField => metadataValueField.metadata_id === field.id);

            if(isNullOrUndefined(metadataFieldValue))
                return;

            field = {...field, value:metadataFieldValue.value};
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
        // dialogConfig.panelClass = 'dialog-class';

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

    /**
     * event triggered for dynamic field component when the user clicks the submit button
     * @param $event
     */
    submit($event){

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

    isTitular() {
        return this.userService.isTitular(this.organizationalUnitId);
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

    /**
     * valid if a user can finish a subject, only the sender, titular of the area or asistant can close the subject
     * @param addressee
     */
    canFinishSubject(addressee) : boolean {
        if(isNullOrUndefined(addressee) ||
             !addressee.hasOwnProperty('status') ||
             !addressee.hasOwnProperty('destinatario'))
            return false;

        return (addressee.status.code !== 'closed' && addressee.destinatario.isSender == true) ? true: false
    }

    private canSeeSubjectReviewed(): boolean{
        // return this.userService.isTitular(this.organizationalUnitId) === true ||
        //     this.userService.isAsistente(this.organizationalUnitId) === true;
        return true;
    }

    private canCancelSubject() {
        console.log('canCancelSubject');
        this.subject$.select(SubjectSelect.getSubjectRecipients)
            .pipe(
                takeUntil(this.destroy),
            ).subscribe(recipients => {
            if (recipients === null) {
                this.canCancelSubject$ = false;
            } else {
                this.canCancelSubject$ = recipients.filter(recipient => {
                    if (recipient.last_seen !== null) {
                        return recipient.user_id === this.userService.userData.id && recipient.isSender == true ? false : true;
                    } else {
                        console.log(recipient);
                        return false;
                    }
                }).length === 0;
            }

        });
    }

    private cancelSubject(): void {
        let dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {title: 'Cancelar asunto', textContent: 'Esta a punto de cancelar el asunto ¿Desea continuar?'};
        dialogConfig.maxWidth = '300px';
        dialogConfig.panelClass = 'dialog-confirmation-class';

        const dialog = this.dialog.open(WarningConfirmationDialogComponent, dialogConfig);

        dialog.afterClosed().subscribe(userConfirmation => {
            if (!isNullOrUndefined(userConfirmation) && userConfirmation.confirmation) {
                this.subjectService.cancel(this.subjectRequest.destinatario.id).subscribe(response => {
                    if (response['status']) {
                        this.dialogRef.close({ action: 'cancelSubject' });
                    } else {
                        this.errorMessage.setErrorMessage(response);
                    }
                }, error => {
                    console.error(error);
                    this.errorMessage.setErrorMessage(error);
                });
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy.next();
    }
}
