import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AddresseeTreeComponent } from "../../new-subject/addressee-tree/addressee-tree.component";
import { NewSubjectService } from "../../_services/new-subject.service";
import { ErrorMessageComponent } from "../../messages/error-message/error-message.component";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
  MatHorizontalStepper,
  MatRadioGroup
} from "@angular/material";
import { DynamicFormBuilder } from "../../components/DynamicFormBuilder";
import { FieldConfig } from "../../_models/field.interface";
import { FormBuilder, FormGroup } from "@angular/forms";
import { faArrowCircleRight, faBan, faFileSignature } from "@fortawesome/free-solid-svg-icons";
import { ProcessService } from "../../_services/process.service";
import { ActivatedRoute, Router } from "@angular/router";
import { UploadFileComponent } from "../upload-file/upload-file.component";
import { SubjectService } from "../../_services/subject.service";
import { NotifierComponent } from "../../notifier/notifier.component";
import * as AvanzarSubjectSelector from "../../_store/selectors/avanzar-subject.selector";
import { take } from "rxjs/operators";
import { Store } from "@ngrx/store";
import * as AvanzarSubjectReducer from "../../_store/reducers/avanzar-subject.reducer";
import * as AvanzarSubjectActions from "../../_store/actions/avanzar-subject.actions";
import {OrganizationalUnitService} from "../../_services/organizational-unit.service";

@Component({
  selector: 'app-avanzar-dialog',
  templateUrl: './avanzar-dialog.component.html',
  styleUrls: ['./avanzar-dialog.component.css']
})
export class AvanzarDialogComponent implements OnInit, OnDestroy {
  @ViewChild( ErrorMessageComponent ) errorMessage;
  @ViewChild( AddresseeTreeComponent ) addresseeTreeComponent;
  @ViewChild( 'addresseeRadio' ) addresseeRadioCompnenet : MatRadioGroup;
  @ViewChild( 'stepper' ) stepper : MatHorizontalStepper;
  // @ViewChild( DynamicFormComponent ) dynamicForm: DynamicFormComponent;
  @ViewChild( UploadFileComponent ) uploadFiles;
  @ViewChild( NotifierComponent ) notifier;

  disableButton : boolean = false;

  formConfig: FieldConfig[] = [];

  showSpinner = false;
  addresseeTypeRadio: string;

  formGroup: FormGroup;
  submitted: boolean = false;

  titleIcon = faFileSignature;
  faCancel = faBan;
  faNext = faArrowCircleRight;

  companies = [];
  processes = [];
  processName;

  addressees = [
    {
      name: "Unidad Organizacional",
      code: "organizationalUnit",
      checked: true
    },
    {
      name: "Responsable",
      code: "user",
      checked: false
    }
  ];

  users = [];
  organizationalUnit = [];

  addresseeGroupButtonStatus = false;

  constructor(
      private processService: ProcessService,
      private activatedRoute: ActivatedRoute,
      private formBuilder: DynamicFormBuilder,
      private newSubjectService: NewSubjectService,
      private subjectService: SubjectService,
      public dialogRef: MatDialogRef<AvanzarDialogComponent>,
      private router: Router,
      private dialog: MatDialog,
      private fb: FormBuilder,
      private store$: Store<AvanzarSubjectReducer.State>,
      private organizationalUnitService: OrganizationalUnitService,
      @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
    console.log(this.data);
    this.getAddresseeData();
  }

  getAddresseeData(){
    this.organizationalUnitService.getOrganizationalUnitAndUsers(this.data.organizationalUnitId).subscribe(
        response => {
          if(response.status){

            this.store$.dispatch(new AvanzarSubjectActions.StoreOrganizationalUnits(response.organizationalUnit));

            this.store$.dispatch(new AvanzarSubjectActions.StoreUsers(response.users));

            this.changeAdressee(this.addressees[0].code);
          }else{
            this.errorMessage.setErrorMessage(response);
          }
        },
        error => {
          this.errorMessage.setErrorMessage(error);
        }
    );
  }

  changeAdressee(addressType){
    this.addresseeRadioCompnenet.value = addressType;

    this.addresseeTypeRadio = addressType;

    this.buildSubjectForm();

    this.addresseeGroupButtonStatus = true;

    if(addressType === 'organizationalUnit') {

      this.store$.select(AvanzarSubjectSelector.getOrganizationlUnits)
          .pipe(take(1))
          .subscribe(response => {

            if(response === null) {
              return;
            }

            let organizationalUnits =  Object.assign([], response);

            this.addresseeTreeComponent.buildTree(addressType, organizationalUnits);

            this.addresseeGroupButtonStatus = false;
          });
    }

    if(addressType === 'user') {
      this.store$.select(AvanzarSubjectSelector.getUsers)
          .pipe(take(1))
          .subscribe(response => {
            let users =  Object.assign([], response);

            this.addresseeTreeComponent.buildTree(addressType, users);

            this.addresseeGroupButtonStatus = false;
          });
    }

  }

  getFilesAttached(){
    return this.uploadFiles.getFilesForm();
  }

  buildSubjectForm(){
    let processId = this.data.subjectRequest.process.id;

    this.processService.getProcessMetadata(processId).subscribe(
        response => {
          if(response.status){
            this.mapFieldsAndBuildForm(response.process);
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

  mapFieldsAndBuildForm(process){

    let metadata = process.metadata;

    this.formConfig.splice(0,this.formConfig.length)

    this.formConfig = this.formBuilder.buildForm(this.formConfig, metadata);

    // this.formConfig.push(this.buttonConfig());

    // this.dynamicForm.createControls();
  }

  submit(){
    this.submitted = true;

    // Object.keys(this.formGroup.controls).forEach(field => { // {1}
    //   const control = this.formGroup.get(field);            // {2}
    //   control.markAsTouched({ onlySelf: true });       // {3}
    // });

    // if(!this.formGroup.valid || !this.dynamicForm.isValid())
    //   return 0;

    this.buttonLoading();

    // let defaultFieldsArray = [];
    // let defaultFields = this.formGroup.value;
    // let fieldsAndValues = this.dynamicForm.getFieldsAndValues();
    let selectedNodes = this.addresseeTreeComponent.getAddresseeSelected();

    let attachments = this.getFilesAttached();

    // console.log(fieldsAndValues);
    console.log(selectedNodes.addressee);
    console.log(selectedNodes.tasks);
    console.log(this.addresseeTypeRadio);
    // console.log(this.formGroup);
    // console.log(this.formGroup.value);

    // attachments.append('subject', JSON.stringify(fieldsAndValues));
    // attachments.append('defaultFields', JSON.stringify(defaultFields));
    attachments.append('addressee', JSON.stringify(selectedNodes.addressee));
    attachments.append('tasks', JSON.stringify(selectedNodes.tasks));
    attachments.append('addresseeType', this.addresseeTypeRadio);

    if (!(this.data.subjectRequest.id > 0) || !(this.data.organizationalUnitId > 0)) {
      console.error("subjectRequestId: " + this.data.subjectRequest.id, "organizationalUnitId:" + this.data.organizationalUnitId);
      return;
    }

    this.subjectService.avanzar(this.data.subjectRequest.id, this.data.organizationalUnitId, attachments).subscribe(
        response => {

          this.enableButton();

          if(response['status']){
            this.dialogRef.close({

            });
            // this.showDetailSubjectSent(response['detail']);
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

  /**
   * show subject folio
   * @param detail
   */
  showDetailSubjectSent(detail){
    this.notifier.show({
      type: 'success',
      message: 'Asunto avanzado'
    });
    // let dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = false;
    // dialogConfig.autoFocus = true;
    // dialogConfig.width = '500px';
    // dialogConfig.height = '400px';
    // dialogConfig.data = detail;
    //
    // const dialog = this.dialog.open(SubjectSentDialogComponent, dialogConfig);
    //
    // dialog.afterClosed().subscribe(result => {
    //
    // });
  }

  buttonLoading(){
    this.showSpinner = true;
    this.disableButton = true;
  }

  enableButton(){
    this.showSpinner = false;
    this.disableButton = false;
  }

  ngOnDestroy(): void {
    this.store$.dispatch(new AvanzarSubjectActions.ClearAll());
  }

}
