import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { MatTableDataSource } from "@angular/material";
import * as SubjectSelector from "../../_store/selectors/subject.selector";
import {takeUntil} from "rxjs/operators";
import {Store} from "@ngrx/store";
import * as SubjectReducer from "../../_store/reducers/subject.reducer";
import {Subject} from "rxjs";

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit, OnDestroy {
  @Input() subjectRequest;

  displayedColumns: string[] = ['documentName', 'uploadDate', 'userName', 'step'];
  dataSource = new MatTableDataSource([]);
  destroy: Subject<void> = new Subject();

  constructor(
      private store$: Store<SubjectReducer.State>,
  ) { }

  ngOnInit() {
    this.store$.select(SubjectSelector.getSubjectFlow).pipe(takeUntil(this.destroy)).subscribe(subjectFlow => {
      if (subjectFlow === null) {
        return;
      }

      const dataSource = subjectFlow.documents.map(document => {
        const step = document.step;
        const userName = document.userCreator.name;
        const uploadDate = document.created_at;
        const documentName = document.filename;
        return {
          documentName: documentName,
          uploadDate: uploadDate,
          userName: userName,
          step: step
        }
      });

      this.dataSource = new MatTableDataSource(dataSource);
    });
  }

  ngOnDestroy(): void {

  }
}
