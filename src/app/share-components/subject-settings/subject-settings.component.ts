import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-subject-settings',
  templateUrl: './subject-settings.component.html',
  styleUrls: ['./subject-settings.component.css']
})
export class SubjectSettingsComponent implements OnInit {
  formGroup : FormGroup;

  constructor(
      private fb : FormBuilder
  ) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      onlyTitular: new FormControl(false, []),
    });
  }

  get form () {
    return this.formGroup.controls;
  }

  getFormValues() {
    return this.formGroup.value;
  }

  disabled(): void {
    if (this.formGroup === undefined) {
      return;
    }

    this.formGroup.disable();
  }

  enabled(): void {
    if (this.formGroup === undefined) {
      return;
    }

    this.formGroup.enable();
  }

  setDataValue(data) {
    Object.keys(data).map(fieldName => {
      const control = this.formGroup.get(fieldName);

      if (control !== null) {
        control.setValue(data[fieldName]);
      }
    });
  }

}
