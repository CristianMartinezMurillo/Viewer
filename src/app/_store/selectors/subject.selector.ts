import { createFeatureSelector, createSelector } from "@ngrx/store";
import { State } from "../reducers/";


export const newSubjectFeature = createFeatureSelector<State>('newSubject');

const getState = createSelector(newSubjectFeature, state => {
    return state.subject
});


export const getCurrentSubject = createSelector(
    getState,
    state => {
        return state.currentSubject
    }
);

export const getSubjectFlow = createSelector(
    getState,
    state => {
        return state.subjectFlow;
    }
);

export const getSubjectTasks = createSelector(
    getCurrentSubject,
    state => {
        if (state === null)
            return [];
        return state.tasks;
    }
);

export const getSubjectAnswers = createSelector(
    getCurrentSubject,
    state => {
        if (state === null)
            return [];
        return state.answers;
    }
);

export const getSubjectDocuments = createSelector(
    getCurrentSubject,
    state => {
        if (state === null)
            return [];
        return state.documents;
    }
);

export const getSubjectRecipients = createSelector(
    getCurrentSubject,
    state => {
        if (state === null)
            return [];
        return state.recipients;
    }
);
