import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { AuthClass } from "../../auth/Auth.class";
import { LocalstorageService } from "../../_services/Localstorage.service";
import { Router } from "@angular/router";
import { WarningConfirmationDialogComponent } from "../../dialog/warning-confirmation-dialog/warning-confirmation-dialog.component";
import { MatDialog, MatDialogConfig } from "@angular/material";
import { isNullOrUndefined } from "util";
import { UsersService } from "../../_services/users.service";
import { SystemSettingsService } from "../../_services/system-settings.service";

@Component({
  selector: 'app-panel-navbar',
  templateUrl: './panel-navbar.component.html',
  styleUrls: ['./panel-navbar.component.css']
})
export class PanelNavbarComponent implements OnInit,AfterViewInit {
  faSignOut = faSignOutAlt;
  faBars = faBars;

    @Input() sideBar;
    navbarOpen = false;
    systemSettings: Object = {};

  constructor(
      private auth: AuthClass,
      private localStorage: LocalstorageService,
      private router: Router,
      private dialog: MatDialog,
      private systemSettingsService: SystemSettingsService,
      public userService: UsersService
  ) {

  }

  toggleNavbar() {
      this.navbarOpen = !this.navbarOpen;
  }

  toggleSidebar(){
      this.sideBar.toggle();
  }

  ngOnInit() {
      this.systemSettings = this.systemSettingsService.getLoginSettings();
  }

    ngAfterViewInit(){

    }

    logout(){
        let dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {title: 'Precaución', textContent: 'Esta a punto de cerrar sesión. ¿Desea continuar?'};
        dialogConfig.maxWidth = '300px';
        dialogConfig.panelClass = 'dialog-confirmation-class';

        const dialog = this.dialog.open(WarningConfirmationDialogComponent, dialogConfig);

        dialog.afterClosed().subscribe(userConfirmation => {
            if (!isNullOrUndefined(userConfirmation) && userConfirmation.confirmation) {
                this.auth.logout().subscribe(
                    response => {
                        if (response.status){
                            this.localStorage.clearSessionStorage();
                            this.router.navigate(["/login"]);
                        }
                    },
                    error => {
                        console.error(error);
                    }
                );
            }
        });
    }
}
