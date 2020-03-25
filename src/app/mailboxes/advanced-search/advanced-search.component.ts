import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { AdvancedSearchService } from "../../_services/advanced-search.service";
import { faSearch } from "@fortawesome/free-solid-svg-icons/faSearch";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.css']
})
export class AdvancedSearchComponent implements OnInit {
  formGroup : FormGroup;

  faSearch = faSearch;
  faReset = faTrash;

  constructor(
      private fb : FormBuilder,
      private advancedSearchAction : AdvancedSearchService
  ) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      startDate: [null, []],
      endDate: [null, []],
    });
  }

  get form() {
    return this.formGroup.controls;
  }

  searchAction() {
    this.advancedSearchAction.searchAction(this.formGroup.value);
  }

  resetForm() {
    this.formGroup.reset();
  }

}
