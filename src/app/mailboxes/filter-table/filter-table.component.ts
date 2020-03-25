import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SubjectRequestService } from "../../_services/subject-request.service";
import { ProcessService } from "../../_services/process.service";
import { DynamicFormBuilder } from "../../components/DynamicFormBuilder";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material";
import { SubjectService } from "../../_services/subject.service";
import { ErrorMessageComponent } from "../../messages/error-message/error-message.component";
import { Store } from "@ngrx/store";
import * as MailboxReducer from "../../_store/reducers/mailbox.reducer";
import * as MailboxActions from "../../_store/actions/mailbox.actions";
import * as MailboxSelector from "../../_store/selectors/mailbox.selector";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MetadataModel } from "../../_models/metadata.model";
import { ProcessModel } from "../../_models/process.model";
import { take } from "rxjs/operators";
import * as ProcessReducer from "../../_store/reducers/process.reducer";
import * as ProcessSelector from "../../_store/selectors/process.selector";

@Component({
  selector: 'app-filter-table',
  templateUrl: './filter-table.component.html',
  styleUrls: ['./filter-table.component.css']
})
export class FilterTableComponent implements OnInit, OnDestroy {
  @ViewChild(ErrorMessageComponent) errorMessage;

  formGroup: FormGroup;
  processes: Array<ProcessModel>;
  metadataArray: Array<MetadataModel>;

  constructor(
      private subjectRequestService: SubjectRequestService,
      private processService: ProcessService,
      private formBuilder: DynamicFormBuilder,
      private dialog: MatDialog,
      public dialogRef: MatDialogRef<FilterTableComponent>,
      private subjectService: SubjectService,
      private store$: Store<MailboxReducer.State>,
      private storeProcess$: Store<ProcessReducer.State>,
      @Inject(MAT_DIALOG_DATA) public subject,
      private fb: FormBuilder
  ) {
    this.formGroup = this.fb.group({
      process: new FormControl('', [Validators.required]),
      metadata: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.storeProcess$.select(ProcessSelector.getProcesses)
        .pipe(take(1))
        .subscribe(response => {
          console.log(response);
          this.processes = response;
          this.setSelectedFilters();
        }
    );
  }

  get form() {
    return this.formGroup.controls;
  }

  onChangeProcess(process: ProcessModel) {
    this.metadataArray = process.metadata;
  }

  applyFilters(): void {
    if(this.formGroup.invalid)
      return;

    this.store$.dispatch(new MailboxActions.StoreColumnFiltersSelected(this.formGroup.value));

    let response = Object.assign({}, this.formGroup.value);

    response['callback'] = 'applyFilters';

    this.dialogRef.close( response );
  }

  removeFilters() {
    let response = {callback: 'removeFilters'};

    this.dialogRef.close( response );
  }

  closeModal() {
    this.dialogRef.close();
  }

  valueChangeMetadataSelect() {
    // this.formGroup.get("metadata").setValue([this.formGroup.value.process.metadata[0]]);
  }

  setSelectedFilters() {
    this.store$.select(MailboxSelector.getColumnFiltersSelected)
        .pipe(take(1))
        .subscribe(response => {

          if(!response.hasOwnProperty('process'))
            return;

            this.formGroup.get('process').setValue(response['process']);
            this.metadataArray = response["process"]["metadata"];
            this.formGroup.get('metadata').setValue(response['metadata']);
        },
            error => {
          console.error(error);
            });
  }

  ngOnDestroy(): void {

  }
}
