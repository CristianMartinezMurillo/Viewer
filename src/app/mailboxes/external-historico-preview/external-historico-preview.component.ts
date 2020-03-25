import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ErrorMessageComponent} from "../../messages/error-message/error-message.component";
import {DynamicFormComponent} from "../../components/dynamic-form/dynamic-form.component";
import {faReply} from "@fortawesome/free-solid-svg-icons/faReply";
import {faBan} from "@fortawesome/free-solid-svg-icons";
import {faCalendarCheck} from "@fortawesome/free-solid-svg-icons/faCalendarCheck";
import {FieldConfig} from "../../_models/field.interface";
import {SubjectRequestService} from "../../_services/subject-request.service";
import {SubjectService} from "../../_services/subject.service";
import {ProcessService} from "../../_services/process.service";
import {ActivatedRoute} from "@angular/router";
import {DynamicFormBuilder} from "../../components/DynamicFormBuilder";
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material";
import {Store} from "@ngrx/store";
import * as SubjectReducer from "../../_store/reducers/subject.reducer";
import * as SubjectActions from "../../_store/actions/subject.actions";
import {isNullOrUndefined, isObject} from "util";
import {SubjectAnswerDialogComponent} from "../../share-components/subject-answer/subject-answer-dialog.component";
import {AddAttachmentsSubjectComponent} from "../add-attachments-subject/add-attachments-subject.component";

@Component({
  selector: 'app-external-historico-preview',
  templateUrl: './external-historico-preview.component.html',
  styleUrls: ['./external-historico-preview.component.css']
})
export class ExternalHistoricoPreviewComponent implements OnInit {
  @ViewChild( ErrorMessageComponent ) errorMessage;
  @ViewChild( DynamicFormComponent ) form: DynamicFormComponent;

  faAnswer = faReply;
  faCancel = faBan;
  faFinish = faCalendarCheck;

  formConfig: FieldConfig[] = [];

  subjectRequest;

  constructor(
      private subjectRequestService: SubjectRequestService,
      private subjectService: SubjectService,
      private processService: ProcessService,
      private activatedRoute: ActivatedRoute,
      private formBuilder: DynamicFormBuilder,
      public dialogRef: MatDialogRef<ExternalHistoricoPreviewComponent>,
      private dialog: MatDialog,
      private subject$: Store<SubjectReducer.State>,
      @Inject(MAT_DIALOG_DATA) public subject
  ) { }

  ngOnInit() {
    this.buildSubjectForm();
  }

  buildSubjectForm(){
    let subjectRequestId = this.subject.destinatario.id;

    this.subjectRequestService.subjectRequest(subjectRequestId).subscribe(
        response => {
          if(response.status){
            this.subjectRequest = response.subject;
            this.subject$.dispatch(new SubjectActions.StoreCurrentSubject(this.subjectRequest));
            this.mapFieldsAndBuildForm();
          }else{
            this.errorMessage.setErrorMessage(response);
          }
        },
        error => {
          console.error(error);
        }
    );
  }


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

  buttonConfig(){
    return {
      type: "button",
      label: "Responder Asunto"
    };
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
      if (isObject(answer)) {

        // if(isNullOrUndefined(this.subjectRequest.answers))
        //   this.subjectRequest.answers = [];
        //
        // this.subjectRequest.answers.push(answer);
        //
        // console.log(this.subject.answers);
      }
    });

  }

  /**
   * event triggered for dynamic field component when the user clicks the submit button
   * @param $event
   */
  submit($event){

  }

  attachDocumentsToSubject() {
    let dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = this.subjectRequest;
    dialogConfig.maxWidth = '1000px';
    dialogConfig.width = '800px';
    // dialogConfig.maxHeight = '700px';
    // dialogConfig.panelClass = 'dialog-class';

    const dialog = this.dialog.open(AddAttachmentsSubjectComponent, dialogConfig);

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

  canAddAttachments(): boolean {
    if (this.subjectRequest === undefined)
      return false;

    return this.subjectRequest.destinatario.isSender == true;
  }


}
