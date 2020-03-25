import {Component, OnInit, ViewChild} from '@angular/core';
import {ErrorMessageComponent} from "../../messages/error-message/error-message.component";
import {ActivatedRoute} from "@angular/router";
import {Store} from "@ngrx/store";
import * as MailboxReducer from "../../_store/reducers/mailbox.reducer";
import * as MailboxActions from "../../_store/actions/mailbox.actions";

@Component({
  selector: 'app-external-mailbox',
  templateUrl: './external-mailbox.component.html',
  styleUrls: ['./external-mailbox.component.css']
})
export class ExternalMailboxComponent implements OnInit {
  @ViewChild(ErrorMessageComponent) errorMessage;

  constructor(
      private activatedRoute: ActivatedRoute,
      private store$: Store<MailboxReducer.State>,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.store$.dispatch(new MailboxActions.SetCurrentOrganizationalUnitId(parseInt(params['organizationalUnitId'])));
    });
  }

  get mailboxType() : string {
    return this.activatedRoute.snapshot.paramMap.get('mailboxType');
  }

  get organizationalUnitId(){
    return this.activatedRoute.snapshot.paramMap.get('organizationalUnitId');
  }

}
