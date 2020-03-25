import {UserModel} from "./user.model";

export class AddresseeModel {
    id: number;
    addressee_id: number;
    addresseeType: string;
    CC: boolean;
    TURNAR: boolean;
    subjectRequest_id: number;
    cat_subjectStatus_id: number;
    isSender: boolean;
    resuelto: boolean;
    resuelto_datetime: string;
    public wasRead: boolean;
    user_id: number;
    organizationalUnit_id: number;
    created_at: string;
    updated_at: string;
    mailbox?: Array<any>;
    userTasks?: Array<any>
    organizationalUnitTasks? : Array<any>;
    last_seen: string;
    user?: UserModel;
    step: number;
    sender_organizationalUnit_id: number;
    sender_user_id: number;
    //     {
    //     "id": 18,
    //     "mailboxType_id": 1,
    //     "mailboxStatus_id": 1,
    //     "addressee_id": 20,
    //     "subjectRequest_id": 25,
    //     "readed": 0,
    //     "created_at": "2019-06-11 23:27:12",
    //     "updated_at": null,
    //     "type": {
    //         "id": 1,
    //         "name": "Bandaje de entrada",
    //         "code": "inbox",
    //         "description": "",
    //         "created_at": "2019-05-14 21:33:43",
    //         "updated_at": "2019-05-14 21:33:43"
    //     },
    //     "status": {
    //         "id": 1,
    //         "name": "Nuevo",
    //         "code": "nuevo",
    //         "description": "",
    //         "created_at": "2019-05-14 21:33:43",
    //         "updated_at": "2019-05-14 21:33:43"
    //     }
    // },
    subjectRequest: object;
        // {
        // "id": 25,
        // "proceso_id": 1,
        // "cat_subjectStatus_id": 6,
        // "user_id": 4,
        // "organizationalUnit_id": 6,
        // "addresseeType": "organizationalUnit",
        // "fromDate": "2019-06-10",
        // "untilDate": null,
        // "finalizar_datetime": null,
        // "reactivado_datetime": null,
        // "folio": "DESA/23/2019",
        // "title": "Task test",
        // "onlyTitular": 0,
        // "isExternal": 0,
        // "created_at": "2019-06-10 17:12:57",
        // "updated_at": "2019-06-10 17:12:57",
        // "subjectOutTime": null,
        // "almostFinished": null,
        // "subjectOnTime": null,
        // "undefinedSubjectDate": 1,
        // "organizationalUnit": {
        //     "id": 6,
        //     "parent_id": 3,
        //     "name": "Desarrollo",
        //     "code": "DESA",
        //     "description": null,
        //     "counter": 23,
        //     "company_id": 1,
        //     "status": 1,
        //     "created_at": "2019-05-13 22:14:24",
        //     "updated_at": "2019-06-10 17:12:57"
        // },
        //     "id": 4,
        //     "name": "Daniel",
        //     "last_name": "Luna",
        //     "mothers_last_name": null,
        //     "email": "dluna@cs-docs.com",
        //     "firelPath": null,
        //     "firelName": null,
        //     "role_id": 1,
        //     "organizational_unit_id": 6,
        //     "status": 1,
        //     "created_at": "2019-05-14 03:03:47",
        //     "updated_at": "2019-05-14 03:05:34"
        // },
        process: Array<any>;
            // "id": 1,
            // "organizational_unit_id": 1,
            // "user_id": 1,
            // "process_name": "Documento",
            // "process_name_text": "Documento",
            // "created_at": "2019-05-13 22:22:25",
            // "updated_at": "2019-05-13 22:22:25"

        metadataValue: Array<any>;
            // [
            // {
            //     "id": 10,
            //     "metadata_id": 2,
            //     "subjectRequest_id": 25,
            //     "value": "42343312",
            //     "catalog_id": null,
            //     "created_at": "2019-06-10 17:12:57",
            //     "updated_at": "2019-06-10 17:12:57",
            //     "field": {
            //         "id": 2,
            //         "proceso_id": 1,
            //         "cat_dataType_id": 1,
            //         "field_name": "Expediente",
            //         "value": null,
            //         "catalog_id": null,
            //         "field_name_text": "Expediente",
            //         "min_length": null,
            //         "max_length": 30,
            //         "required": 1,
            //         "unique": 0,
            //         "auto_increment": 0,
            //         "created_at": "2019-05-17 13:55:30",
            //         "updated_at": "2019-05-17 13:55:30",
            //         "catDataType": {
            //             "id": 1,
            //             "name": "Texto corto",
            //             "field_name": "string",
            //             "max_length": 255
            //         },
            //         "catalogData": []
            //     }
            // }
}
