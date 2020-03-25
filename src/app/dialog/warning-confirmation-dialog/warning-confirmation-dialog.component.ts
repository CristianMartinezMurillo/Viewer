import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { faBan, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-warning-confirmation-dialog',
  templateUrl: './warning-confirmation-dialog.component.html',
  styleUrls: ['./warning-confirmation-dialog.component.css']
})
export class WarningConfirmationDialogComponent implements OnInit {
    title: String;
    textContent: String;
    faCancel = faBan
    faConfirm = faExclamationCircle;

    constructor(
        public dialogRef: MatDialogRef<WarningConfirmationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public dialogData
    ) {
        this.title = this.dialogData.title;
        this.textContent = this.dialogData.textContent;
    }

    ngOnInit() {
    }

    confirm() {
        this.dialogRef.close({confirmation: true});
    }

    cancel() {
        this.dialogRef.close({confirmation: false});
    }

}
