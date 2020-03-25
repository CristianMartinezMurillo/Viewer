export interface Validator {

    name: string;

    validator: any;

    message: string;

}

export interface FieldConfig {
    id?: number;

    label?: string;

    name?: string;

    inputType?: string;

    options?: string[];

    collections?: any;

    type: string;

    value?: any;

    validations?: Validator[];

}