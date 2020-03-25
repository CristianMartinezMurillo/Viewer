import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatTableDataSource} from "@angular/material";
import { faEdit, faPlusCircle, faTrashAlt, faCogs } from '@fortawesome/free-solid-svg-icons';
import { ErrorMessageComponent } from "../../messages/error-message/error-message.component"
import { ProcessService } from "../../_services/process.service"
import { Router } from "@angular/router";
import { DangerConfirmationDialogComponent } from "../../dialog/danger-confirmation-dialog/danger-confirmation-dialog.component";
import { isNullOrUndefined } from "util";
import { NotifierComponent } from "../../notifier/notifier.component";
import { ProcessTreePanelService } from "../../process-tree-panel/process-tree-panel.service";
import { Store } from "@ngrx/store";
import * as ProcessReducer from '../../_store/reducers/process.reducer';
import * as ProcessActions from '../../_store/actions/process.actions';

@Component({
  selector: 'app-process-admin',
  templateUrl: './process-admin.component.html',
  styleUrls: ['./process-admin.component.css']
})
export class ProcessAdminComponent implements OnInit {
    @ViewChild(ErrorMessageComponent) errorMessage;
    @ViewChild(NotifierComponent) notifier;

    faEdit = faEdit;
    faDelete = faTrashAlt;
    faAdd = faPlusCircle;

    displayedColumns: string[] = ['process_name', 'created_at', 'actions'];
    dataSource = new MatTableDataSource([]);
    emptyTableText = 'No existen procesos';

    processArray = [];

    constructor(
        private processService: ProcessService,
        private router: Router,
        private dialog: MatDialog,
        private processTreePanelService: ProcessTreePanelService,
        private store$: Store<ProcessReducer.State>,
    ) { }

    ngOnInit(): void {
        this.setProcess();
    }

    setProcess() {
      this.processService.getProcess().subscribe(
          response => {
            this.processArray = response.process;
            this.refreshTable();
          },
          error => {
            console.debug(error);
            this.errorMessage.setErrorMessage(error);
          }
      );
    }


    refreshTable(): void {
        this.dataSource = new MatTableDataSource(this.processArray);
    }

    editProcess(idProcess) {
        console.log("editProcess " + idProcess);
        this.router.navigate(['/panel/process/'+idProcess+'/edit']);
    }

    deleteProcess(process) {
        let dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {title: 'Precaución', textContent: '¿Realmente desea eliminar el proceso ' + process.name + '? esta operación no puede revertirse.'};
        dialogConfig.maxWidth = '300px';
        dialogConfig.panelClass = 'dialog-confirmation-class';


        const dialog = this.dialog.open(DangerConfirmationDialogComponent, dialogConfig);

        dialog.afterClosed().subscribe(confirmation => {
            if(!isNullOrUndefined(confirmation.confirmation) && confirmation.confirmation){
                this.processService.delete(process.id).subscribe(result => {
                        if( result.status ){
                            this.notifier.show({
                                type: 'success',
                                message: 'Proceso eliminado'
                            });

                            this.store$.dispatch(new ProcessActions.RemoveProcess(process.id));

                            this.deleteItem(process.id);
                        } else {
                            this.errorMessage.setErrorMessage(process);
                        }
                    },
                    error => {
                        console.error(error);
                        this.errorMessage.setErrorMessage(error);
                    }
                );
            }
        });
    }

    deleteItem(idItem){
        const data = this.dataSource.data;
        const index = data.findIndex(x => x.id === idItem);

        if (index > -1) {
            data.splice(index, 1);
        }

        this.dataSource.data = data;
    }

}
