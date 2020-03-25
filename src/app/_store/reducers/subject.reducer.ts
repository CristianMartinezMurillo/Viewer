import { Action } from '@ngrx/store'
import * as SubjectActions from './../actions/subject.actions'
import { SubjectFlowModel, SubjectRequestModel } from "../../_models/SubjectRequest.model";

export interface State {
    currentSubject: SubjectRequestModel,
    subjectFlow: { details: Array<SubjectFlowModel>, documents: Array<any> }
}

const initialState: State = {
    currentSubject: null,
    subjectFlow: null
};

export function reducer(state = initialState, action: SubjectActions.Actions) : any {

    switch(action.type) {
        case SubjectActions.CLEAR_SUBJECT:
            return {...initialState};
        case SubjectActions.STORE_CURRENT_SUBJECT:
            return {...state, currentSubject: action.subject};
        case SubjectActions.STORE_SUBJECT_FLOW:
            const subjectFlow = { details: action.subjectFlow, documents: action.documents };
            return {...state, subjectFlow: subjectFlow};
        case SubjectActions.ADD_TASK_ANSWER:
            let tasks = state.currentSubject.tasks.map(task => {
                if (task.id === action.task.id) {
                    return {...task, answers: task.answers.concat(action.answer)};
                }
                return task;
            });

            return {...state, currentSubject: {...state.currentSubject, tasks: tasks}};
        case SubjectActions.UPDATE_TASK_STATUS:
            tasks = state.currentSubject.tasks.map(task => {
                if (task.id === action.task.id) {
                    return {...task, completed: action.status};
                }
                return task;
            });

            return {...state, currentSubject: {...state.currentSubject, tasks: tasks}};
        case SubjectActions.ASSIGN_USER_TO_TASK:
            tasks = state.currentSubject.tasks.map(task => {
                if (task.id === action.task.id) {
                    return {...task, userAssigned: action.user};
                }
                return task;
            });

            return {...state, currentSubject: {...state.currentSubject, tasks: tasks}};
        case SubjectActions.ADD_SUBJECT_ANSWER:
            let subjectAnswers = (state.currentSubject.answers !== null) ? state.currentSubject.answers : [];

            return {...state, currentSubject: {...state.currentSubject, answers: subjectAnswers.concat(action.answer)}};
        case SubjectActions.ADD_SUBJECT_DOCUMENTS:
            let subjectDocuments = state.currentSubject.documents;
            return {...state, currentSubject: { ...state.currentSubject, documents: subjectDocuments.concat(action.documents) }}
        default:
            return {...state};
    }
}


