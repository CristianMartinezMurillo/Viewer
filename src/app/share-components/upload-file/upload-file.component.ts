import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { faPaperclip } from "@fortawesome/free-solid-svg-icons/faPaperclip";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { isNullOrUndefined } from "util";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

export interface FileInterface {
    name: string;
}

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {
    @ViewChild('file') file;
    @Input('set-config') setConfig : boolean = false;
    @Input() isMultiple: boolean = true;
    @Input() buttonText: string;
    @Input('acceptsString') acceptsString: string;

    public files: Set<File> = new Set();

    formGroup : FormGroup;
    listFiles: Array<FileInterface> = [];
    faPaperClip = faPaperclip;
    faTrash = faTrashAlt;

  constructor(
      private fb : FormBuilder
  ) { }

  ngOnInit() {
      this.formGroup = this.fb.group({
          canCopyText: [false, []],
          // canPrint: [false, []],
          canDownload: [false, [   ]],
          // canOpenOnlyTitular: [false, [   ]],
      });

      this.setButtonText();
  }

  private setButtonText() {
      if(isNullOrUndefined(this.buttonText)) {
          this.buttonText = "";
      }
  }

    /**
     * open dialog for selecting files
     */
    openAddFilesDialog() {
        this.file.nativeElement.click();
    }

    /**
     * after select files
     */
    onFilesAdded() {
        const files: { [key: string]: File } = this.file.nativeElement.files;

        for (let key in files) {
            if (!isNaN(parseInt(key))) {
                this.files.add(files[key]);
                this.listFiles.push(files[key]);
            }
        }

    }

    getFilesForm(): FormData {
        const formData: FormData = new FormData();

        if( this.isMultiple ) {

            if(this.files.size > 0) {
                this.files.forEach(file => {
                    formData.append('file[]', file);
                });
            }

        } else {
            if(this.file !== undefined && this.file.nativeElement.files.length > 0)
                formData.append('file', this.file.nativeElement.files[0]);
        }

        if(this.setConfig === true) {
            formData.append("documentsConfig", JSON.stringify(this.getConfigValues()));
        }

        return formData;
    }

    reset() {
        if(!isNullOrUndefined(this.file))
            this.file.nativeElement.value = "";

        this.listFiles = [];
        this.files.clear();
    }

    removeAttachment(index: number) {
        this.listFiles.splice(index, 1);

        let fileForDelete;
        let cont = 0;

        this.files.forEach(function(file){

            if(cont === index){
                fileForDelete = file;
            }

            cont++;
        });

        if(!isNullOrUndefined(fileForDelete))
            this.files.delete(fileForDelete);
    }

    private getConfigValues() {
        return this.formGroup.value;
    }

    public getDocumentsList(): Array<any> {
        return this.listFiles;
    }

}
