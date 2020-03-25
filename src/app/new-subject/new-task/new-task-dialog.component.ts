import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, FormGroup, Validators} from "@angular/forms";
import { ErrorMessageComponent } from "../../messages/error-message/error-message.component";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons/faPlusCircle";
import { faBan, faPlus } from "@fortawesome/free-solid-svg-icons";
import { faTasks } from "@fortawesome/free-solid-svg-icons/faTasks";

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task-dialog.component.html',
  styleUrls: ['./new-task-dialog.component.css']
})
export class NewTaskDialogComponent implements OnInit {
    faAdd = faPlusCircle;
    faPlus = faPlus;
    faCancel = faBan;
    faTask = faTasks;

    formGroup: FormGroup;

    title;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<NewTaskDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public activeNode
    ) {
        this.title = 'Nueva instrucción a ' + this.activeNode.data.name;
    }

  ngOnInit() {
      this.formGroup = this.fb.group({
          description:        ['', [Validators.required]],
      });
  }

    public getSerializeFormData(){
        return this.formGroup.value;
    }

    // convenience getter for easy access to form fields
    get form() { return this.formGroup.controls; }

  onSubmit(){
      Object.keys(this.formGroup.controls).forEach(field => { // {1}
          const control = this.formGroup.get(field);            // {2}
          console.log(control);
          control.markAsTouched({ onlySelf: true });       // {3}
      });

      // stop here if form is invalid
      if (this.formGroup.invalid) {
          return;
      }

      let serialized = this.getSerializeFormData();

      serialized.status = true;
      /**
       * this object is returned
       * {
       *    description: "subject description"
       * }
       */
      this.dialogRef.close(serialized);
  }

}
