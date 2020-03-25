import { Component, OnInit, ViewChild } from '@angular/core';
import { SystemSettingsService } from "../_services/system-settings.service";
import { faCogs } from "@fortawesome/free-solid-svg-icons/faCogs";
import { ErrorMessageComponent } from "../messages/error-message/error-message.component";
import { EmailTemplateInterface } from "./EmailTemplate.interface";

@Component({
  selector: 'app-system-settings',
  templateUrl: './system-settings.component.html',
  styleUrls: ['./system-settings.component.css']
})
export class SystemSettingsComponent implements OnInit {
  @ViewChild(ErrorMessageComponent) errorMessage;

  faSettings = faCogs;
  settings;
  emailTemplate : Array<EmailTemplateInterface>;

  constructor(
      public systemSettingsService : SystemSettingsService
  ) { }

  ngOnInit() {
    this.systemSettingsService.getSystemSettings().subscribe(
        response => {
          if(response['status']) {
            this.settings = response["settings"];
            this.emailTemplate = response["emailTemplates"];
          } else {
            this.errorMessage.setErrorMessage(response);
          }
        },
        error => {
          this.errorMessage.setErrorMessage(error);
        }
    );
  }

}
