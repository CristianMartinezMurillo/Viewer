import { NgModule } from "@angular/core";
import { InputComponent } from "./components/input/input.component"
import { ButtonComponent } from "./components/button/button.component";
import { SelectComponent } from "./components/select/select.component";
import { DateComponent } from "./components/date/date.component";
import { RadiobuttonComponent } from "./components/radiobutton/radiobutton.component";
import { CheckboxComponent } from "./components/checkbox/checkbox.component";
import { MaterialModule } from "./material.module";
import { SharedModule } from "./shared.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { CommonModule } from "@angular/common";
import { TextareaComponent } from "./components/textarea/textarea.component";
import { DynamicFormComponent } from "./components/dynamic-form/dynamic-form.component";
import { DynamicFieldDirective } from "./components/dynamic-field/dynamic-field.directive";

@NgModule({

    imports: [
        CommonModule,
        MaterialModule,
        FontAwesomeModule,
        SharedModule,
        MaterialModule
    ],

    exports: [
        DynamicFormComponent,
        DynamicFieldDirective
    ],
    declarations: [
         InputComponent,
         ButtonComponent,
         SelectComponent,
         DateComponent,
         RadiobuttonComponent,
         CheckboxComponent,
         TextareaComponent,
        DynamicFormComponent,
        DynamicFieldDirective
    ],/**Forms created dynamically*/
    entryComponents: [
         InputComponent,
         ButtonComponent,
         SelectComponent,
         DateComponent,
         RadiobuttonComponent,
         CheckboxComponent,
         TextareaComponent
    ]

})

export class DynamicformsModule {}