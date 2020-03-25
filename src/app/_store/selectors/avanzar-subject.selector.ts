import { createFeatureSelector, createSelector } from "@ngrx/store";
import { State } from "../reducers";


export const avanzarSubjectFeature = createFeatureSelector<State>('newSubject');

const getNewSubjectState = createSelector(avanzarSubjectFeature, state => {
    return state.avanzarSubject
});

export const getSelectedAdressess = createSelector(
    getNewSubjectState,
    state => {
        return state.recipients
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
