import { ProcessModel } from "./process.model";
import { DocumentModel } from "./Document.model";
import { AddresseeModel } from "./addresseeModel";
import { UserModel } from "./user.model";
import { TaskModel } from "../share-components/_models/task.model";

export interface SubjectRequestModel {
    id: number;
    proceso_id: number;
    cat_subjectStatus_id: number;
    user_id: number;
    organizationalUnit_id: number;
    addresseeType: string;
    fromDate: string;
    untilDate: string;
    finalizar_datetime: string|null;
    reactivado_datetime: string|null;
    folio: string;
    title: string;
    onlyTitular: boolean;
    isExternal: boolean;
    created_at: string;
    updated_at: string;
    process: ProcessModel;
    documents: Array<DocumentModel>
    subjectFlow: Array<SubjectFlowModel>;
    destinatario: AddresseeModel;
    recipient?: AddresseeModel;
    metadataValue: Array<any>;
    answers: Array<SubjectAnswerModel>;
    status?: SubjectRequestStatusModel;
    recipients?: Array<AddresseeModel>;
    tasks?: Array<TaskModel>;
}

export interface SubjectFlowModel {
    id: number;
    destin_user_id: number|null;
    destin_organizationalUnit_id: number;
    sender_user_id: number;
    sender_organizationalUnit_id: number;
    cat_subjectStatus_id: number;
    subjectRequest_id: number;
    step: number;
    recipientType: string;
    created_at: string;
    updated_at: string|null;
    destinOrganizationalUnit: OrganizationalUnitModel;
    destinUser: UserModel;
    senderUser: UserModel;
    senderOrganizationalUnit: OrganizationalUnitModel;
}

export class OrganizationalUnitModel {
    id: number;
    parent_id: number;
    name: string;
    code: string;
    description: string;
    counter: number;
    level: number;
    company_id: number;
    status: boolean;
    created_at: string;
    updated_at: string;
    tasks: Array<TaskModel>;
}

export class SubjectRequestStatusModel {
    code: string;
    id: number;
    description: string;
    name: string;
    created_at: string;
    updated_at: string;
}

export class SubjectAnswerModel {
    id: number;
    created_at: string;
    answer: string;
    subjectRequest_id: number;
    user_id: number;
    organizationalUnitId: number;
    step: number;
    user?: UserModel;
    documents: DocumentModel;
    organizationalUnit_id: number;
}
