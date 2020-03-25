import { Component, OnInit } from "@angular/core";

import { FormGroup } from "@angular/forms";

import { FieldConfig } from "../../_models/field.interface";

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.css']
})
export class TextareaComponent implements OnInit {

    field: FieldConfig;

    group: FormGroup;

    constructor() {}

    ngOnInit() {

    }

}
