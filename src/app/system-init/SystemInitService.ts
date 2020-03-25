import { Injectable } from '@angular/core';
import { HttpHeaders } from "@angular/common/http";
import { MailboxService } from "../_services/mailbox.service";
import { Store } from "@ngrx/store";
import * as MailboxReducer from "../_store/reducers/mailbox.reducer";
import * as MailboxActions from "../_store/actions/mailbox.actions";

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
};

@Injectable({
    providedIn: 'root'
})
export class SystemInitService {
    constructor(
        private mailboxService: MailboxService,
        private store$: Store<MailboxReducer.State>,
    ) {

    }

    init() {
    }


}
