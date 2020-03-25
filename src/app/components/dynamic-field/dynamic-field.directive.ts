import { ComponentFactoryResolver, ComponentRef, Directive, Input, OnInit, ViewContainerRef } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../../_models/field.interface"
import { InputComponent } from "../input/input.component";
import { ButtonComponent } from "../button/button.component";
import { SelectComponent } from "../select/select.component";
import { DateComponent } from "../date/date.component";
import { RadiobuttonComponent } from "../radiobutton/radiobutton.component";
import { CheckboxComponent } from "../checkbox/checkbox.component";
import { TextareaComponent } from "../textarea/textarea.component";

const componentMapper = {

    input: InputComponent,

    button: ButtonComponent,

    select: SelectComponent,

    date: DateComponent,

    radiobutton: RadiobuttonComponent,

    checkbox: CheckboxComponent,

    textarea: TextareaComponent,

};

@Directive({
  selector: '[dynamicField]'
})
export class DynamicFieldDirective implements OnInit {


    @Input() field: FieldConfig;

    @Input() group: FormGroup;

    componentRef: any;

    /**
     * The ComponentFactoryResolver will be used to resolve the component at run time.
     * This service contains resolveComponentFactory method which can be used to create a component at run time.
     * The ViewContainerRef to gain access to the view container of the element that will host the dynamically added component.
     * @param {ComponentFactoryResolver} resolver
     * @param {ViewContainerRef} container
     */
  constructor(
      private resolver: ComponentFactoryResolver,

      private container: ViewContainerRef
  ) { }

    ngOnInit() {
        /**
         * to create the component factory based on field type defined in the configuration.
         * @type {ComponentFactory<any>}
         */
        const factory = this.resolver.resolveComponentFactory(

            componentMapper[this.field.type]

        );

        /**
         * to create the component from the component factory.
         * @type {ComponentRef<any>}
         */
        this.componentRef = this.container.createComponent(factory);

        this.componentRef.instance.field = this.field;

        this.componentRef.instance.group = this.group;
    }

}
