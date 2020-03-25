import {Component, Input, OnInit} from '@angular/core';
import {SubjectRequestModel} from "../../_models/SubjectRequest.model";

@Component({
  selector: 'app-subject-header',
  templateUrl: './subject-header.component.html',
  styleUrls: ['./subject-header.component.css']
})
export class SubjectHeaderComponent implements OnInit {
  @Input() subjectRequest: SubjectRequestModel;

  constructor() { }

  ngOnInit() {
  }

}
