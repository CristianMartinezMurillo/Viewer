import { Action } from '@ngrx/store'
import * as MailboxActions from './../actions/mailbox.actions'
import { ProcessModel } from "../../_models/process.model";

export interface State {
    process: Array<ProcessModel>,
    columnFiltersSelected: Array<any>,
    mailboxSubjects: Array<any>,
    mailboxUnread: Array<any>,
    currentOrganizationalUnitId: number
}

const initialState: State = {
    process: [],
    columnFiltersSelected: [],
    mailboxSubjects: [],
    mailboxUnread: [],
    currentOrganizationalUnitId: null
};

export function reducer(state = initialState, action: MailboxActions.Actions) : any {

    switch(action.type) {
        case MailboxActions.STORE_PROCESS:
            return {...state, process: action.payload};
        case MailboxActions.CLEAR_ALL_PROCESS:
            return {...state, process: []};
        case MailboxActions.STORE_COLUMN_FILTERS_SELECTED:
            return {...state, columnFiltersSelected: action.payload};
        case MailboxActions.GET_COLUMN_FILTERS_SELECTED:
            return {...state.columnFiltersSelected};
        case MailboxActions.CLEAR_COLUMN_FILTERS_SELECTED:
            return {...state, columnFiltersSelected: []};
        case MailboxActions.STORE_MAILBOX_SUBJECTS:
            return {...state, mailboxSubjects: action.payload};
        case MailboxActions.GET_MAILBOX_SUBJECTS:
            return {...state.mailboxSubjects};
        case MailboxActions.CLEAR_MAILBOX_SUBJECTS:
            return {...state, mailboxSubjects: []};
        case MailboxActions.STORE_UNREAD_MAILBOX:
            return {...state, mailboxUnread: action.payload};
        case MailboxActions.GET_UNREAD_MAILBOX:
            return {...state.mailboxUnread};
        case MailboxActions.ADD_COUNT_UNREAD_MAILBOX:
            const mailbox = action.payload;

            if (state.mailboxUnread.hasOwnProperty(mailbox)) {
                const total = parseInt(state.mailboxUnread[mailbox]);
                let mailboxUnread = {...state.mailboxUnread};

                mailboxUnread[mailbox] =  total + 1;

                return {...state, mailboxUnread: mailboxUnread};
            } else {
                return {...state}
            }
        case MailboxActions.SUBTRACT_COUNT_UNREAD_MAILBOX:
            const submailbox = action.payload;

            if (state.mailboxUnread.hasOwnProperty(submailbox)) {
                const total = parseInt(state.mailboxUnread[submailbox]);
                let mailboxUnread = {...state.mailboxUnread};
                let total_ = ((total - 1) < 0 ) ? 0 : total - 1;

                mailboxUnread[submailbox] = total_;

                return {...state, mailboxUnread: mailboxUnread};
            } else {
                return {...state.mailboxUnread}
            }
        case MailboxActions.SET_CURRENT_ORGANIZATIONALUNITID:
            return {...state, currentOrganizationalUnitId: action.organizationalUnitId};
        default:
            return {...state};
    }
}


