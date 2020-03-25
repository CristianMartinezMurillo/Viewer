import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import * as shape from 'd3-shape';
import { isNullOrUndefined } from "util";
import { SubjectFlowModel}  from "../_models/SubjectRequest.model";
import { SubjectRequestService } from "../_services/subject-request.service";
import { Store } from "@ngrx/store";
import * as SubjectReducer from "../_store/reducers/subject.reducer";
import * as SubjectSelector from "../_store/selectors/subject.selector";
import * as SubjectActions from "../_store/actions/subject.actions";
import {filter, takeUntil} from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
    selector: 'app-subject-flow',
    templateUrl: './subject-flow.component.html',
    styleUrls: ['./subject-flow.component.css']
})
export class SubjectFlowComponent implements OnInit, OnDestroy {
    subjectFlow: SubjectFlowModel;
    destroy: Subject<void> = new Subject();

    constructor(
        private store$: Store<SubjectReducer.State>,
        private subjectRequest: SubjectRequestService
    ) {
    }

    ngOnInit() {
        this.store$.select(SubjectSelector.getCurrentSubject).pipe(
            takeUntil(this.destroy),
            filter(data => data !== null)
        ).subscribe(subjectRequest => {
            this.subjectRequest.getSubjectFlow(subjectRequest.id).subscribe(
                response => {
                    if (response['status']) {
                        this.store$.dispatch(new SubjectActions.StoreSubjectFlow(response.subjectFlow, response.documents));
                    } else {
                        console.error(response);
                    }
                }
            );
        });
    }
    ngOnDestroy(): void {
        this.destroy.next();
    }
}
