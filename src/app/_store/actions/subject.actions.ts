import { Action } from '@ngrx/store';
import { SubjectFlowModel, SubjectRequestModel } from "../../_models/SubjectRequest.model";
import { TaskModel } from "../../share-components/_models/task.model";
import { DocumentModel } from "../../_models/Document.model";

export const CLEAR_SUBJECT          = '[Subject] Clear Subject';
export const STORE_CURRENT_SUBJECT  = '[Subject] Store Current Subject';
export const STORE_SUBJECT_FLOW     = '[Subject] Store Subject Flow';
export const ADD_TASK_ANSWER        = '[Subject] Add Task Answer';
export const UPDATE_TASK_STATUS     = '[Subject] Update Task Status';
export const ASSIGN_USER_TO_TASK    = '[Subject] Assign User To Task';
export const ADD_SUBJECT_ANSWER     = '[Subject] Add Subject Answer';
export const ADD_SUBJECT_DOCUMENTS  = '[Subject] Add Subject Documents';
export class ClearSubject implements Action {
    readonly type = CLEAR_SUBJECT;

    constructor( ) {}
}

export class StoreCurrentSubject implements Action {
    readonly type = STORE_CURRENT_SUBJECT;
    constructor(public subject: SubjectRequestModel) {}
}

export class StoreSubjectFlow implements Action {
    readonly type = STORE_SUBJECT_FLOW;
    constructor(public subjectFlow: SubjectFlowModel, public documents) {}
}

export class AddTaskAnswer implements Action {
    readonly type = ADD_TASK_ANSWER;
    constructor(public task: TaskModel, public answer) {}
}

export class UpdateTaskStatus implements Action {
    readonly type = UPDATE_TASK_STATUS;
    constructor(public task: TaskModel, public status) {}
}

export class AsignTaskToUser implements Action {
    readonly type = ASSIGN_USER_TO_TASK;
    constructor(public task: TaskModel, public user) {}
}

export class AddSubjectAnswer implements Action {
    readonly type = ADD_SUBJECT_ANSWER;
    constructor(public answer) {}
}

export class AddSubjectDocuments implements Action {
    readonly type = ADD_SUBJECT_DOCUMENTS;
    constructor(public documents: Array<DocumentModel>) {}
}

export type Actions = ClearSubject
    | StoreCurrentSubject
    | StoreSubjectFlow
    | AddTaskAnswer
    | UpdateTaskStatus
    | AsignTaskToUser
    | AddSubjectAnswer
    | AddSubjectDocuments;
