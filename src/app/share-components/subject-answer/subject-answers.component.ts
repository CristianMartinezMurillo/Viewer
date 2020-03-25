import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from "@ngrx/store";
import * as SubjectReducer from '../../_store/reducers/subject.reducer';
import * as SubjectActions from '../../_store/actions/subject.actions';
import * as SubjectSelec from '../../_store/selectors/subject.selector';
import { Observable, Subject } from "rxjs";
import { SubjectAnswerModel } from "../../_models/SubjectRequest.model";

@Component({
  selector: 'app-subject-answers',
  templateUrl: './subject-answers.component.html',
  styleUrls: ['./subject-answers.component.css']
})
export class SubjectAnswersComponent implements OnInit, OnDestroy {
  answers: Observable<Array<SubjectAnswerModel>>;

  constructor(
      private subject$: Store<SubjectReducer.State>,
  ) { }

  ngOnInit() {
    this.answers = this.subject$.select(SubjectSelec.getSubjectAnswers);
  }

  ngOnDestroy(): void {

  }

}
