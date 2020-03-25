import { Component, OnInit } from "@angular/core";

import { FormGroup } from "@angular/forms";

import { FieldConfig } from "../../_models/field.interface";

@Component({

    selector: "app-input",

    templateUrl: './input.component.html',

    styles: []

})

export class InputComponent implements OnInit {

    field: FieldConfig;

    group: FormGroup;

    constructor() {}

    ngOnInit() {

    }

}
