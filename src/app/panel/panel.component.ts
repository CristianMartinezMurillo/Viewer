import { Component, HostListener, OnInit, Output } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import { SystemInitService } from "../system-init/SystemInitService";
// import * as $ from 'jquery';
import { LocalstorageService } from "../_services/Localstorage.service";
import { UsersService } from "../_services/users.service";
import * as ProcessActions from "../_store/actions/process.actions";
import { Store} from "@ngrx/store";
import * as ProcessReducer from "../_store/reducers/process.reducer";
import { ProcessService } from "../_services/process.service";

export interface userProfile {
    name: string;
    lastName: string;
}

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {
    faBars = faBars;
    userPicture = faUser;
    showPanel: boolean;
    windowWidth: number;
    panelMode: string;
    hasBackdrop: boolean;
    userData;

    organizationalUnitsRole: Array<any>;

    constructor(
        private title: Title,
        private LocalStorage: LocalstorageService,
        private userService: UsersService,
        private store$: Store<ProcessReducer.State>,
        private processService: ProcessService,
        private systemInitService: SystemInitService
    ) {
        this.onResize(null);
    }

  ngOnInit() {
    this.showPanel = true;

    this.title.setTitle('Panel - Control de Gestión');

    this.systemInitService.init();

    this.setOpenStatus();

    this.userData = this.getUserData();

    this.setUserData();

    this.getProcesses();
  }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.windowWidth = window.innerWidth;

        if(this.windowWidth > 1200){
            this.panelMode = "side";
            this.hasBackdrop = false;
        }else{
            this.panelMode = "over";
            this.hasBackdrop = true;
        }

    }

    setOpenStatus(){
        this.showPanel = (window.innerWidth > 1200) ? true : false;
    }

    getUserData(){
        return this.userService.userData;
    }

    setUserData(){
        if (this.userData === null)
            return;

        let self = this;
        this.organizationalUnitsRole = this.userData.organizationalUnits;

        this.userData.roles.map(role => {
            const organizationalUnitId = role.pivot.organizationalUnit_id;
            let organizationalUnit = self.organizationalUnitsRole.find(organizationalUnit => organizationalUnit.id == organizationalUnitId);

            if(organizationalUnit === undefined)
                return;

            organizationalUnit.role = role;
        });

    }

    closeStart() {
        this.showPanel = false;
        // this.panelService.changeMarginLeftSidenavContent('0px');
    }

    openStart() {
        this.showPanel = true;

    }

    closed() {

    }

    opened() {

    }

    ngAfterViewInit(): void {

    }

    getProcesses() {
        this.processService.getProcessesWithMetadata().subscribe(
            response => {
                if(response['status']) {
                    this.store$.dispatch(new ProcessActions.AddProcessesActions(response['processes']));
                } else {
                    console.error(response);
                }
            },
            error => {
                console.error(error);
            }
        );
    }

}
