import { Action } from '@ngrx/store'
import * as AvanzarSubjectActions from './../actions/avanzar-subject.actions'

export interface State {
    organizationalUnits: Array<any>,
    users: Array<any>,
    recipients: Array<any>
}

const initialState: State = {
    organizationalUnits: [],
    users: [],
    recipients: []
};

export function reducer(state = initialState, action: AvanzarSubjectActions.Actions) : any {

    switch(action.type) {
        case AvanzarSubjectActions.ADD_RECIPIENTS:
            return {...state, recipients: state.recipients.concat(action.payload)};
        case AvanzarSubjectActions.CLEAR_ALL_RECIPIENTS:
            return {...state, recipients: []};
        case AvanzarSubjectActions.STORE_ORGANIZATIONAL_UNITS:
            return {...state, organizationalUnits: action.payload};
        case AvanzarSubjectActions.STORE_USERS:
            return {...state, users: action.payload};
        case AvanzarSubjectActions.CLEAR_ALL:
            return [];
        default:
            return state;
    }
}


