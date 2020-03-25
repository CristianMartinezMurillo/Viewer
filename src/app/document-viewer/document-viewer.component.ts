import {Component, Inject, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material";
import { ViewerPdfDialogComponent} from "./viewer-pdf-dialog.component";
import {ViewerService} from "./viewer.service";
import { ErrorMessageComponent } from "../messages/error-message/error-message.component";
import { isNullOrUndefined, isObject } from "util";
import { UsersService } from "../_services/users.service";


@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.css']
})
export class DocumentViewerComponent implements OnInit, OnDestroy {
  @ViewChild(ErrorMessageComponent) errorMessage;
  @Input() documentSrc;

  subscription: any;

  constructor(
      private dialog: MatDialog,
      private viewerService: ViewerService,
      private userService: UsersService,
      @Inject(MAT_DIALOG_DATA) public subject
  ) { }

  ngOnInit() {
    // console.log("ngOnInit document viewer");
    // console.log("subscribing");

    this.subscription = this.viewerService.open.subscribe(document => { /** each time users open documents */
        console.log("open document...");
        // console.log(document);


      if(this.isPdf(document.filename)){
          this.get64AndOpenPdf(document);
      }

    });
  }

  openPdf(document){

    let dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = document;
    dialogConfig.maxWidth = '100%';
    // dialogConfig.maxHeight = '100%';
    dialogConfig.width = '90%';
    // dialogConfig.height = '100%';
    dialogConfig.panelClass = 'dialog-class';

    const dialog = this.dialog.open(ViewerPdfDialogComponent, dialogConfig);
  }

  fileExtension(filename): string{
    let extn = filename.split(".").pop();

    return extn;
  }

  isPdf(filename): boolean{
    return (this.fileExtension(filename).toUpperCase() === 'PDF')
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  get64AndOpenPdf(document){
    let config = (isNullOrUndefined(document.config)) ? null : (isObject(document.config)) ? document.config : JSON.parse(document.config);

    // if(isObject(config)) {
    //   if(config.hasOwnProperty('canOpenOnlyTitular') && config.canOpenOnlyTitular == true) {
    //     if(!this.userService.isTitular())
    //       return;
    //   }
    // }

    this.viewerService.getPdf64(document.id, document.repositoryType).subscribe(
        response => {

          if(response['status']) {

            document.file64 = response["document64"];

            this.openPdf(document);
          } else {

          }

        },
        error => {

        }
    );
  }

}
