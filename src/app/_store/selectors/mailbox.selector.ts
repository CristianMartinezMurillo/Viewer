import { createFeatureSelector, createSelector } from "@ngrx/store";
import { State } from "../reducers/index";


export const mailboxFeature = createFeatureSelector<State>('newSubject');

const getMailboxtate = createSelector(mailboxFeature, state => {
    return state.mailbox
});

export const getColumnFiltersSelected = createSelector(
    getMailboxtate,
    state => {
        return state.columnFiltersSelected
    }
);

export const getMailboxSubjects = createSelector(
    getMailboxtate,
    state => {
        return state.mailboxSubjects
    }
);

export const getMailboxUnread = createSelector(
    getMailboxtate,
    (state) => {
        return state.mailboxUnread
    }
);

export const getCurrentOrganizationalUnitId = createSelector(
    getMailboxtate,
    (state) => {
        return state.currentOrganizationalUnitId;
    }
);
