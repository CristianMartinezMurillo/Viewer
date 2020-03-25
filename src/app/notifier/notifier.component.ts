import { Component, OnInit, ViewChild } from '@angular/core';
import { NotifierOptions, NotifierService } from "angular-notifier";
import { isNullOrUndefined } from "util";

@Component({
  selector: 'app-notifier',
  templateUrl: './notifier.component.html',
  styleUrls: ['./notifier.component.css']
})
export class NotifierComponent implements OnInit {
  @ViewChild('customNotification') customNotificationTmpl;

  constructor(
      private notifier: NotifierService
  ) { }

  ngOnInit() {
  }

  public show(settings = null) {
    if(isNullOrUndefined(settings)) {
      settings = {
        type: 'success',
        // message: 'You are awesome! I mean it!',
        // id: 'THAT_NOTIFICATION_ID' // Again, this is optional
      }
    }

    settings.template = this.customNotificationTmpl;

    this.notifier.show(settings);
  }

}
