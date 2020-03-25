import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { isNullOrUndefined } from "util";
import { PDFDocumentProxy, PDFProgressData, PdfViewerComponent } from "ng2-pdf-viewer";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { isObject } from "rxjs/internal-compatibility";

@Component({
  selector: 'app-viewer-dialog',
  templateUrl: './viewer-pdf-dialog.component.html',
  styleUrls: ['./viewer-pdf-dialog.component.css']
})
export class ViewerPdfDialogComponent implements OnInit {
  // file64test = 'JVBERi0xLjMNCiXi48/TDQoNCjEgMCBvYmoNCjw8DQovVHlwZSAvQ2F0YWxvZw0KL091dGxpbmVzIDIgMCBSDQovUGFnZXMgMyAwIFINCj4+DQplbmRvYmoNCg0KMiAwIG9iag0KPDwNCi9UeXBlIC9PdXRsaW5lcw0KL0NvdW50IDANCj4+DQplbmRvYmoNCg0KMyAwIG9iag0KPDwNCi9UeXBlIC9QYWdlcw0KL0NvdW50IDINCi9LaWRzIFsgNCAwIFIgNiAwIFIgXSANCj4+DQplbmRvYmoNCg0KNCAwIG9iag0KPDwNCi9UeXBlIC9QYWdlDQovUGFyZW50IDMgMCBSDQovUmVzb3VyY2VzIDw8DQovRm9udCA8PA0KL0YxIDkgMCBSIA0KPj4NCi9Qcm9jU2V0IDggMCBSDQo+Pg0KL01lZGlhQm94IFswIDAgNjEyLjAwMDAgNzkyLjAwMDBdDQovQ29udGVudHMgNSAwIFINCj4+DQplbmRvYmoNCg0KNSAwIG9iag0KPDwgL0xlbmd0aCAxMDc0ID4+DQpzdHJlYW0NCjIgSg0KQlQNCjAgMCAwIHJnDQovRjEgMDAyNyBUZg0KNTcuMzc1MCA3MjIuMjgwMCBUZA0KKCBBIFNpbXBsZSBQREYgRmlsZSApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY4OC42MDgwIFRkDQooIFRoaXMgaXMgYSBzbWFsbCBkZW1vbnN0cmF0aW9uIC5wZGYgZmlsZSAtICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNjY0LjcwNDAgVGQNCigganVzdCBmb3IgdXNlIGluIHRoZSBWaXJ0dWFsIE1lY2hhbmljcyB0dXRvcmlhbHMuIE1vcmUgdGV4dC4gQW5kIG1vcmUgKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA2NTIuNzUyMCBUZA0KKCB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDYyOC44NDgwIFRkDQooIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNjE2Ljg5NjAgVGQNCiggdGV4dC4gQW5kIG1vcmUgdGV4dC4gQm9yaW5nLCB6enp6ei4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNjA0Ljk0NDAgVGQNCiggbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDU5Mi45OTIwIFRkDQooIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNTY5LjA4ODAgVGQNCiggQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA1NTcuMTM2MCBUZA0KKCB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBFdmVuIG1vcmUuIENvbnRpbnVlZCBvbiBwYWdlIDIgLi4uKSBUag0KRVQNCmVuZHN0cmVhbQ0KZW5kb2JqDQoNCjYgMCBvYmoNCjw8DQovVHlwZSAvUGFnZQ0KL1BhcmVudCAzIDAgUg0KL1Jlc291cmNlcyA8PA0KL0ZvbnQgPDwNCi9GMSA5IDAgUiANCj4+DQovUHJvY1NldCA4IDAgUg0KPj4NCi9NZWRpYUJveCBbMCAwIDYxMi4wMDAwIDc5Mi4wMDAwXQ0KL0NvbnRlbnRzIDcgMCBSDQo+Pg0KZW5kb2JqDQoNCjcgMCBvYmoNCjw8IC9MZW5ndGggNjc2ID4+DQpzdHJlYW0NCjIgSg0KQlQNCjAgMCAwIHJnDQovRjEgMDAyNyBUZg0KNTcuMzc1MCA3MjIuMjgwMCBUZA0KKCBTaW1wbGUgUERGIEZpbGUgMiApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY4OC42MDgwIFRkDQooIC4uLmNvbnRpbnVlZCBmcm9tIHBhZ2UgMS4gWWV0IG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA2NzYuNjU2MCBUZA0KKCBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY2NC43MDQwIFRkDQooIHRleHQuIE9oLCBob3cgYm9yaW5nIHR5cGluZyB0aGlzIHN0dWZmLiBCdXQgbm90IGFzIGJvcmluZyBhcyB3YXRjaGluZyApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY1Mi43NTIwIFRkDQooIHBhaW50IGRyeS4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA2NDAuODAwMCBUZA0KKCBCb3JpbmcuICBNb3JlLCBhIGxpdHRsZSBtb3JlIHRleHQuIFRoZSBlbmQsIGFuZCBqdXN0IGFzIHdlbGwuICkgVGoNCkVUDQplbmRzdHJlYW0NCmVuZG9iag0KDQo4IDAgb2JqDQpbL1BERiAvVGV4dF0NCmVuZG9iag0KDQo5IDAgb2JqDQo8PA0KL1R5cGUgL0ZvbnQNCi9TdWJ0eXBlIC9UeXBlMQ0KL05hbWUgL0YxDQovQmFzZUZvbnQgL0hlbHZldGljYQ0KL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcNCj4+DQplbmRvYmoNCg0KMTAgMCBvYmoNCjw8DQovQ3JlYXRvciAoUmF2ZSBcKGh0dHA6Ly93d3cubmV2cm9uYS5jb20vcmF2ZVwpKQ0KL1Byb2R1Y2VyIChOZXZyb25hIERlc2lnbnMpDQovQ3JlYXRpb25EYXRlIChEOjIwMDYwMzAxMDcyODI2KQ0KPj4NCmVuZG9iag0KDQp4cmVmDQowIDExDQowMDAwMDAwMDAwIDY1NTM1IGYNCjAwMDAwMDAwMTkgMDAwMDAgbg0KMDAwMDAwMDA5MyAwMDAwMCBuDQowMDAwMDAwMTQ3IDAwMDAwIG4NCjAwMDAwMDAyMjIgMDAwMDAgbg0KMDAwMDAwMDM5MCAwMDAwMCBuDQowMDAwMDAxNTIyIDAwMDAwIG4NCjAwMDAwMDE2OTAgMDAwMDAgbg0KMDAwMDAwMjQyMyAwMDAwMCBuDQowMDAwMDAyNDU2IDAwMDAwIG4NCjAwMDAwMDI1NzQgMDAwMDAgbg0KDQp0cmFpbGVyDQo8PA0KL1NpemUgMTENCi9Sb290IDEgMCBSDQovSW5mbyAxMCAwIFINCj4+DQoNCnN0YXJ0eHJlZg0KMjcxNA0KJSVFT0YNCg==';

  @ViewChild(PdfViewerComponent) public pdfComponent: PdfViewerComponent;
  @Input() documentTitle : string = '';

  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  config : any;

  error: any;
  page = 1;
  rotation = 0;
  zoom = 1.0;
  originalSize = false;
  src;
  pdf: any;
  progressData: PDFProgressData;
  isLoaded = false;
  stickToPage = false;
  showAll = true;
  autoresize = true;
  fitToPage = true;
  outline: any[];
  isOutlineShown = false;
  pdfQuery = '';

  totalPages = 5;

  hightlights;
  foundwordIndex = 1;

  constructor(
      public dialogRef: MatDialogRef<ViewerPdfDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public dialogData
  ) { }

  ngOnInit() {
    console.log(this.dialogData.canCopyText);
    this.src = this.base64ToArrayBuffer(this.dialogData.file64);
    this.config = (isNullOrUndefined(this.dialogData.config)) ? null : (isObject(this.dialogData.config)) ? this.dialogData.config : JSON.parse(this.dialogData.config);

    if(this.dialogData.hasOwnProperty('filename')) {
      this.documentTitle = this.dialogData.filename;
    }

   }

  base64ToArrayBuffer(base64) {
    let binary_string =  window.atob(base64);
    let len = binary_string.length;
    let bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++)        {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  search($event, previous = false) {
    console.log(this.pdfComponent);
    console.log(this.pdfComponent.pdfFindController);

    if( this.pdfQuery !== $event.target.value) {
      this.pdfQuery = $event.target.value;

      this.pdfComponent.pdfFindController.executeCommand('find', {
        // caseSensitive: false,
        // findPrevious: false,
        highlightAll: true,
        // phraseSearch: true,
        query: this.pdfQuery
      });

      this.getHighlights();

      this.scrollToElementHighlight();

    } else {
    //   this.pdfComponent.pdfFindController.executeCommand('findagain', {
    //     query: this.pdfQuery,
    //     highlightAll: true,
    //     findPrevious: previous,
    // });

      // console.log(this.pdfComponent.element);
      // console.log(this.pdfComponent.element.nativeElement);

      // this.pdfComponent.element.nativeElement.scrollTop+=100;

    }


  }

   getScrollParent(node) {
    if (node == null) {
      return null;
    }

    if (node.scrollHeight > node.clientHeight) {
      return node;
    } else {
      return this.getScrollParent(node.parentNode);
    }
  }

  getHighlights() {
    this.hightlights = document.getElementById('viewer-pdf-dialog').getElementsByClassName('highlight');

    this.foundwordIndex = 1;
  }

  removeEndClassFromHighlights() {
    let hightlights = [];
    let arr = Array.prototype.slice.call( this.hightlights );

    arr.forEach(function(value, index) {
      if(!value.classList.contains('end'))
        hightlights.push(value);
    });

    this.hightlights = hightlights;
  }

  scrollToElementHighlight() {
    let el = document.getElementsByClassName('highlight selected');

    if(!isNullOrUndefined(el) && el.length > 0 ){
      // let pos = this.getElementOffset(el[0]);
      // console.log(pos);
      // this.scrolling(pos);
      el[0].scrollIntoView();
      // console.log("finish scroll");
    }
  }

  scrolling(highlight) {
    let container = document.getElementsByClassName('viewer-pdf-dialog');

      if(!isNullOrUndefined(container) && container.length > 0 ) {
        console.log(container[0]);
        container[0].scrollTop = highlight.top;
      }
    }

  findFirstHighlight() {
      if(this.hightlights.length > 0) {
        console.log("findFirstHighlight");

        this.removeEndClassFromHighlights();

        this.foundwordIndex = 1;

        let arr = Array.prototype.slice.call( this.hightlights );

        let indexNode = arr.findIndex(node => node.tagName === 'SPAN');

        let node = arr[indexNode];

        node.classList.add('selected');

        node.scrollIntoView();
      }
    }

  findLastHighlight() {
    if(this.hightlights.length > 0) {

      console.log("findLastHighlight");

      this.removeEndClassFromHighlights();

      let arr = Array.prototype.slice.call( this.hightlights );

      this.foundwordIndex = arr.length;

      let node = arr[arr.length - 1];

      node.classList.add('selected');

      node.scrollIntoView();
    }
  }

    findNext() {
      this.removeEndClassFromHighlights();

      let arr = Array.prototype.slice.call( this.hightlights );

      let indexNode = arr.findIndex(node => node.tagName === 'SPAN' && node.classList.contains('selected'));

      if(isNullOrUndefined(indexNode) || isNullOrUndefined(arr[indexNode]))
        return;

      if((indexNode + 1) === arr.length){
        arr[indexNode].classList.remove('selected');

        return this.findFirstHighlight();
      }

      let hasSelected = arr[indexNode];

      hasSelected.classList.remove('selected');

      this.foundwordIndex = indexNode + 1;

      let newNode = arr[indexNode + 1];

      newNode.classList.add('selected');

      newNode.scrollIntoView();

    }

  findPrevious() {
    this.removeEndClassFromHighlights();

    let arr = Array.prototype.slice.call( this.hightlights );

    let indexNode = arr.findIndex(node => node.tagName === 'SPAN' && node.classList.contains('selected'));

    if(isNullOrUndefined(indexNode) || isNullOrUndefined(arr[indexNode]))
      return;

    if((indexNode - 1) < 0) {
      arr[indexNode].classList.remove('selected');

      return this.findLastHighlight();
    }

    this.foundwordIndex = indexNode;

    let hasSelected = arr[indexNode];

    hasSelected.classList.remove('selected');

    let newNode = arr[indexNode - 1];

    newNode.classList.add('selected');

    newNode.scrollIntoView();
  }

  /**
   * Navigate to destination
   * @param destination
   */
  navigateTo(destination: any) {
    this.pdfComponent.pdfLinkService.navigateTo(destination);
  }

  /**
   * Scroll view
   */
  scrollToPage(pageNumber) {
    if(!parseInt(pageNumber))
      return;

    if(this.showAll) {
      //data-page-number

      if(pageNumber > this.totalPages)
        pageNumber = this.totalPages;

      let page = document.getElementById('viewer-pdf-dialog').querySelectorAll('[data-page-number="'+ pageNumber +'"]');

      if(page.length > 0)
        page[0].scrollIntoView();
    } else {
      this.pdfComponent.pdfViewer.scrollPageIntoView({
        pageNumber: pageNumber,
      });
    }
  }

  /**
   * Pdf loading progress callback
   * @param {PDFProgressData} progressData
   */
  onProgress(progressData: PDFProgressData) {
    this.progressData = progressData;
    this.isLoaded = false;
    this.error = null; // clear error
  }

  /**
   * Page rendered callback, which is called when a page is rendered (called multiple times)
   *
   * @param {CustomEvent} e
   */
  pageRendered(e: CustomEvent) {
    // console.log('(page-rendered)', e);
  }

  /**
   * Get pdf information after it's loaded
   * @param pdf
   */
  afterLoadComplete(pdf: PDFDocumentProxy) {
    this.pdf = pdf;
    this.isLoaded = true;
    console.log(this.pdf);

    this.totalPages = this.pdf._pdfInfo.numPages;

    this.loadOutline();
  }

  /**
   * Get outline
   */
  loadOutline() {
    this.pdf.getOutline().then((outline: any[]) => {
      this.outline = outline;
    });
  }

  /**
   * Handle error callback
   *
   * @param error
   */
  onError(error: any) {
    this.error = error; // set error

    if (error.name === 'PasswordException') {
      const password = prompt(
          'This document is password protected. Enter the password:'
      );

      if (password) {
        this.error = null;
        this.setPassword(password);
      }
    }
  }

  setPassword(password: string) {
    let newSrc;
    if (this.src instanceof ArrayBuffer) {
      newSrc = { data: this.src };
    } else if (typeof this.src === 'string') {
      newSrc = { url: this.src };
    } else {
      newSrc = { ...this.src };
    }
    newSrc.password = password;
    this.src = newSrc;
  }

   getElementOffset(element) {
    let de = document.documentElement;
    let box = element.getBoundingClientRect();
    let top = box.top + window.pageYOffset - de.clientTop;
    let left = box.left + window.pageXOffset - de.clientLeft;
    return { top: top, left: left };
  }

}
