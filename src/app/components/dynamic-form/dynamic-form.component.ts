import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { FieldConfig } from "../../_models/field.interface"

/**
    Json example configuration that you can use for create dynamic forms
    check muck.ts
 */

@Component({
  selector: 'dynamic-form',
    templateUrl: './dynamic-form.component.html',
  styles: []
})
export class DynamicFormComponent implements OnInit {
    /**
     * fields of type FieldConfig that accept a configuration array from parent component.
     * @type {Array}
     */
    @Input() fields: FieldConfig[] = [];

    /**
     * submit of type EventEmitter<any> it will notify the parent component when the form is submitted.
     * @type {EventEmitter<any>}
     */
    @Output() submit: EventEmitter<any> = new EventEmitter<any>();

    @Input() disableForm : boolean = false;
    /**
     * form of type FormGroup it aggregates the values of each child FormControl .
     */
    form: FormGroup;

  constructor(
      private fb: FormBuilder
  ) { }

  ngOnInit() {

  }

  public createControls(){
      this.form = this.addControls();

      if(this.disableForm)
          this.form.disable();
  }

    get value() {

        return this.form.value;

    }

    public isValid(){
      return this.form.valid;
    }

    /**
     *  It loops through the configuration fields and creates a control for each field with validations and then
     *  add these dynamically created controls to the form group.
     * @returns {FormGroup}
     */
    private addControls() {
        const group = this.fb.group({});

        this.fields.forEach(field => {

            if (field.type === "button") return;

            let fieldValue = (field.type === 'date') ? ((field.value === null || field.value === undefined) || field.value === '') ? '' : new Date(field.value).toISOString() : field.value;

            const control = this.fb.control(

                fieldValue,

                this.bindValidations(field.validations || [])

            );

            group.addControl(field.name, control);

        });

        return group;

    }

    /**
     * add validations to dynamic control.
     * @param validations
     * @returns {any}
     */
    private bindValidations(validations: any) {

        if (validations.length > 0) {

            const validList = [];

            validations.forEach(valid => {

                validList.push(valid.validator);

            });

            return Validators.compose(validList);

        }

        return null;

    }

    public markFieldsAsTouched() {

        Object.keys(this.form.controls).forEach(field => {

            const control = this.form.get(field);

            control.markAsTouched({ onlySelf: true });

        });

    }

    public getFieldsAndValues(){
        let self = this;
        let fields = [];
        this.fields.forEach(function(field, index){

            if(field.type === 'button')
                return;

            const value = self.form.get(field.name).value;

            if (field.type === 'textarea' && ((value === null || value === undefined) || value == '')) {
                self.form.get(field.name).setValue(' ');
            }

            let data = {
                id: field.id,
                value: value
            };

            fields.push(data);
        });

        return fields;
    }

    public empty() {
        this.form = this.fb.group({});
        this.fields = [];
    }

    public reset(){
        if(this.form !== undefined)
            this.form.reset();
    }

}
