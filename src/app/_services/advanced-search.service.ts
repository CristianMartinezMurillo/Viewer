import {EventEmitter, Injectable, Output} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdvancedSearchService {
  @Output() performSearch: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  searchAction(params) {
    this.performSearch.emit(params);
  }
}
