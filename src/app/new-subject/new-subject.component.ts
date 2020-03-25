import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatHorizontalStepper, MatRadioButton, MatRadioGroup } from "@angular/material";
import { faFileSignature } from '@fortawesome/free-solid-svg-icons';
import { ErrorMessageComponent } from "../messages/error-message/error-message.component";
import { ProcessService } from "../_services/process.service";
import { FieldConfig } from "../_models/field.interface";
import { ActivatedRoute, Router } from "@angular/router";
import { DynamicFormBuilder } from "../components/DynamicFormBuilder";
import { NewSubjectService } from "../_services/new-subject.service";
import { UploadFileComponent } from "../share-components/upload-file/upload-file.component";
import { SubjectSentDialogComponent } from "./subject-detail-dialog/subject-sent-dialog.component";
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import * as NewSubjectReducer from '../_store/reducers';
import * as NewSubjectSelector from '../_store/selectors/new-subject.selector';
import * as NewSubjectActions  from '../_store/actions/new-subject.actions';
import { select, Store } from "@ngrx/store";
import { take, takeUntil } from "rxjs/operators";
import * as ProcessSelector from "../_store/selectors/process.selector";
import * as ProcessReducer  from '../_store/reducers/process.reducer';
import { Subject } from "rxjs";
import { SubjectSeverityModel } from "../_models/SubjectSeverityModel";
import * as moment from 'moment';
import { CalendarService } from "../_services/CalendarService";
import { SubjectSeverityService } from "../_services/subjectSeverity.service";
import { SummaryComponent } from "./summary/summary.component";
import { MetadataComponent } from "./metadata/metadata.component";
import { RecipientsComponent } from "./recipients/recipients.component";
import * as MailboxActions from "../_store/actions/mailbox.actions";
import * as MailboxReducer from "../_store/reducers/mailbox.reducer";
import { NotifierComponent } from "../notifier/notifier.component";

export interface selectedNodes{
    addressee: Array<any>;
    tasks: Array<any>;
    nodes: Array<any>;
}

@Component({
  selector: 'app-new-subject-admin',
  templateUrl: './new-subject.component.html',
  styleUrls: ['./new-subject.component.css']
})
export class NewSubjectComponent implements OnInit, OnDestroy {
    @ViewChild( ErrorMessageComponent ) errorMessage;
    @ViewChild( UploadFileComponent ) uploadFiles;
    @ViewChild( 'summaryComponent' ) summaryComponent: SummaryComponent;
    @ViewChild( 'buttonSubmit' ) buttonSubmit;
    @ViewChild( 'addresseeRadio' ) addresseeRadio : MatRadioGroup;
    @ViewChild( 'stepper' ) stepper : MatHorizontalStepper;
    @ViewChild('formDirective') formDirective: NgForm;
    @ViewChild('metadataComponent') metadataComponent: MetadataComponent;
    @ViewChild('recipientsComponent') recipientsComponent: RecipientsComponent;
    @ViewChild('uploadFileComponent') uploadFileComponent: UploadFileComponent;
    @ViewChild('notifierComponent') notifier: NotifierComponent;

    private destroySeverities$: Subject<void> = new Subject();

    /**
     * 1: internal
     * 2: external
     */
    subjectType: number = 1;

    showSpinner = false;

    submitted: boolean = false;

    subjectSeverities: Array<SubjectSeverityModel> = [];

    titleIcon = faFileSignature;

    formConfig: FieldConfig[] = [];

    constructor(
        private processService: ProcessService,
        private activatedRoute: ActivatedRoute,
        private formBuilder: DynamicFormBuilder,
        private newSubjectService: NewSubjectService,
        private router: Router,
        private dialog: MatDialog,
        private fb: FormBuilder,
        private store$: Store<NewSubjectReducer.State>,
        private mailbox$: Store<MailboxReducer.State>,
        private processStore$: Store<ProcessReducer.State>,
        private calendarService: CalendarService,
        private subjectSeverityService: SubjectSeverityService,
    ) {

    }

  ngOnInit() {
      this.activatedRoute.params.subscribe(val => {
          this.store$.dispatch(new NewSubjectActions.ClearCreatingSubjectData());

          this.store$.select(NewSubjectSelector.getCurrentOrganizationalUnitId)
              .pipe(
                  take(1)
              )
              .subscribe(
                  currentOrganizationalUnitId => {
                      console.log(parseInt(this.organizationalUnitId));
                      console.log(currentOrganizationalUnitId);

                      if (currentOrganizationalUnitId !== parseInt(this.organizationalUnitId)) {
                          this.store$.dispatch(new NewSubjectActions.SetCurrentOrganizationalUnitId(parseInt(this.organizationalUnitId)));
                          this.store$.dispatch(new MailboxActions.SetCurrentOrganizationalUnitId(parseInt(this.organizationalUnitId)));

                      }

                      this.resetComponent();

                  }
              );
      });

      this.getSubjectSeverity();

      this.store$.dispatch(new NewSubjectActions.SetCurrentOrganizationalUnitId(parseInt(this.organizationalUnitId)));
  }

  private getSubjectSeverity() {
        this.subjectSeverityService.getAll().subscribe(
            response => {
                if(response['status']) {
                    this.store$.dispatch(new NewSubjectActions.StoreSeverities(response['severities']));
                    this.setSubjectSeverity();
                } else {
                    this.errorMessage.setErrorMessage(response)
                }
            },
            error => {
                console.error(error);
                this.errorMessage.setErrorMessage(error)
            }
        );
  }

  private setSubjectSeverity() {
      this.store$.select(NewSubjectSelector.getSeverities)
          .pipe(takeUntil(this.destroySeverities$))
          .subscribe((subjectSeverities) => {
              if(subjectSeverities.length > 0) {
                  this.subjectSeverities = subjectSeverities;
                  this.destroySeverities$.next();
              }

          });
  }

  private resetComponent() {
        // this.submitted = false;
      this.metadataComponent.buildSubjectForm();
      this.stepper.selectedIndex = 0;

      if (this.recipientsComponent !== undefined && this.recipientsComponent.addresseeTreeComponent !== undefined) {
          this.recipientsComponent.addresseeTreeComponent.refreshTree();
      }

      this.resetDefaultFields();
  }

  private isExternalSubject() {
      return this.metadataComponent.subjectType === 2;
  }

  private isInternalSubject() {
      return this.metadataComponent.subjectType === 1;
  }

  private get processName() {
      return this.activatedRoute.snapshot.paramMap.get('processName');
  }

  private get processId(){
      return this.activatedRoute.snapshot.paramMap.get('process_id');
  }

  private get organizationalUnitId(){
      return this.activatedRoute.snapshot.paramMap.get('organizationalUnitId');
  }

  private submit(){
     this.submitted = true;

     Object.keys(this.metadataComponent.formGroup.controls).forEach(field => { // {1}
         const control = this.metadataComponent.formGroup.get(field);            // {2}
         control.markAsTouched({ onlySelf: true });       // {3}
     });

     // if(!this.formGroup.valid || (!isNumber(this.getTempSubjectIdSelected()) && !this.metadataComponent.dynamicForm.isValid()))
     if(!this.metadataComponent.isValidDefaultFields() || !this.metadataComponent.dynamicForm.isValid())
         return 0;

      this.buttonLoading();

      let attachments = this.getAttachments();

      this.newSubjectService.request(this.processId, this.organizationalUnitId, attachments).subscribe(
          response => {
              this.enableButton();
              if(response.status){
                  this.showDetailSubjectSent(response.detail);
              }else{
                  this.errorMessage.setErrorMessage(response);
              }
          },
          error => {
              console.error(error);
              this.enableButton();
              this.errorMessage.setErrorMessage(error);
          }
      );
    }

    private buttonLoading(){
        this.showSpinner = true;
        this.buttonSubmit.disabled = true;
    }

    private enableButton(){
        this.showSpinner = false;
        this.buttonSubmit.disabled = false;
    }

    private getFilesAttached(){
        return this.uploadFiles.getFilesForm();
    }

    /**
     * show dubject folio
     * @param detail
     */
   private showDetailSubjectSent(detail){
       let dialogConfig = new MatDialogConfig();
       dialogConfig.disableClose = false;
       dialogConfig.autoFocus = true;
       dialogConfig.width = '500px';
       // dialogConfig.height = '400px';
       dialogConfig.data = detail;
        // dialogConfig.panelClass = 'dialog-class';

       const dialog = this.dialog.open(SubjectSentDialogComponent, dialogConfig);

       dialog.afterClosed().subscribe(result => {
           this.redirectToPanel();
       });
   }

   private redirectToPanel(){
       this.router.navigate(['/panel/mailbox/inboxout/nuevo/' + this.organizationalUnitId]);
   }

   // getTempSubjectIdSelected() : number | null {
   //     let tempSubject = this.tempSubjectPluginComponent.tempSubjectSelected();
   //
   //     return (isObject(tempSubject)) ? tempSubject.id : null;
   // }

   private resetDefaultFields() {
       this.metadataComponent.resetDefaultFields();
   }

   private validateRecipientsSelectedAndNext() : boolean {
       if(this.recipientsComponent === undefined || this.recipientsComponent.addresseeTypeRadio === undefined)
           return false;

       if(this.recipientsComponent.addresseeTypeRadio.code === 'external') {
           return true;
       } else {
           return (this.recipientsComponent.addresseeTreeComponent === undefined) ? false : this.recipientsComponent.addresseeTreeComponent.hasAddresseeSelected();
       }
   }

   private getAttachments() {
       const subjectSettingsValue = this.getSubjectSettings();

       let defaultFields = Object.assign({}, this.getDefaulFieldsValue(), subjectSettingsValue);

       let fieldsAndValues = this.metadataComponent.dynamicForm.getFieldsAndValues();

       return (this.isExternalSubject()) ? this.externalSubjectParams(defaultFields, fieldsAndValues) : this.internalSubjectParams(defaultFields, fieldsAndValues);
   }

   private getSubjectSettings() {
       return this.metadataComponent.subjectSettingsComponent.getFormValues();
   }

   private getDefaulFieldsValue() {
       let defaultFields = this.metadataComponent.getDefaultFieldsValue();
       // delete defaultFields['severity'];

       return defaultFields;
   }

   private getSubjectType(): string {
       switch (this.metadataComponent.subjectType) {
           case 1: return 'internal';
           case 2: return 'external';
       }
   }

   private internalSubjectParams(defaultFields, fieldsAndValuesSubject ) {
       let attachments = this.getFilesAttached();

       const fulltext = this.getFulltext(defaultFields, fieldsAndValuesSubject);
       const selectedRecipients = this.recipientsComponent.addresseeTreeComponent.getAddresseeSelected();

       console.log(fieldsAndValuesSubject);
       console.log(selectedRecipients['addressee']);
       console.log(selectedRecipients['tasks']);
       console.log(this.recipientsComponent.addresseeTypeRadio.code);
       console.log(this.metadataComponent.formGroup);
       console.log(defaultFields);
       console.log(fulltext);

       attachments.append('subject', JSON.stringify(fieldsAndValuesSubject));
       attachments.append('defaultFields', JSON.stringify(defaultFields));
       attachments.append('recipients', JSON.stringify(selectedRecipients.addressee));
       attachments.append('tasks', JSON.stringify(selectedRecipients.tasks));
       attachments.append('addresseeType', this.recipientsComponent.addresseeTypeRadio.code);
       attachments.append('subjectType', this.getSubjectType());
       attachments.append('fulltext', fulltext);

       return attachments;
   }

    private externalSubjectParams(defaultFields, fieldsAndValuesSubject ) {
        let attachments = this.getFilesAttached();

        const fulltext = this.getFulltext(defaultFields, fieldsAndValuesSubject);
        const selectedRecipients = this.recipientsComponent.addresseeTreeComponent.getAddresseeSelected();

        // console.log(selectedNodes);
        console.log(fieldsAndValuesSubject);
        // console.log(this.addresseeTypeRadio.code);
        console.log('metadata: ',this.metadataComponent.formGroup);
        console.log('defaultFields: ',defaultFields);
        console.log(selectedRecipients['tasks']);
        console.log(fulltext);

        attachments.append('subject', JSON.stringify(fieldsAndValuesSubject));
        attachments.append('defaultFields', JSON.stringify(defaultFields));
        attachments.append('addresseeType', this.recipientsComponent.addresseeTypeRadio.code);
        attachments.append('subjectType', this.getSubjectType());
        attachments.append('recipients', JSON.stringify(selectedRecipients.addressee));
        attachments.append('tasks', JSON.stringify(selectedRecipients.tasks));
        attachments.append('fulltext', fulltext);

        return attachments;
    }

    private getFulltext(defaultFields_, SubjectFieldsAndValues) : string {
        let defaultFields = this.removeUnnecessaryFulltextFields(defaultFields_);

        let fulltextString = '';

        Object.values(SubjectFieldsAndValues).forEach(field => {
            let fieldType = this.metadataComponent.processMetadata['metadata'].find(field_ => field_['id'] === field['id']);

            if(field['value'] === null)
                return;


            if(fieldType.catDataType.field_name === 'catalog') {
                let catalogValue = fieldType.catalogData.find(value => value.id === parseInt(field['value']));

                if(!(catalogValue === undefined || catalogValue === null))
                    fulltextString += catalogValue['name'] + ' ';

            } else {
                fulltextString += field['value'] + ' ';
            }

        });


        Object.values(defaultFields).forEach(key => {
            if(!(key === undefined || key === null))
                fulltextString += key + ' ';
        });

        fulltextString = fulltextString.trim();

        return fulltextString;
    }

    private removeUnnecessaryFulltextFields(defaultFields_) {
        const notAllowed = ['onlyTitular']; //remove unnecessary fields in fulltext

        const defaultFields = Object.keys(defaultFields_)
            .filter(key => !notAllowed.includes(key))
            .reduce((obj, key) => {
                obj[key] = defaultFields_[key];
                return obj;
            }, {});

        return defaultFields;
    }

    private isValidSubjectForm(): boolean{
       if(this.metadataComponent.dynamicForm === undefined || this.metadataComponent.dynamicForm.form === undefined)
           return false;

       return (this.metadataComponent.isValid() === true && this.metadataComponent.isValidDefaultFields() === true);
    }

    /**
     * On change index of stepper
     */
   private onChangeIndex($event) {
        const steps = this.stepper._steps.toArray();

        if (steps[$event.previouslySelectedIndex].label === 'Nuevo asunto') {
            this.metadataComponent.storeMetadata();
        }

        if (steps[$event.previouslySelectedIndex].label === 'Documentos') {
            this.store$.dispatch(new NewSubjectActions.StoreDocuments(this.uploadFileComponent.getDocumentsList()));
        }

        if (steps[$event.previouslySelectedIndex].label === 'Destinatarios') {
            this.recipientsComponent.storeRecipients();
        }

        if(steps[$event.selectedIndex].label === 'Resumen') {

        }

        if(steps[$event.selectedIndex].label === 'Destinatarios') {
            // if(this.recipientsComponent.addresseeTreeComponent.getAddresseeSelected().addressee.length === 0){
                // this.recipientsComponent.changeRecipientType(this.recipientsComponent.recipientOptions[0]);
            // }
        }
   }

    ngOnDestroy(): void {
        this.store$.dispatch(new NewSubjectActions.ClearAll());
    }

}
