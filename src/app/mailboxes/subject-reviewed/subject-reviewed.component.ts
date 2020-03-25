import { Component, Input, OnInit } from '@angular/core';
import { AddresseeModel } from "../../_models/addresseeModel";
import { UsersService } from "../../_services/users.service";
import {Helper} from "../../_helpers/Helper";

@Component({
  selector: 'app-subject-reviewed',
  templateUrl: './subject-reviewed.component.html',
  styleUrls: ['./subject-reviewed.component.css']
})
export class SubjectReviewedComponent implements OnInit {
  @Input() recipients: Array<AddresseeModel>;

  constructor(
      private userService: UsersService
  ) {
  }

  ngOnInit() {
  }

  getReceptionType(recipient) {
    return Helper.getReceptionType(recipient);
  }

}
