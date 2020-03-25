import { Component, OnInit, ViewChild } from '@angular/core';
import { SubjectService } from '../../_services/subject.service';
import { UploadFileComponent } from '../../share-components/upload-file/upload-file.component';
import { Store } from '@ngrx/store';
import * as SubjectReducer from '../../_store/reducers/subject.reducer';
import * as SubjectSelec from '../../_store/selectors/subject.selector';
import { SubjectRequestModel } from "../../_models/SubjectRequest.model";
import { filter, take } from "rxjs/operators";
import { ErrorMessageComponent } from "../../messages/error-message/error-message.component";
import * as SubjectActions from '../../_store/actions/subject.actions';
import { faBan } from "@fortawesome/free-solid-svg-icons/faBan";
import { faUpload } from "@fortawesome/free-solid-svg-icons/faUpload";
import { MatDialogRef } from "@angular/material";

@Component({
  selector: 'app-add-attachments-subject',
  templateUrl: './add-attachments-subject.component.html',
  styleUrls: ['./add-attachments-subject.component.css']
})
export class AddAttachmentsSubjectComponent implements OnInit {
  @ViewChild(UploadFileComponent, null) uploadFileComponent: UploadFileComponent;
  @ViewChild(ErrorMessageComponent, null) errorMessageComponent: ErrorMessageComponent;

  faCancel = faBan;
  faUpload = faUpload;
  subjectRequest: SubjectRequestModel;
  loading: boolean = false;

  constructor(
      private subjectService: SubjectService,
      private subject$: Store<SubjectReducer.State>,
      public dialogRef: MatDialogRef<AddAttachmentsSubjectComponent>,
  ) { }

  ngOnInit() {
    this.subject$.select(SubjectSelec.getCurrentSubject)
        .pipe(
            take(1),
            filter(data => data !== null)
        )
        .subscribe(subject => {
          this.subjectRequest = subject;
    });
  }

  upload(): void {
    if (! (this.uploadFileComponent.getDocumentsList().length > 0 )) {
      return;
    }

    this.enableLoading();

    const attachments = this.uploadFileComponent.getFilesForm();

    this.subjectService.addSubjectAttachments(this.subjectRequest.destinatario.id, attachments).subscribe(
        response => {
          console.log(response);
          this.disableLoading();
          if (response['status']) {

            this.subject$.dispatch(new SubjectActions.AddSubjectDocuments(response['documents']));

            this.dialogRef.close();
          } else {
            this.errorMessageComponent.setErrorMessage(response);
          }
        }, error => {
          this.disableLoading();
          this.errorMessageComponent.setErrorMessage(error);
        }
    );
  }

  private enableLoading(): void {
    this.loading = true;
  }

  private disableLoading(): void {
    this.loading = false;
  }

}
