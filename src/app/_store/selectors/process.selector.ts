import { createFeatureSelector, createSelector } from "@ngrx/store";
import { State } from "../reducers/";


export const newSubjectFeature = createFeatureSelector<State>('newSubject');

const getProcessState = createSelector(newSubjectFeature, state => {
    return state.process
});


export const getProcesses = createSelector(
    getProcessState,
    state => {
        return state.list
    }
);
