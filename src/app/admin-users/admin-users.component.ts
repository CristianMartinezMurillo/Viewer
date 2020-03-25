import { Component, OnInit, ViewChild } from '@angular/core';
import { UsersService } from "../_services/users.service";
import { MatDialog, MatDialogConfig, MatSort, MatTableDataSource, MatPaginator } from "@angular/material";
import { NewUserDialogBodyComponent } from "./new-user-dialog-body/new-user-dialog-body.component";
import { EditUserAdminComponent } from "./edit-user-admin/edit-user-admin.component";
import { DangerConfirmationDialogComponent } from "../dialog/danger-confirmation-dialog/danger-confirmation-dialog.component"
import { faUserPlus, faUserEdit, faUserMinus, faUsers } from '@fortawesome/free-solid-svg-icons';
import { isNullOrUndefined, isObject } from "util";
import { ErrorMessageComponent } from "../messages/error-message/error-message.component";
import { RolesService } from "../_services/roles.service";
import { RolInterface } from "../_models/rol.interface";

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements  OnInit {

    faUserPlus = faUserPlus;
    faUserEdit = faUserEdit;
    faUserDelete = faUserMinus;
    faUsers = faUsers;

    tablePageSize = 15;
    tablePageSizeOptions = [15, 50, 100];
    displayedColumns: string[] = ['name', 'last_name', 'email', 'organizationalUnits', 'actions'];
    dataSource = new MatTableDataSource([]);
    emptyTableText = 'No se encontraron datos';

    roles : Array<RolInterface> = [];
    disableCheckbox = false;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(ErrorMessageComponent) errorMessage;

  constructor(
      public usersService : UsersService,
      private dialog: MatDialog,
      private rolesService : RolesService
  ) { }

  ngOnInit() {
    this.buildAdminUsers();

    this.paginator._intl.firstPageLabel     = 'Inicio';
    this.paginator._intl.lastPageLabel      = 'Última página';
    this.paginator._intl.nextPageLabel      = 'Siguiente';
    this.paginator._intl.previousPageLabel  = 'Atrás';
    this.paginator._intl.itemsPerPageLabel  = 'Elementos por página';

    this.getUserRoles();
  }

    buildAdminUsers(getUsersByOrganizationalUnitParams = {}) {
    this.usersService.getUsersByOrganizationalUnit(getUsersByOrganizationalUnitParams).subscribe(response => {
        this.disableCheckbox = false;
        if(response.status){
            if(response.users.length > 0){
                this.refreshTable(response.users);
            } else {
                this.refreshTable([]);
            }
        } else {
            this.errorMessage.setErrorMessage(response);
            this.refreshTable([]);
        }
    }, error => {
       console.log('adminUsers error gertUsers()');
       console.log(error);
       this.errorMessage.setErrorMessage(error);
       this.disableCheckbox = false;
    });

  }

    openEditUser(row) {
        let dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {user: row, roles: this.roles};
        dialogConfig.maxWidth = '500px';

        const dialog = this.dialog.open(EditUserAdminComponent, dialogConfig);

        dialog.afterClosed().subscribe(newUserData => {

            if(isObject(newUserData)) {
                this.updateRow(newUserData);
            }
        });
    }

    updateRow(newUserData) {
        let data = this.dataSource.data;

        const foundIndex = data.findIndex(x => x.id === newUserData.id);

        data[foundIndex] = newUserData;

        this.dataSource.data = data;
    }

    openNewUser() {
        let dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.maxWidth = '500px';

        const dialog = this.dialog.open(NewUserDialogBodyComponent, dialogConfig);

        //callback user subscribed or modified
        dialog.afterClosed().subscribe(newUser => {

            if(isObject(newUser)){
                this.tableAddItem(newUser);
            }

        });
    }

    tableAddItem(user) {
        //this.dataSource.data.push() doesn't work, bug https://github.com/angular/material2/issues/8381
        const data = this.dataSource.data;
        data.push(user);
        this.dataSource.data = data;
    }

    deleteUser(user) {
        let dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {title: 'Precaución', textContent: '¿Realmente desea eliminar el usuario ' + user.name + ' '+ user.last_name};
        dialogConfig.maxWidth = '300px';
        dialogConfig.panelClass = 'dialog-confirmation-class';

        const dialog = this.dialog.open(DangerConfirmationDialogComponent, dialogConfig);

        dialog.afterClosed().subscribe(userConfirmation => {
            if(!isNullOrUndefined(userConfirmation.confirmation) && userConfirmation.confirmation){
                this.usersService.deleteUser(user.id).subscribe(userResult => {

                        if( userResult.status ){
                            this.removeItemFromTable(user.id);
                        }
                    },
                    error => {
                    this.errorMessage.setErrorMessage(error);
                    }
                );
            }
        });
    }

    removeItemFromTable(idItem) {
        const data = this.dataSource.data;
        const index = data.findIndex(x => x.id === idItem);

        if (index > -1) {
            data.splice(index, 1);
        }

        this.dataSource.data = data;
    }

    refreshTable(users) {
        this.dataSource = new MatTableDataSource(users);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

    applyFilter (filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    getUserRoles() {
        this.rolesService.getRoles().subscribe(
            response => {
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

    reloadUsers(allUsers: boolean ) {
      this.disableCheckbox = true;
      this.buildAdminUsers({allUsers: allUsers});
    }

    showOrganizationalUnits(organizationalUnits: Array<any>): string {
      let text = "";

      organizationalUnits.forEach(function(orga) {
          text += orga.name + ", ";
      });


      return (organizationalUnits.length > 0) ? text.slice(0,-2) : "";
    }


}
