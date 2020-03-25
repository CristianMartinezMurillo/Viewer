import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { faSave } from "@fortawesome/free-solid-svg-icons/faSave";
import { SystemSettingsService } from "../../_services/system-settings.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NotifierComponent } from "../../notifier/notifier.component";
import { ErrorMessageComponent } from "../../messages/error-message/error-message.component";
import { isNullOrUndefined } from "util";
import { MatDialog, MatDialogConfig } from "@angular/material";
import { WarningConfirmationDialogComponent } from "../../dialog/warning-confirmation-dialog/warning-confirmation-dialog.component";
import { faEdit, faUndoAlt } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons/faEye";
import { EmailTemplateInterface } from "../EmailTemplate.interface";

@Component({
  selector: 'app-email-settings',
  templateUrl: './email-settings.component.html',
  styleUrls: ['./email-settings.component.css']
})
export class EmailSettingsComponent implements OnInit, OnChanges {
  @Input() emailTemplate : Array<EmailTemplateInterface>;
  @ViewChild(ErrorMessageComponent) errorMessage;
  @ViewChild( NotifierComponent ) notifier;

  disabledButton : boolean = false;
  formGroup : FormGroup;
  faSave = faSave;
  submitted : boolean = false;

  faEdit = faEdit;
  faView = faEye;
  faReset = faUndoAlt;

  constructor(
      private systemSettingsService : SystemSettingsService,
      private fb : FormBuilder,
      private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.formGroup = this.fb.group({});
  }

  initForm() {
    let config = {};

    for(let template of this.emailTemplate) {
      let key = template.code;
      config[key] = new FormControl('', [Validators.required]);
    }

    this.formGroup = this.fb.group(config);
  }

  get form() {
    return this.formGroup.controls;
  }

  setValues() {
    for (const template of this.emailTemplate){
      if(this.form.hasOwnProperty(template.code)){
        this.formGroup.controls[template.code].setValue(template.template);
      }
    }
  }

  saveChanges(template : EmailTemplateInterface) {
    this.submitted = true;


    // Object.keys(this.form).forEach(field => { // {1}
    //   const control = this.formGroup.get(field);            // {2}
    //   control.markAsTouched({ onlySelf: true });       // {3}
    // });

    // if(!this.formGroup.valid) {
    //   return 0;
    // }

    this.formGroup.get(template.code).markAsTouched();

    if(this.formGroup.get(template.code).value.length === 0)
      return 0;

    // let params = this.formGroup.value;
    let params = {code: template.code, value: this.formGroup.get(template.code).value}

    let dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {title: 'Confirmación', textContent: '¿Realmente desea modificar los templates de correo?'};
    dialogConfig.maxWidth = '300px';
    dialogConfig.panelClass = 'dialog-confirmation-class';

    const dialog = this.dialog.open(WarningConfirmationDialogComponent, dialogConfig);


    dialog.afterClosed().subscribe(userConfirmation => {
      if (!isNullOrUndefined(userConfirmation) && userConfirmation.confirmation) {
        this.disabledButton = true;

        this.systemSettingsService.modifyTemplate(params).subscribe(
            response => {
              this.disabledButton = false;

              if(response['status']) {
                this.notifier.show({
                  type: 'success',
                  message: 'Templates de correo actualizados'
                });
              } else {
                this.errorMessage.setErrorMessage(response);
              }
            },
            error => {
              this.errorMessage.setErrorMessage(error);
              this.disabledButton = false;
            }
        );
      }
    });



  }

  ngOnChanges(changes: SimpleChanges): void {

    if (isNullOrUndefined(changes.emailTemplate.currentValue))
      return;

    let self = this;

    this.emailTemplate.forEach(function(value, index) {
      self.emailTemplate[index].editMode = false;
    });

    this.initForm();
    this.setValues();

  }

  changeEditMode(index : number) {
    this.emailTemplate[index].template = this.formGroup.controls[this.emailTemplate[index].code].value;
    this.emailTemplate[index].editMode = !this.emailTemplate[index].editMode;
  }

  /**
   * reset the template setting the originalTemplate
   * @param index
   */
  resetTemplate(index : number, template : EmailTemplateInterface) {
    this.formGroup.controls[template.code].setValue(this.emailTemplate[index].originalTemplate);
    this.emailTemplate[index].template = this.emailTemplate[index].originalTemplate;
  }

}
