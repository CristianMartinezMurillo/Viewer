import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from "@angular/material";
import { SubjectFlowModel, SubjectRequestModel } from "../../_models/SubjectRequest.model";
import { Store } from "@ngrx/store";
import * as SubjectReducer from '../../_store/reducers/subject.reducer';
import * as SubjectActions from '../../_store/actions/subject.actions';
import * as SubjectSelector from '../../_store/selectors/subject.selector';
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

export interface DetailsModel {
  sender: string;
  recipient: string;
  step: number;
  tasks: string;
  created_at: string;
}

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit, OnDestroy {
  subjectRequest: SubjectRequestModel;
  displayedColumns: string[] = ['created_at','step', 'sender', 'recipient', 'tasks'];
  dataSource: MatTableDataSource<DetailsModel>;
  destroy: Subject<void> = new Subject();

  constructor(
      private store$: Store<SubjectReducer.State>,
  ) { }

  ngOnInit() {
    this.store$.select(SubjectSelector.getSubjectFlow).pipe(takeUntil(this.destroy)).subscribe(subjectFlow => {

      if (subjectFlow === null) {
            return;
      }

      const dataSource = subjectFlow.details.map(data => {
        const created_at = data.created_at;
        const senderUserName = data.senderUser.name
            + ' ' + data.senderUser.last_name
            + ' ' +((data.senderUser.mothers_last_name === null) ? '' : data.senderUser.mothers_last_name);

        const sender = (data.senderUser !== null) ? `<p>${senderUserName}</p><p>${data.senderOrganizationalUnit.name}</p>`
            : data.senderOrganizationalUnit.name;

        const recipientUserName  = (data.destinUser !== null) ? data.destinUser.name
            + ' ' + data.destinUser.last_name
            + ' ' +((data.destinUser.mothers_last_name === null) ? '' : data.destinUser.mothers_last_name)
        : '';

        const recipient = (data.destinOrganizationalUnit !== null ) ? `<p>${recipientUserName}</p><p>${data.destinOrganizationalUnit.name}</p>`
            : `<p>${recipientUserName}</p>`;

        let tasks = '';

        if( data.destinOrganizationalUnit !== null) {
           data.destinOrganizationalUnit.tasks.map(task => {
             tasks += `<p>${task.description}</p>`;
          });
        }

        return {
          sender: sender,
          recipient: recipient,
          step: data.step,
          tasks: tasks,
          created_at: created_at
        };
      });

      this.dataSource = new MatTableDataSource(dataSource);
    });

  }

  ngOnDestroy(): void {
    this.destroy.next();
  }
}
