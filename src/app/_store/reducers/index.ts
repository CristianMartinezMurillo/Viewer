import { ActionReducer, ActionReducerMap, createFeatureSelector, createSelector, MetaReducer } from '@ngrx/store';
import { environment } from 'src/app/environments/environment'; // Angular CLI environment
import { storeFreeze } from 'ngrx-store-freeze';
import * as NewSubjectReducer  from '../reducers/new-subject.reducer';
import * as AvanzarSubjectReducer  from '../reducers/avanzar-subject.reducer';
import * as MailboxReducer  from '../reducers/mailbox.reducer';
import * as ProcessReducer  from './process.reducer';
import * as SubjectReducer  from './subject.reducer';

export interface State {
    newSubject: NewSubjectReducer.State,
    avanzarSubject : AvanzarSubjectReducer.State,
    mailbox : MailboxReducer.State,
    process: ProcessReducer.State,
    subject: SubjectReducer.State
}

export const reducers: ActionReducerMap<any> = {
    newSubject: NewSubjectReducer.reducer,
    avanzarSubject : AvanzarSubjectReducer.reducer,
    mailbox: MailboxReducer.reducer,
    process: ProcessReducer.reducer,
    subject: SubjectReducer.reducer
};

// console.log all actions
export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
    return function(state: State, action: any): State {
        return reducer(state, action);
    };
}

/**
 * By default, @ngrx/store uses combineReducers with the reducer map to compose
 * the root meta-reducer. To add more meta-reducers, provide an array of meta-reducers
 * that will be composed to form the root meta-reducer.
 */
export const metaReducers: MetaReducer<State>[] = !environment.production ? [logger, storeFreeze] : [];
