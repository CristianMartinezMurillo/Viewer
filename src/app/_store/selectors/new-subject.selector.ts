import { createFeatureSelector, createSelector } from "@ngrx/store";
import { State } from "../reducers";


export const newSubjectFeature = createFeatureSelector<State>('newSubject');

const getNewSubjectState = createSelector(newSubjectFeature, state => {
    return state.newSubject
});

export const getRecipients = createSelector(
    getNewSubjectState,
    state => {
        return state.recipients
    }
);

export const getRecipientsNode = createSelector(
    getNewSubjectState,
    state => {
        return state.recipients.nodesObject
    }
);

export const getUsers = createSelector(
    getNewSubjectState,
    state => {
        return state.users
    }
);


export const getOrganizationlUnits = createSelector(
    getNewSubjectState,
    (state) => {
        return state.organizationalUnits;
    }
);

export const getUsersAndOrganizationalUnits = createSelector(
    getUsers,
    getOrganizationlUnits,
    (users, organizationalUnits) => {
        return {users, organizationalUnits}
    }
);

export const getSeverities = createSelector(
    getNewSubjectState,
    (state) => {
        return state.severities;
    }
);

export const getCurrentOrganizationalUnitId = createSelector(
    getNewSubjectState,
    (state) => {
        return state.currentOrganizationalUnitId;
    }
);

export const getSubjectRequestData = createSelector(
    getNewSubjectState,
    (state) => {
        return state.subjectRequest;
    }
);

export const getMetadata = createSelector(
    getNewSubjectState,
    (state) => {
        return state.metadata;
    }
);

export const getSubjectType = createSelector(
    getNewSubjectState,
    (state) => {
        return state.subjectType
    }
);

export const getRecipientsAndSubjectType = createSelector(
    getSubjectType,
    getRecipients,
    (subjectType, recipients) => {
        return {subjectType, recipients}
    }

);

export const getSubjectSettings = createSelector(
    getNewSubjectState,
    (state) => {
        return state.subjectSettings;
    }
);

export const getDocuments = createSelector(
    getNewSubjectState,
    (state) => {
        return state.documents;
    }
);
