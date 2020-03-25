import { Action } from '@ngrx/store';

export const ADD_RECIPIENTS             = '[Avanzar Subject] Add'
export const CLEAR_ALL_RECIPIENTS       = '[Avanzar Subject] Clear all recipientOptions'
export const STORE_ORGANIZATIONAL_UNITS = '[Avanzar Subject] Store Organizational Units';
export const STORE_USERS                = '[Avanzar Subject] Store users';
export const CLEAR_ALL                  = '[Avanzar Subject] Clear all';

export class AddRecipientActions implements Action {
    readonly type = ADD_RECIPIENTS;

    constructor(public payload ) {}
}

export class ClearAllRecipientsAction implements Action {
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

export type Actions = AddRecipientActions
    | ClearAllRecipientsAction
    | StoreOrganizationalUnits
    | StoreUsers
    | ClearAll;
