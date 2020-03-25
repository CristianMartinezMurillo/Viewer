import * as ProcessActions from '../actions/process.actions';

export interface State {
    list: Array<any>,
}

const initialState: State = {
    list: [],
};

export function reducer(state = initialState, action: ProcessActions.Actions) : any {

    switch(action.type) {
        case ProcessActions.ADD_PROCESSES:
            return {...state, list: action.payload};
        case ProcessActions.CLEAR_ALL_PROCESSES:
            return [];
        case ProcessActions.ADD_NEW_PROCESS:
            let list = state.list;

            list = list.concat([action.process]);

            return {...state, list: list};
        case ProcessActions.REMOVE_PROCESS:
            list = state.list.filter((process) => process.id !== parseInt(action.processId));

            return {...state, list: list}
        case ProcessActions.ADD_NEW_METADATA_TO_PROCESS:
            list = state.list.map(process => {
                if (process.id === parseInt(action.processId)) {
                    let metadata = process.metadata as Array<any>;
                    metadata = metadata.concat([action.metadata]);
                    return {...process, metadata: metadata};
                }
                return process;
            });

            return {...state, list: list};
        case ProcessActions.DELETE_METADATA_FROM_PROCESS:
            const processList = state.list.map(process => {
                if (process.id === parseInt(action.processId)) {
                    let metadata = process.metadata.filter(x => x.id !== action.metadataId);

                    return {...process, metadata: metadata}
                }

                return process;
            });

            return {...state, list: processList};
        case ProcessActions.MODIFY_PROCESS_METADATA:
            const processArray = state.list.map(process => {
                if (process.id === parseInt(action.processId)) {
                    let metadata = process.metadata as Array<any>;

                    metadata = metadata.map(x => {
                        if(x.id === parseInt(action.metadata.id)) {
                            return action.metadata;
                        }
                        return x;
                    });

                    return {...process, metadata: metadata};
                }

                return process;
            });

            return {...state, list: processArray};
        default:
            return state;
    }
}


