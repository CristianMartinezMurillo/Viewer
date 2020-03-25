import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ProcessModel } from '../../_models/process.model';
import { DynamicFormComponent } from '../../components/dynamic-form/dynamic-form.component';
import { ErrorMessageComponent } from '../../messages/error-message/error-message.component';
import * as ProcessSelector from "../../_store/selectors/process.selector";
import * as ProcessReducer  from '../../_store/reducers/process.reducer';
import { filter, map, switchMap, take, takeUntil } from 'rxjs/operators';
import { Observable, Observer, Subject } from 'rxjs';
import { SummaryService } from '../../_services/SummaryService';
import { FieldConfig } from '../../_models/field.interface';
import { select, Store } from '@ngrx/store';
import * as NewSubjectReducer from '../../_store/reducers/index';
import * as NewSubjectSelector from '../../_store/selectors/new-subject.selector';
import * as NewSubjectActions  from '../../_store/actions/new-subject.actions';
import { DynamicFormBuilder } from '../../components/DynamicFormBuilder';
import { SubjectSeverityModel } from '../../_models/SubjectSeverityModel';
import { CalendarService } from '../../_services/CalendarService';
import { Moment } from "moment";
import * as moment from 'moment';
import { ActivatedRoute} from "@angular/router";
import { OrganizationalUnitService } from "../../_services/organizational-unit.service";
import { SubjectSettingsComponent } from "../../share-components/subject-settings/subject-settings.component";

@Component({
  selector: 'app-metadata',
  templateUrl: './metadata.component.html',
  styleUrls: ['./metadata.component.css']
})
export class MetadataComponent implements OnInit, OnDestroy {
  @ViewChild( ErrorMessageComponent, null ) errorMessage;
  @ViewChild('formDirective', null) formDirective: NgForm;
  @ViewChild( 'dynamicFormDirective', null ) dynamicForm: DynamicFormComponent;
  @Output('resetSummary') resetSummaryOutput = new EventEmitter();
  @ViewChild('subjectSettingsComponent' ) subjectSettingsComponent: SubjectSettingsComponent;

  private destroy: Subject<void> = new Subject();
  private destroyProcess$: Subject<void> = new Subject();
  private destroySeverities$: Subject<void> = new Subject();
  private currentOrganizationalUnitId: number = null;

  formConfig: FieldConfig[] = [];
  processMetadata: Array<any>;

  // /**
  //  * 1: internal
  //  * 2: external
  //  */
  subjectType: number;
  formGroup: FormGroup;
  subjectSeverities$: Observable<Array<SubjectSeverityModel>>;

  constructor(
      private summaryService: SummaryService,
      // private userData$: Store<UserDataReducer.State>,
      private processStore$: Store<ProcessReducer.State>,
      private fb: FormBuilder,
      private formBuilder: DynamicFormBuilder,
      private calendarService: CalendarService,
      private newSubject$: Store<NewSubjectReducer.State>,
      private store$: Store<NewSubjectReducer.State>,
      private activatedRoute: ActivatedRoute,
      private organizationalUnitService: OrganizationalUnitService
  ) { }

  ngOnInit() {
    this.store$.select(NewSubjectSelector.getCurrentOrganizationalUnitId)
        .pipe(takeUntil(this.destroy)).subscribe(id => {
          if (id === null) {
            return;
          }

          this.currentOrganizationalUnitId = id;
    });
    const configForm = {
      fromDate: [new Date().toISOString(), [Validators.required]],
      untilDate: ['', []],
      title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(250)]],
      severity: ['', [Validators.required]],
    };

    this.formGroup = this.fb.group(configForm);
    this.subjectSeverities$ = this.store$.select(NewSubjectSelector.getSeverities);
    this.changeSubjectType(1);
  }

  /**
   *
   */
  buildSubjectForm(){
    const processId = this.activatedRoute.parent.snapshot.paramMap.get('process_id');

    const router$ = this.processStore$
        .pipe(
            select(ProcessSelector.getProcesses),
            switchMap(process => {
              return process;
            }),
            filter(process =>{
              return process['id'] === parseInt(processId) ? true : false
            }) ,
            map((process) => {
              this.processMetadata = process;

              const metadata = process.metadata.filter(metadata => {
                if(this.isExternalSubject() && metadata.isExternal == 1) {
                  return metadata;
                }

                if (this.isInternalSubject() && metadata.isInternal == 1) {
                  return metadata;
                }
              });

              this.mapFieldsAndBuildForm(metadata);

              this.destroyProcess$.next();
            }),
            takeUntil(this.destroyProcess$)
        );

    router$.subscribe();
  }

  mapFieldsAndBuildForm(metadata){
    if(metadata === null || metadata === undefined)
      return 0;

    this.formConfig.splice(0,this.formConfig.length)

    this.formConfig = this.formBuilder.buildForm([], metadata);

    this.dynamicForm.fields = this.formConfig;

    this.dynamicForm.createControls();

    this.store$.dispatch(new NewSubjectActions.StoreProcessMetadata(metadata));
  }

  changeSubjectType(type: number): void {
    if (this.subjectType === type)
      return;

    this.subjectType = type;
    this.store$.dispatch(new NewSubjectActions.StoreSubjectType(type));
    this.store$.dispatch(new NewSubjectActions.ClearRecipients());

    this.changeSubjectForm();

    if (this.isInternalSubject()) {
      this.subjectSettingsComponent.enabled();
      this.getRecipientsForInternalSubject();
    } else {
      this.subjectSettingsComponent.enabled();
      this.getRecipientsForExternalSubject();
    }
  }

  getRecipientsForInternalSubject(): void{
    this.organizationalUnitService.getOrganizationalUnitAndUsers(this.currentOrganizationalUnitId).subscribe(
        response => {
          if(response.status){

            this.store$.dispatch(new NewSubjectActions.StoreOrganizationalUnits(response.organizationalUnit));

            this.store$.dispatch(new NewSubjectActions.StoreUsers(response.users));

          }else{
            this.errorMessage.setErrorMessage(response);
          }
        },
        error => {
          this.errorMessage.setErrorMessage(error);
        }
    );
  }

  getRecipientsForExternalSubject(): void {
    this.store$.dispatch(new NewSubjectActions.ClearOrganizationalUnitsAndUsers());

    this.organizationalUnitService.getExternalRecipients(this.currentOrganizationalUnitId).subscribe(
        response => {
          if (response['status']) {
            this.store$.dispatch(new NewSubjectActions.StoreOrganizationalUnits(response.organizationalUnits));
          } else {
            this.errorMessage.setErrorMessage(response);
          }
        },
        error => {
          console.error(error);
          this.errorMessage.setErrorMessage(error);
        }
    );
  }

  changeSubjectForm() {
    this.clearSubjectForm();
    this.buildSubjectForm();
  }

  getMetadata() {
    return this.dynamicForm.form.getRawValue();
  }

  isExternalSubject() {
    return this.subjectType === 2;
    // if(this.subjectRequest === undefined)
    //   return false;
  }

  isInternalSubject() {
    return this.subjectType === 1;
  }

  // getSubjectType(): string {
  //   switch (this.subjectType) {
  //     case 1: return 'internal';
  //     case 2: return 'external';
  //   }
  // }

  clearSubjectForm() {
    this.dynamicForm.empty();
  }

  setSubjectFinishDate(severity: SubjectSeverityModel, fromDate: Moment): void {
    if(severity === null || severity === undefined)
      return;

    const laborDay = this.calendarService.getNextWorkDay(severity.days, fromDate);

    this.formGroup.get('untilDate').setValue(laborDay);
  }

  get form() {
    return this.formGroup.controls;
  }

  fromDateMoment(date) {
    return moment(date);
  }

  isEnableDay = (d: Moment): boolean => {
    return this.calendarService.isLaborDay(d);
  }

  resetDefaultFields() {
    if(!this.formGroup)
      return;

    this.formGroup.reset();
    this.formGroup.get('fromDate').setValue(new Date().toISOString());
  }

  resetSummary() {
    this.resetSummaryOutput.emit();
  }

  isValid(): boolean {
    if(this.dynamicForm === undefined || this.dynamicForm.form === undefined)
      return false;

    return this.dynamicForm.isValid();
  }

  isValidDefaultFields(): boolean {
    if(this.formGroup === undefined)
      return false;

    return this.formGroup.valid;
  }

  getDefaultFieldsValue() {
    return this.formGroup.getRawValue();
  }

  storeMetadata() {
    this.store$.dispatch(new NewSubjectActions.StoreMetadataValues(this.getMetadata(), this.getDefaultFieldsValue()));
    this.store$.dispatch(new NewSubjectActions.SotoreSubjectSettings(this.subjectSettingsComponent.getFormValues()))
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroyProcess$.next();
    this.destroySeverities$.next();
  }

}
