import { Action } from '@ngrx/store';
import { MetadataModel } from "../../_models/metadata.model";
import { ProcessModel } from "../../_models/process.model";

export const ADD_PROCESSES         = '[Process] Add processes';
export const CLEAR_ALL_PROCESSES   = '[Process] Clear all processes';
export const ADD_NEW_METADATA_TO_PROCESS = '[Process] Add metadata';
export const DELETE_METADATA_FROM_PROCESS = '[Process] Delete Metadata From Process';
export const MODIFY_PROCESS_METADATA = '[Process] Modify Process Metadata';
export const ADD_NEW_PROCESS            = '[Process] Add new Process';
export const REMOVE_PROCESS         = '[Process] Remove Process';

export class AddProcessesActions implements Action {
    readonly type = ADD_PROCESSES;

    constructor(public payload ) {}
}

export class ClearAllProcessesAction implements Action {
    readonly type = CLEAR_ALL_PROCESSES;

    constructor() {}
}

export class AddNewProcess implements Action {
    readonly type = ADD_NEW_PROCESS;
    constructor(public process: ProcessModel){}
}

export class RemoveProcess implements Action {
    readonly type = REMOVE_PROCESS;
    constructor(public processId){}
}

export class AddNewMetadataToProcess implements Action {
    readonly type = ADD_NEW_METADATA_TO_PROCESS;

    constructor(public processId, public metadata: MetadataModel) {}
}

export class DeleteMetadaFromProcess implements Action {
    readonly type = DELETE_METADATA_FROM_PROCESS;
    constructor(public processId, public metadataId) {}
}

export class ModifyProcessMetadata implements Action {
    readonly type = MODIFY_PROCESS_METADATA;
    constructor(public processId, public metadata) {}
}

export type Actions = AddProcessesActions
    | ClearAllProcessesAction
    | AddNewProcess
    | AddNewMetadataToProcess
    | RemoveProcess
    | DeleteMetadaFromProcess
    | ModifyProcessMetadata;
