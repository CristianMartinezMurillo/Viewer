import { Action } from '@ngrx/store';

export const STORE_PROCESS                 = '[Mailbox] Store process';
export const CLEAR_ALL_PROCESS             = '[Mailbox] Clear all process';
export const STORE_COLUMN_FILTERS_SELECTED = '[Mailbox] Store column filters selected';
export const GET_COLUMN_FILTERS_SELECTED   = '[Mailbox] Get column filters selected';
export const CLEAR_COLUMN_FILTERS_SELECTED = '[Mailbox] Clear column filters selected';
export const CLEAR_MAILBOX_SUBJECTS        = '[Mailbox] Clear Mailbox Subjects';
export const STORE_MAILBOX_SUBJECTS        = '[Mailbox] Store Mailbox Subjects';
export const GET_MAILBOX_SUBJECTS          = '[Mailbox] GET Mailbox Subjects';
export const STORE_UNREAD_MAILBOX          = '[Mailbox] Store unread mailbox';
export const GET_UNREAD_MAILBOX            = '[Mailbox] Get unread mailbox';
export const ADD_COUNT_UNREAD_MAILBOX      = '[Mailbox] Add Count to unread mailbox';
export const SUBTRACT_COUNT_UNREAD_MAILBOX = '[Mailbox] Subtract Count to unread mailbox';
export const SET_CURRENT_ORGANIZATIONALUNITID = '[Mailbox] Set current organizational unit id';

export class StoreProcess implements  Action {
    readonly type = STORE_PROCESS;

    constructor(public payload) {}
}

export class ClearAllProcess implements  Action {
    readonly type = CLEAR_ALL_PROCESS;

    constructor() {}
}

export class StoreColumnFiltersSelected implements  Action {
    readonly type = STORE_COLUMN_FILTERS_SELECTED;

    constructor(public payload) {}
}

export class GetColumnFiltersSelected implements Action {
    readonly type = GET_COLUMN_FILTERS_SELECTED;

    constructor() {}
}

export class ClearColumnFiltersSelected implements Action {
    readonly type = CLEAR_COLUMN_FILTERS_SELECTED;

    constructor() {}
}

export class StoreMailboxSubjects implements Action {
    readonly type = STORE_MAILBOX_SUBJECTS;

    constructor(public payload) {}
}

export class GetMailboxSubjects implements Action {
    readonly type = GET_MAILBOX_SUBJECTS;

    constructor() {}
}

export class ClearMailboxSubjects implements Action {
    readonly type = CLEAR_MAILBOX_SUBJECTS;

    constructor() {}
}

export class StoreUnreadMailbox implements Action {
    readonly type = STORE_UNREAD_MAILBOX;

    constructor(public payload) {}
}

export class GetUnreadMailbox implements Action {
    readonly type = GET_UNREAD_MAILBOX;

    constructor() {}
}

export class AddUnreadMailbox implements Action {
    readonly type = ADD_COUNT_UNREAD_MAILBOX;

    constructor(public payload) {}
}

export class SubtractUnreadMailbox implements Action {
    readonly type = SUBTRACT_COUNT_UNREAD_MAILBOX;

    constructor(public payload) {}
}

export class SetCurrentOrganizationalUnitId implements Action {
    readonly type = SET_CURRENT_ORGANIZATIONALUNITID;

    constructor(public organizationalUnitId: number) {}
}

export type Actions = StoreProcess
    | ClearAllProcess
    | StoreColumnFiltersSelected
    | GetColumnFiltersSelected
    | ClearColumnFiltersSelected
    | ClearMailboxSubjects
    | StoreMailboxSubjects
    | GetMailboxSubjects
    | StoreUnreadMailbox
    | GetUnreadMailbox
    | AddUnreadMailbox
    | SubtractUnreadMailbox
    | SetCurrentOrganizationalUnitId;
