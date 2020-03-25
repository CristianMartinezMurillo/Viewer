import { Action } from '@ngrx/store';
import { SubjectSeverityModel } from "../../_models/SubjectSeverityModel";

export const ADD_RECIPIENTS             = '[New Subject] Add'
export const CLEAR_ALL_RECIPIENTS       = '[New Subject] Clear all recipientOptions'
export const STORE_ORGANIZATIONAL_UNITS = '[New Subject] Store Organizational Units';
export const STORE_USERS                = '[New Subject] Store users';
export const CLEAR_ALL                  = '[New Subject] Clear all';
export const CLEAR_CREATING_SUBJECT_DATA= '[New Subject] Clear Creating Subject Data';
export const STORE_SEVERITIES           = '[New Subject] Store Severities';
export const SET_CURRENT_ORGANIZATIONALUNITID = '[New Subject] Set current organizational unit id';
export const STORE_METADATA_VALUES      = '[New Subject] Store Metadata Values';
export const STORE_RECIPIENT_TYPE       = '[New Subject] Store Recipient Type';
export const STORE_RECIPIENTS           = '[New Subject] Store Recipients';
export const STORE_SUBJECT_TYPE         = '[New Subject] Store SubjectType';
export const STORE_PROCESS_METADATA     = '[New Subject] Store Process Metadata';
export const CLEAR_ORGANIZATIONAL_UNITS_AND_USERS = '[New Subject] Clear Organizational Unit And Users';
export const STORE_SUBJECT_SETTINGS     = '[New Subject] Store Subject Settings';
export const STORE_DOCUMENTS            = '[New Subject] Store Documents';
export class AddRecipientActions implements Action {
    readonly type = ADD_RECIPIENTS;

    constructor(public payload ) {}
}

export class StoreRecipients implements Action {
    readonly type = STORE_RECIPIENTS;

    constructor(public nodesObject, public nodesTask ,public nodesData) {}
}

export class StoreSubjectType implements Action {
    readonly type = STORE_SUBJECT_TYPE;
    constructor(public subjectType: number) {}
}

export class ClearRecipients implements Action {
    readonly type = CLEAR_ALL_RECIPIENTS;

    constructor() {}
}

export class StoreOrganizationalUnits implements Action {
    readonly type = STORE_ORGANIZATIONAL_UNITS;

    constructor(public payload) {}
}

export class StoreUsers implements  Action {
    readonly type = STORE_USERS;

    constructor(public payload) {}
}

export class ClearAll implements  Action {
    readonly type = CLEAR_ALL;

    constructor() {}
}

export class ClearCreatingSubjectData implements Action {
    readonly type = CLEAR_CREATING_SUBJECT_DATA;
    constructor() {}
}

export class StoreSeverities implements  Action {
    readonly type = STORE_SEVERITIES;

    constructor(public severities: Array<SubjectSeverityModel>) {}
}

export class SetCurrentOrganizationalUnitId implements  Action {
    readonly type = SET_CURRENT_ORGANIZATIONALUNITID;

    constructor(public organizationalUnitId: number) {}
}

export class StoreMetadataValues implements Action {
    readonly type = STORE_METADATA_VALUES;

    constructor(public processFieldsValue: Array<any>, public defaultFieldsValue: Array<any>) {}
}

export class SotoreSubjectSettings implements Action {
    readonly type = STORE_SUBJECT_SETTINGS;

    constructor(public subjectSettings: Array<any>) {}
}

export class StoreDocuments implements Action {
    readonly type = STORE_DOCUMENTS;
    constructor(public documents: Array<any>) {}
}

export class StoreProcessMetadata implements Action {
    readonly type = STORE_PROCESS_METADATA;
    constructor(public processFields: Array<any>) {}
}

export class StoreRecipientType implements Action {
    readonly type = STORE_RECIPIENT_TYPE;

    constructor(public payload: string) {}
}

export class ClearOrganizationalUnitsAndUsers implements Action {
    readonly type = CLEAR_ORGANIZATIONAL_UNITS_AND_USERS;
    constructor() {}
}


export type Actions = AddRecipientActions
    | ClearRecipients
    | StoreOrganizationalUnits
    | StoreUsers
    | ClearAll
    | ClearCreatingSubjectData
    | StoreSeverities
    | SetCurrentOrganizationalUnitId
    | StoreMetadataValues
    | StoreRecipientType
    | StoreRecipients
    | StoreSubjectType
    | StoreProcessMetadata
    | ClearOrganizationalUnitsAndUsers
    | SotoreSubjectSettings
    | StoreDocuments;
