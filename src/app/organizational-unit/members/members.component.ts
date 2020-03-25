import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { MatDialog, MatDialogConfig, MatSort, MatTableDataSource, MatPaginator } from "@angular/material";
import { DangerConfirmationDialogComponent } from "../../dialog/danger-confirmation-dialog/danger-confirmation-dialog.component"
import { faBuilding, faEdit, faPlusCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { isNullOrUndefined } from "util";
import { ErrorMessageComponent } from "../../messages/error-message/error-message.component"
import { OrganizationalUnitService } from "../../_services/organizational-unit.service";

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {
    @ViewChild(ErrorMessageComponent) errorMessage;

    showSpinner = true;
    deleteIcon = faTrashAlt;

    displayedColumns: string[] = ['name', 'email', 'rol', 'actions'];
    dataSource = new MatTableDataSource([]);
    emptyTableText = 'La unidad organizacional no cuenta con miembros';

    tableData = [];

    @Input() idOrganizationalUnit;
    @Input() roles = [];

  constructor(
      private organizationalUnitService: OrganizationalUnitService,
      private dialog: MatDialog

  ) { }

  ngOnInit() {
    console.log(this.idOrganizationalUnit);
    this.buildTable();
  }

  buildTable(){
      this.showSpinner = true;

      this.organizationalUnitService.getMembersOfOrganizationalUnit(this.idOrganizationalUnit).subscribe(
          response => {
              console.log(response);
              this.showSpinner = false;
              if(response.status){
                  this.tableData = response.users;
              }else{
                  this.tableData = [];
                  this.errorMessage.setErrorMessage(response);
              }

              this.refreshTable();

          },
          error => {
              this.showSpinner = false;
              this.errorMessage.setErrorMessage(error);

              this.tableData = [];
              this.refreshTable();
          }
      );
  }

    tableAddItem(newRow) {
        //this.dataSource.data.push() doesn't work, bug https://github.com/angular/material2/issues/8381
        const data = this.dataSource.data;
        data.push(newRow);
        this.dataSource.data = data;
    }

    deleteUser(user){
        let dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {title: 'Precaución', textContent: '¿Realmente desea eliminar a ' + user.user.name + ' de la unidad organizacional?'};
        dialogConfig.maxWidth = '300px';
        dialogConfig.panelClass = 'dialog-confirmation-class';

        const dialog = this.dialog.open(DangerConfirmationDialogComponent, dialogConfig);

        dialog.afterClosed().subscribe(confirmation => {
            if (!isNullOrUndefined(confirmation) && confirmation.confirmation) {
                this.organizationalUnitService.deleteMeber( this.idOrganizationalUnit, user.user.id).subscribe(
                    response => {
                        console.log(response);
                        if(response.status) {
                            this.removeItemFromTable(user.user.id);
                        }else{
                            this.errorMessage.setErrorMessage(response);
                        }
                    },
                    error => {
                        console.log(error);
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

    refreshTable() {
        this.dataSource = new MatTableDataSource(this.tableData);
    }

    changeUserRol($event, user){
        let newRoleId = $event.value;
        let params = { role_id: newRoleId };
        this.organizationalUnitService.updateMemberRole(this.idOrganizationalUnit, user.user.id, params).subscribe(
            response => {
                console.log(response);

                if(response.status) {

                }else{
                    this.errorMessage.setErrorMessage(response);
                }
            },
            error => {
                console.log(error);
                this.errorMessage.setErrorMessage(error);
            }
        );
    }

}
