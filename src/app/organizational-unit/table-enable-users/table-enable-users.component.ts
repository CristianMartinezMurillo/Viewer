import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import { MatDialog, MatDialogConfig, MatSort, MatTableDataSource, MatPaginator, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { SelectionModel } from '@angular/cdk/collections';
import { faUsers, faBan, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { OrganizationalUnitService } from "../../_services/organizational-unit.service";
import { ErrorMessageComponent } from "../../messages/error-message/error-message.component";
import {UserModel} from "../../_models/user.model";

export interface enableUser {
    id: number;
    name: string;
    last_name: string;
    mothers_last_name: string;
    email: string;
    role_id: number;
    organizational_unit_id?: number;
    status: number;
    created_at: string;
    updated_at: string;
}

@Component({
  selector: 'app-table-enable-users',
  templateUrl: './table-enable-users.component.html',
  styleUrls: ['./table-enable-users.component.css']
})
export class TableEnableUsersComponent implements OnInit {
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(ErrorMessageComponent) errorMessage;

    deleteIcon = faTrashAlt;

    @Input() usersArray = [];
    dataSource = new MatTableDataSource([]);
    selection = new SelectionModel<any>(true, []);
    displayedColumns: string[] = ['select','name', 'email', 'rol'];
    tablePageSize = 15;
    tablePageSizeOptions = [15, 50, 100];

    @Input() roles = [];
    @Input() organizationalUnit;

    constructor(
        private organizationalUnitService: OrganizationalUnitService,
    ) {

    }

  ngOnInit() {
  }

    buildTableEnableUsers(){
        this.organizationalUnitService.usersWithDifferentOrganizationalUnit(this.organizationalUnit.id).subscribe(
            response => {
                if(response.status){

                    let users: Array<enableUser> = response.users;

                    for (let key in users) {
                        let user = users[key];
                        user.organizational_unit_id = this.organizationalUnit.id;
                        let rolID = user.role_id;

                        if(!(rolID > 0)){
                            user.role_id = this.roles[0].id;
                            users[key] = user;
                        }
                    }

                    this.usersArray = users;

                    this.refreshTableUsersEnabledForAdd();
                }else{
                    this.errorMessage.setErrorMessage(response);
                }
            },
            error => {
                console.error(error);
                this.errorMessage.setErrorMessage(error);
            }
        );
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelectedTablePrepareMembers() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelectedTablePrepareMembers() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    refreshTableUsersEnabledForAdd() {
        this.dataSource = new MatTableDataSource(this.usersArray);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.selection.clear();
    }

    applyFilterUsersEnabledForAdd (filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    changeUserRol($value, $user){
        $user.role_id = $value;
    }

    /**
     * remove all the users associated to the organizational unit from table
     * @param selectedUsers
     */
    removeSelectedUsersFromEnableUsersTable(selectedUsers){
        const data = this.usersArray;

        selectedUsers.forEach(function(user){
            const index = data.findIndex(x => x.id === user.user_id);
            if (index > -1) {
                data.splice(index, 1);
            }

        });

        console.log(data);

        this.usersArray = data;

        this.refreshTableUsersEnabledForAdd();
    }

     usersSelected(){
        return this.selection.selected
    }

}
