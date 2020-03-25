import { faFilePdf } from "@fortawesome/free-solid-svg-icons/faFilePdf";
import { faFileImage } from "@fortawesome/free-solid-svg-icons/faFileImage";
import { faFileWord } from "@fortawesome/free-solid-svg-icons/faFileWord";
import { faFile } from "@fortawesome/free-solid-svg-icons/faFile";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons/faFileExcel";

export class File {
    extension(fileName: string) : string{
        let extn = fileName.split(".").pop();

        return extn.toLowerCase();

    }

    icon(filename : string) {
        let ext = this.extension(filename);

        switch (ext) {
            case 'pdf' :
                return faFilePdf;
            case 'jpge' :
                return faFileImage;
            case 'jpg' :
                return faFileImage;
            case 'png' :
                return faFileImage;
            case 'doc' :
                return faFileWord;
            case 'docx' :
                return faFileWord;
            case 'xls' :
                return faFileExcel;
            case 'xlsx' :
                return faFileExcel;
        }

        return faFile;

    }
}
