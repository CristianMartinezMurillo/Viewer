import { Injectable } from '@angular/core';
import { Validators } from "@angular/forms";
import { MetadataModel } from "../_models/metadata.model";

@Injectable({
    providedIn: 'root'
})
export class DynamicFormBuilder{
    buildForm(form, metadata: Array<MetadataModel>) {
        for(let field of metadata) {
            let fieldType = field.catDataType.field_name;

            if( fieldType === 'string'){
                form.push(this.stringField(field));
            }

            if( fieldType === 'text'){

                form.push(this.textField(field));
            }

            if(fieldType === 'dateTime') {
                form.push(this.dateTimeField(field));
            }

            if(fieldType === 'catalog') {
                form.push(this.catalogField(field));
            }
        }

        return form;
    }

    /**
     *
     * @param field
     */
    private stringField(field: MetadataModel) {
        let validations = [];

        if(field.required){
            validations.push(
                {
                    name: "required",
                    validator: Validators.required,
                    message: field.field_name_text + " requerido"
                }
            );
        }

        if(field.max_length > 0) {
            validations.push({
                name: "maxlength",
                validator: Validators.maxLength(field.max_length),
                message: field.field_name_text + " requiere máximo " + field.max_length + " caracteres"
            });
        }

        if(field.min_length > 0) {
            validations.push({
                name: "minlength",
                validator: Validators.minLength(field.min_length),
                message: field.field_name_text + " requiere mínimo " + field.min_length + " caracteres"
            });
        }

        return {
            id: field.id,
            type: "input",
            label: field.field_name_text,
            inputType: "text",
            name: field.field_name,
            value: field.value,
            validations: validations
        };
    }

    /**
     *
     * @param field
     */
    private textField(field: MetadataModel) {
        let validations = [];

        if(field.required){
            validations.push(
                {
                    name: "required",
                    validator: Validators.required,
                    message: field.field_name_text + " requerido"
                }
            );
        }

        if(field.max_length > 0) {
            validations.push({
                name: "maxlength",
                validator: Validators.maxLength(field.max_length),
                message: field.field_name_text + " requiere maximo " + field.max_length + " caracteres"
            });
        }

        if(field.min_length > 0) {
            validations.push({
                name: "minlength",
                validator: Validators.minLength(field.min_length),
                message: field.field_name_text + " requiere mínimo " + field.min_length + " caracteres"
            });
        }

        return {
            id: field.id,
            type: "textarea",
            label: field.field_name_text,
            inputType: "text",
            name: field.field_name,
            value: field.value,
            validations: validations
        };
    }

    /**
     *
     * @param field
     */
    private dateTimeField(field: MetadataModel) {
        let validations = [];

        if(field.required){
            validations.push(
                {
                    name: "required",
                    validator: Validators.required,
                    message: field.field_name_text + " requerido"
                }
            );
        }

        // validations.push(
        //     {
        //         name: "pattern",
        //         validator: Validators.pattern('^(?:(?:31(\\/|-|\\.)(?:0?[13578]|1[02]))\\1|(?:(?:29|30)(\\/|-|\\.)(?:0?[1,3-9]|1[0-2])\\2))(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$|^(?:29(\\/|-|\\.)0?2\\3(?:(?:(?:1[6-9]|[2-9]\\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\\d|2[0-8])(\\/|-|\\.)(?:(?:0?[1-9])|(?:1[0-2]))\\4(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$'),
        //         message: 'fecha inválida'
        //     }
        // );

        return {
            id: field.id,
            type: "date",
            label: field.field_name_text,
            name: field.field_name,
            validations: validations,
            value: field.value,
            // value: {value: '', disabled:true}
        };
    }

    private catalogField(field: MetadataModel) {
        let validations = [];

        const value = parseInt(field.value) > 0 ? parseInt(field.value) : '';

        validations.push(
            {
                name: "required",
                validator: Validators.required,
                message: field.field_name_text + " requerido"
            }
        );

        return {
            id: field.id,
            type: "select",
            label: field.field_name_text,
            name: field.field_name,
            options: field.catalogData,
            validations: validations,
            value: value,
        };
    }
}
