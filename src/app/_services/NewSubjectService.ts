import {EventEmitter, Injectable} from '@angular/core';
import {MetadataModel} from '../_models/metadata.model';

@Injectable({
    providedIn: 'root'
})
export class NewSubjectService {
    clearSummary: EventEmitter<any> = new EventEmitter<any>();
    buildSummary: EventEmitter<Array<MetadataModel>> = new EventEmitter<Array<MetadataModel>>();
    setMetadataValues: EventEmitter<any> = new EventEmitter<any>();
    constructor() { }
}
