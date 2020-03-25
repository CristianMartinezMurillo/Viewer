import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import {faCheckCircle} from "@fortawesome/free-solid-svg-icons";

export interface detailSubjectCreated{
  message: string;
  folio: string;
}

@Component({
  selector: 'app-subject-sent-dialog',
  templateUrl: './subject-sent-dialog.component.html',
  styleUrls: ['./subject-sent-dialog.component.css']
})
export class SubjectSentDialogComponent implements OnInit {
  detail: detailSubjectCreated;

  faCheckCircle = faCheckCircle;

  constructor(
      public dialogRef: MatDialogRef<SubjectSentDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public dialogData
  ) {
    this.detail = this.dialogData;
  }

  ngOnInit() {
  }

}
