import {UserModel} from "../../_models/user.model";

export interface TaskModel {
    id: number;
    subjectRequest_id: number;
    user_id: number;
    organizationalUnit_id: number;
    sender_user_id: number;
    description: string;
    addressee_id: number;
    completed: boolean;
    created_at: string;
    updated_at: string;
    answers: Array<any>;
    userAssigned: UserModel;
}
