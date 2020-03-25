import * as NewSubjectActions from './../actions/new-subject.actions'
import { SubjectSeverityModel } from "../../_models/SubjectSeverityModel";

export interface State {
    organizationalUnits: Array<any>,
    users: Array<any>,
    recipients: {nodesObject: Array<any>, nodesTask: Array<any>, nodesData: Array<any>}
    recipientType: string;
    subjectType: number;
    severities: Array<SubjectSeverityModel>,
    currentOrganizationalUnitId: number,
    subjectRequest: any,
    metadata: { defaultFields: Array<any>, processFieldsValues: Array<any>, processFields: Array<any>},
    subjectSettings: Array<any>,
    documents: Array<any>
}

const initialState: State = {
    organizationalUnits: [],
    users: [],
    recipients: {nodesObject: [], nodesTask: [], nodesData: []},
    recipientType: null,
    subjectType: null,
    severities: [],
    currentOrganizationalUnitId: null,
    subjectRequest: null,
    metadata: {defaultFields: [], processFieldsValues: [], processFields: []},
    subjectSettings: [],
    documents: []
};

export function reducer(state = initialState, action: NewSubjectActions.Actions) : any  {

    switch(action.type) {
        case NewSubjectActions.ADD_RECIPIENTS:
            return {...state, recipients: state.recipients.nodesData.concat(action.payload)};
        case NewSubjectActions.STORE_RECIPIENTS:
            const recipients = {nodesObject: action.nodesObject, nodesTask: action.nodesTask, nodesData: action.nodesData};
            return {...state, recipients: recipients};
        case NewSubjectActions.STORE_RECIPIENT_TYPE:
            return {...state, recipientType: action.payload}
        case NewSubjectActions.STORE_SUBJECT_TYPE:
            return {...state, subjectType: action.subjectType};
        case NewSubjectActions.CLEAR_ALL_RECIPIENTS:
            return {...state, recipients: []};
        case NewSubjectActions.STORE_ORGANIZATIONAL_UNITS:
            return {...state, organizationalUnits: action.payload};
        case NewSubjectActions.STORE_USERS:
            return {...state, users: action.payload};
        case NewSubjectActions.CLEAR_ALL:
            return {...initialState};
        case NewSubjectActions.CLEAR_CREATING_SUBJECT_DATA:
            let initialStateCopy = {...initialState};
            delete initialStateCopy.severities;
            delete initialStateCopy.currentOrganizationalUnitId;
            delete initialStateCopy.subjectType;
            delete initialStateCopy.organizationalUnits;
            delete initialStateCopy.users;

            return {...state, ...initialStateCopy};
        case NewSubjectActions.STORE_METADATA_VALUES:
            let metadata = {...state.metadata, defaultFields: action.defaultFieldsValue, processFieldsValues: action.processFieldsValue};
            return {...state, metadata: metadata};
        case NewSubjectActions.STORE_SUBJECT_SETTINGS:
            return {...state, subjectSettings: action.subjectSettings};
        case NewSubjectActions.STORE_DOCUMENTS:
            return {...state, documents: action.documents}
        case NewSubjectActions.STORE_PROCESS_METADATA:
            let metadata_ = {...state.metadata};
            metadata_.processFields = action.processFields;
            metadata_.processFieldsValues = [];
            return {...state, metadata: metadata_};
        case NewSubjectActions.STORE_SEVERITIES:
            return {...state, severities: action.severities};
        case NewSubjectActions.SET_CURRENT_ORGANIZATIONALUNITID:
            return {...state, currentOrganizationalUnitId: action.organizationalUnitId};
        case NewSubjectActions.CLEAR_ORGANIZATIONAL_UNITS_AND_USERS:
            return {...state, organizationalUnits: [], users: []};
        default:
            return state;
    }
}


