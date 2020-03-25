import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FieldConfig} from "../../_models/field.interface";
import { CalendarService} from "../../_services/CalendarService";
import { DynamicFormBuilder} from "../../components/DynamicFormBuilder";
import { SummaryService} from "../../_services/SummaryService";
import { DynamicFormComponent} from "../../components/dynamic-form/dynamic-form.component";
import { Store } from "@ngrx/store";
import * as NewSubjectReducer from "../../_store/reducers/new-subject.reducer";
import * as NewSubjectActions from "../../_store/actions/new-subject.actions";
import * as NewSubjectSelector from "../../_store/selectors/new-subject.selector";
import { take, takeUntil, filter } from "rxjs/operators";
import * as moment from 'moment';
import { Subject } from "rxjs";
import * as ReceptionType from '../../_constants/ReceptionType.constants';
import { SubjectSettingsComponent } from "../../share-components/subject-settings/subject-settings.component";

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit, OnDestroy {
  @ViewChild('dynamicFormComponent', null) dynamicFormComponent: DynamicFormComponent;
  @ViewChild('subjectSettingsComponent', null) subjectSettingsComponent: SubjectSettingsComponent;

  selectedRecipients: Array<any>;
  formGroup: FormGroup;
  formConfig: FieldConfig[] = [];
  subjectPeriodFormat: string = 'YYYY-MM-DD';
  destroy: Subject<void> = new Subject();
  subjectType: number;
  subjectDocuments: Array<any>;

  constructor(
      private calendarService: CalendarService,
      private formBuilder: DynamicFormBuilder,
      private summaryService: SummaryService,
      private fb: FormBuilder,
      private store$: Store<NewSubjectReducer.State>,
  ) { }

  ngOnInit() {
    const self = this;
    const configForm = {
      fromDate: [new Date().toISOString(), [Validators.required]],
      untilDate: ['', []],
      title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(250)]],
      severity: ['', [Validators.required]],
    };

    this.formGroup = this.fb.group(configForm);

    this.store$.select(NewSubjectSelector.getMetadata)
        .pipe(takeUntil(this.destroy))
        .subscribe(metadata => {
          console.log(metadata);

          if (Object.keys(metadata.processFieldsValues).length == 0 || Object.keys(metadata.defaultFields).length == 0
              || Object.keys(metadata.processFields).length == 0 )
              return;

          this.buildSummary(metadata.processFields);

          self.resetForms();

          const processFields = metadata.processFieldsValues;
          const defaultFields = metadata.defaultFields;

          Object.keys(processFields).forEach(  key => {
            const value = processFields[key];
            const control = self.dynamicFormComponent.form.get(key);
            if (control) {
                control.setValue(value);
            }
          });

          Object.keys(defaultFields).forEach(key => {
            let value = defaultFields[key];

            if (key === 'fromDate' || key === 'untilDate') {
              value = moment(value).format(this.subjectPeriodFormat)
            }

            if(key === 'severity') {
              value = value['name'];
            }

            self.formGroup.get(key).setValue(value);
          });
        });

    this.store$.select(NewSubjectSelector.getSubjectSettings)
        .pipe(
            filter(data => data !== null),
            takeUntil(this.destroy)
        )
        .subscribe(data => {
            this.subjectSettingsComponent.setDataValue(data);
            this.subjectSettingsComponent.disabled();
        });

    this.store$.select(NewSubjectSelector.getRecipientsAndSubjectType)
        .pipe(
            filter(data => data !== null),
            takeUntil(this.destroy)
        )
        .subscribe(data => {
            self.selectedRecipients = data.recipients.nodesObject;
            self.subjectType = data.subjectType;
        });

    this.store$.select(NewSubjectSelector.getDocuments)
        .pipe(
            filter(data => data !== null),
            takeUntil(this.destroy)
        )
        .subscribe(documents => {
            self.subjectDocuments = documents;
        });

  }

  private isInternal(): boolean {
      return this.subjectType === 1;
  }

  private isExternal(): boolean {
      return this.subjectType === 2;
  }

  private buildSummary(metadata): void {
    this.formConfig.splice(0,this.formConfig.length);

    this.formConfig = this.formBuilder.buildForm([], metadata);

    this.dynamicFormComponent.fields = this.formConfig;

    this.dynamicFormComponent.createControls();
  }

  private resetForms(): void {
    if(this.formGroup) {
        this.formGroup.reset();
    }

    this.dynamicFormComponent.reset();
  }

   /**
     *
     * @param recipient
     */
   private getReceptionType(recipient): string {
       if ( recipient.TURNAR === true || recipient.TURNAR === 1) {
           return ReceptionType.TURNAR;
       }

       if (recipient.CC === true || recipient.CC === 1) {
           return ReceptionType.CC;
       }

       if (recipient.CCC === true || recipient.CCC === 1) {
           return ReceptionType.CCC;
       }

       return "";
   }

  ngOnDestroy(): void {
    this.destroy.next();
  }
}
