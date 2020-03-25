import { Component, OnInit } from "@angular/core";

import { FormGroup } from "@angular/forms";

import { FieldConfig } from "../../_models/field.interface";

@Component({

    selector: "app-date",

    templateUrl: './date.component.html',

    styles: []

})

/**
     date.toDateString() = Mon Jul 30 2016
     date.toGMTString() = Sun, 29 Jul 2016 22:00:00 GMT
     date.toISOString() = 2016-07-29T22:00:00.000Z
     date.toLocaleDateString() = 30/07/2016
     date.toLocaleString() = 30/07/2016 à 00:00:00
 */
export class DateComponent implements OnInit {

    field: FieldConfig;

    group: FormGroup;

    constructor() {}

    ngOnInit() {}

}
