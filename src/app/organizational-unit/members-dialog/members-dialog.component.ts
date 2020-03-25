import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { faUsers, faBan, faBezierCurve } from '@fortawesome/free-solid-svg-icons';
import { OrganizationalUnitService } from "../../_services/organizational-unit.service";
import { ErrorMessageComponent } from "../../messages/error-message/error-message.component";
import { TableEnableUsersComponent } from "../table-enable-users/table-enable-users.component";
import { RolesService } from "../../_services/roles.service";
import { MembersComponent } from "../members/members.component";

@Component({
  selector: 'app-members-dialog',
  templateUrl: './members-dialog.component.html',
  styleUrls: ['./members-dialog.component.css']
})

/**
 * usersEnabledForAdd: users enabled for being added in an organizational unit
 * usersPreparedForAdd: users for being assigned in a rol
 */

export class MembersDialogComponent implements OnInit {
    @ViewChild(ErrorMessageComponent) errorMessage;
    @ViewChild(TableEnableUsersComponent) appTablePrepareEnaleUsers;
    @ViewChild(MembersComponent) membersComponent;

    faUsers = faUsers;
    faCancel = faBan;
    faLinked = faBezierCurve;

    allPreparedMembersWithRol = true;
    indexTab = 0;

    roles = [];

  constructor(
      public dialogRef: MatDialogRef<MembersDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public activeNode,
      private organizationalUnitService: OrganizationalUnitService,
      private rolesService: RolesService
  ) { }

  ngOnInit() {
        this.getRoles();
  }

    onChangeTab(tab){
        if(tab.index === 0) {
            this.membersComponent.buildTable();
        }
        if(tab.index === 1){
            this.appTablePrepareEnaleUsers.buildTableEnableUsers();
        }
    }

    getRoles(){
        this.rolesService.getRoles().subscribe(
            response => {
                console.log(response);
                if(response.status){
                    this.roles = response.roles;
                }else{
                    this.errorMessage.setErrorMessage(response);
                }
            },
            error => {
                this.errorMessage.setErrorMessage(error);
            }
        );
    }

    associateUsers(){
        this.allPreparedMembersWithRol = true;

        let params = {
            users: []
        };

        let usersSelected = this.appTablePrepareEnaleUsers.usersSelected();

        for(let key in usersSelected){
            let user = usersSelected[key];
            let rolId = parseInt(user.role_id);

            if(!(rolId > 0)){
                this.allPreparedMembersWithRol = false;
                return;
            }else{
                params.users.push({user_id: user.id, role_id: rolId});
            }
        }


        this.appTablePrepareEnaleUsers.removeSelectedUsersFromEnableUsersTable(params.users);


        this.organizationalUnitService.addMembers(this.activeNode.id, params).subscribe(
            response => {

                if(response.status){
                    this.appTablePrepareEnaleUsers.removeSelectedUsersFromEnableUsersTable(params.users);
                }else{
                    this.errorMessage.setErrorMessage(response);
                }
            },
            error => {
                this.errorMessage.setErrorMessage(error);
            }
        );

    }
}
