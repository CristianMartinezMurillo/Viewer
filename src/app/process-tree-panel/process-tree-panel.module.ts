import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule             } from "../material.module"
import { SharedModule } from "../shared.module"
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ProcessTreeComponent } from "./process-tree.component";
import {TreeModule} from "angular-tree-component";

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        FontAwesomeModule,
        SharedModule,
        TreeModule.forRoot()
    ],
    exports: [
        ProcessTreeComponent
    ],
    declarations: [
        ProcessTreeComponent]
    ,
    entryComponents: [
        // DialogNewMetadataComponent,
    ]
})
export class ProcessTreePanelModule { }
