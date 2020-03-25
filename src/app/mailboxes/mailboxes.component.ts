import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorMessageComponent } from "../messages/error-message/error-message.component";
import { ActivatedRoute } from "@angular/router";
import { MatDialog, MatDialogConfig, MatSort, MatTableDataSource, MatPaginator } from "@angular/material";
import { InboxComponent } from "./inbox-component/inbox.component";
import { InboxoutComponent } from "./inboxout/inboxout.component";
import { Store } from "@ngrx/store";
import * as MailboxActions from "../_store/actions/mailbox.actions";
import * as MailboxReducer from "../_store/reducers/mailbox.reducer";

@Component({
  selector: 'app-mailboxes',
  templateUrl: './mailboxes.component.html',
  styleUrls: ['./mailboxes.component.css']
})
export class MailboxesComponent implements OnInit {
    @ViewChild(ErrorMessageComponent) errorMessage;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    @ViewChild(InboxComponent) inboxTable;
    @ViewChild(InboxoutComponent) inboxoutTable;

    dataSource = new MatTableDataSource([]);

    title: string;

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
      return this.activatedRoute.snapshot.url[0].path;
  }

    get organizationalUnitId(){
        return this.activatedRoute.snapshot.paramMap.get('organizationalUnitId');
    }

}
