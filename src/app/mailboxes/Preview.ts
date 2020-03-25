import {SubjectRequestModel} from "../_models/SubjectRequest.model";
import * as ReceptionType from "../_constants/ReceptionType.constants";

export abstract class Preview {
    abstract subjectRequest: SubjectRequestModel;
    abstract buildSubjectForm();
    // abstract setTasks();
    abstract mapFieldsAndBuildForm();
    abstract openSubjectAnswerDialog();
    abstract marcarResuelto(recipient);
    abstract finalizarAsunto();
    abstract avanzar();

    /**
     *
     * @param recipient
     */
    getReceptionType(recipient): string {
        if (recipient === null || recipient === undefined) {
            return "";
        }

        if ( recipient.TURNAR === true || recipient.TURNAR === 1) {
            return ReceptionType.TURNAR;
        }

        if (recipient.CC === true || recipient.CC === 1) {
            return ReceptionType.CC;
        }

        if (recipient.CCC === true || recipient.CCC === 1) {
            return ReceptionType.CCC;
        }

        return "";
    }
}
