import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { UsersService } from "../../_services/users.service";
import { isNullOrUndefined, isObject } from "util";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { ErrorMessageComponent } from "../../messages/error-message/error-message.component";
import { MatDialog, MatDialogConfig } from "@angular/material";
import { MembersDialogComponent } from "../members/members-dialog.component";
import { TaskService } from "../../_services/task.service";
import { TaskAnswerDialogComponent } from "../task-answer/task-answer-dialog.component";
import { faReply } from "@fortawesome/free-solid-svg-icons/faReply";
import { WarningConfirmationDialogComponent } from "../../dialog/warning-confirmation-dialog/warning-confirmation-dialog.component";
import { TaskModel } from "../_models/task.model";
import { faRedo } from "@fortawesome/free-solid-svg-icons/faRedo";
import * as MailboxSelector from "../../_store/selectors/mailbox.selector";
import { take } from "rxjs/operators";
import { Store } from "@ngrx/store";
import * as MailboxReducer from "../../_store/reducers/mailbox.reducer";
import * as SubjectActions from '../../_store/actions/subject.actions';
import * as SubjectReducer from '../../_store/reducers/subject.reducer';
import * as SubjectSelector from '../../_store/selectors/subject.selector';
import { Observable } from "rxjs";

@Component({
  selector: 'app-subject-tasks',
  templateUrl: './subject-tasks.component.html',
  styleUrls: ['./subject-tasks.component.css']
})
export class SubjectTasksComponent implements OnInit, OnChanges {
  tasks: Observable<Array<TaskModel>>;
  @Input() subjectRequestId;

  @ViewChild( ErrorMessageComponent ) errorMessage;
  faReopen = faRedo;
  faUser = faUser;
  organizationalUnitUsers;
  answerIcon = faReply;
  organizationalUnitId: number = null;

  constructor(
      private userService: UsersService,
      private dialog: MatDialog,
      private taskService: TaskService,
      private store$: Store<MailboxReducer.State>,
      private subject$: Store<SubjectReducer.State>
  ) { }

    ngOnInit() {
        this.store$.select(MailboxSelector.getCurrentOrganizationalUnitId)
            .pipe(take(1))
            .subscribe(
                response => {
                    this.organizationalUnitId = response;

                    if(this.userService.isTitular(this.organizationalUnitId) || this.userService.isAsistente(this.organizationalUnitId)) {
                        this.getOperadoresByUnidadOrganizacional();
                    }
                }
            )

        this.tasks = this.subject$.select(SubjectSelector.getSubjectTasks);
    }
    private getOperadoresByUnidadOrganizacional(){
      this.userService.getOperadoresByUnidadOrganizacional(this.organizationalUnitId).subscribe(
          response => {
            if( response['status'] ){
              this.organizationalUnitUsers = response['users'];
            }else{
              this.errorMessage.setErrorMessage(response);
            }
          },
          error => {
              this.errorMessage.setErrorMessage(error);
          }
      );
    }

    /**
     *
     * @param task
     */
    private canSeeTask(task): boolean {
        return ((this.userService.isTitular(this.organizationalUnitId) || this.userService.isAsistente(this.organizationalUnitId))
            || task.userAssigned !== null && task.userAssigned.id === this.userService.userData.id);
    }

    /**
     *
     * @param task
     */
    private canAssignTask(task): boolean {
      return ((this.userService.isTitular(this.organizationalUnitId) || this.userService.isAsistente(this.organizationalUnitId))
          // || task.userAssigned.id === this.userService.userData.id
          && task.completed == false);
    }

    /**
     *
     * @param task
     */
    private canFinishTask(task): boolean {
        return (((this.userService.isTitular(this.organizationalUnitId) || this.userService.isAsistente(this.organizationalUnitId))
        || task.userAssigned !== null && task.userAssigned.id === this.userService.userData.id)
            && task.completed == false);
    }

    /**
     *
     * @param task
     */
    private canReopenTask(task): boolean {
        return ((this.userService.isTitular(this.organizationalUnitId) || this.userService.isAsistente(this.organizationalUnitId))
            && task.completed == true);
    }

    private showUsersDialog(task){
        let dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {users: this.organizationalUnitUsers};
        dialogConfig.maxWidth = '400px';
        // dialogConfig.maxHeight = '700px';
        // dialogConfig.panelClass = 'dialog-confirmation-class';

        const dialog = this.dialog.open(MembersDialogComponent, dialogConfig);

        dialog.afterClosed().subscribe(userSelected => {
            if(isObject(userSelected)){

                let params = {
                    taskId: task.id,
                    userId: userSelected.id,
                    subjectRequestId: this.subjectRequestId
                };

                this.taskService.assignUser(params).subscribe(
                    response => {
                        if(response['status']){

                            /**
                             * Link user with subject this will show the assigned user in the interface
                             */
                            // task = { ...task, userAssigned: userSelected, addressee_id: userSelected.id };
                            this.subject$.dispatch(new SubjectActions.AsignTaskToUser(task, userSelected));

                            // this.tasks = this.tasks.map(data => {
                            //
                            //     if (data.id === task.id) {
                            //         return task;
                            //     }
                            //
                            //     return data;
                            // });

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
        });
    }

    private openTaskAnswerDialog(task){
        let dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.data = task;
        dialogConfig.maxWidth = '1000px';
        dialogConfig.width = '800px';
        // dialogConfig.maxHeight = '700px';
        // dialogConfig.panelClass = 'dialog-confirmation-class';

        const dialog = this.dialog.open(TaskAnswerDialogComponent, dialogConfig);

      /**
       * answer returned from server
       *
       * answer = {
       *     answer: "answer description",
       *     user {
       *         id:
       *         name:
       *         last_name,
       *
       *     },
       *     documents: {
       *
       *     }
       * }
       */

        dialog.afterClosed().subscribe(answer => {

            if (isObject(answer)) {
                // let tasks = Object.assign([], this.tasks);
                //
                // let answers = [];
                //
                // if(task.answers === undefined || task.answers === null) {
                //     answers.push(answer);
                // } else {
                //     answers = Object.assign([], task.answers);
                //     answers.push(answer);
                // }

                this.subject$.dispatch(new SubjectActions.AddTaskAnswer(task, answer));

                // const findTask = tasks.findIndex(data => data.id === task.id);
                //
                // if (findTask > -1) {
                //     tasks[findTask] = {...tasks[findTask], answers: answers};
                //     this.tasks = tasks;
                // }
            }
        });

    }

    /**
     *
     * @param task
     */
    private finishTask(task) {
        let dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {title: 'Confirmación', textContent: 'Esta a punto de marcar esta tarea como completada.'};
        dialogConfig.maxWidth = '600px';
        dialogConfig.width = '400px';
        // dialogConfig.maxHeight = '700px';
        dialogConfig.panelClass = 'dialog-confirmation-class';

        const dialog = this.dialog.open(WarningConfirmationDialogComponent, dialogConfig);

        dialog.afterClosed().subscribe(userConfirmation => {
            if (!isNullOrUndefined(userConfirmation) && userConfirmation.confirmation) {
                this.taskService.markAsCompleted(task.id).subscribe(
                    response => {
                        if(response['status']) {
                            // task = {...task, completed: true}
                            this.subject$.dispatch(new SubjectActions.UpdateTaskStatus(task, true));
                        } else {
                            this.errorMessage.setErrorMessage(response);
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

    /**
     *
     * @param task
     */
    private reopenTask(task: TaskModel) {
        let dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {title: 'Confirmación', textContent: 'Esta a punto de reabrir esta tarea. ¿Desea continuar?'};
        dialogConfig.maxWidth = '600px';
        dialogConfig.width = '400px';
        // dialogConfig.maxHeight = '700px';
        dialogConfig.panelClass = 'dialog-confirmation-class';

        const dialog = this.dialog.open(WarningConfirmationDialogComponent, dialogConfig);

        dialog.afterClosed().subscribe(userConfirmation => {
            if (!isNullOrUndefined(userConfirmation) && userConfirmation.confirmation) {
                this.taskService.reopenTask(task.id).subscribe(
                    response => {
                        if(response['status']) {
                            // task = {...task, completed: false}
                            this.subject$.dispatch(new SubjectActions.UpdateTaskStatus(task, false));
                        } else {
                            this.errorMessage.setErrorMessage(response);
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

    ngOnChanges(changes: SimpleChanges): void {

    }

}
