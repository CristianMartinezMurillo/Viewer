import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { faEdit, faTrashAlt, faSitemap, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { isNullOrUndefined, isObject} from "util";
import { ErrorMessageComponent } from "../../messages/error-message/error-message.component";
import { TREE_ACTIONS, KEYS, IActionMapping, ITreeOptions, TreeModel, TreeNode, TreeComponent } from 'angular-tree-component';
import { faTasks } from "@fortawesome/free-solid-svg-icons/faTasks";
import { NewTaskDialogComponent } from "../new-task/new-task-dialog.component";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faSearchPlus } from "@fortawesome/free-solid-svg-icons/faSearchPlus";
import { Observable, Subject } from "rxjs";
import { Store } from "@ngrx/store";
import * as MailboxReducer from '../../_store/reducers/mailbox.reducer';
import * as MailboxSelector from '../../_store/selectors/mailbox.selector';
import { filter, takeUntil } from "rxjs/operators";
import {OrganizationalUnitModel} from "../../_models/OrganizationalUnit.model";

const USER_NODE = "user";
const TASK_NODE = "task";
const ORGANIZATIONAL_UNIT_NODE = "organizationalUnit";

export interface TaskNodeModel {
    // addresseeType: node.addresseeType, //organizationalUnit_id con el cual se asigna relación entre una tarea y un área.
    // addressee_id: node.addressee_id,
    organizationalUnit_id: number;
    description: string;
    user_id: number;
}

export interface AddresseeNodeModel {
    addressee_id: number;
    addresseeType: string;
    CC: boolean;
    CCC: boolean;
    TURNAR: boolean;
    user_id?: number;
    organizationalUnitId?: number;
}

/**
 *  Overwrite actions of the tree component
 * @type {{mouse: {click: ((treeModel, node, $event)); checkboxClick: ((treeModel, node, $event))}; keys: {}}}
 */
const actionMapping:IActionMapping = {
    mouse: {
        click: function(treeModel,node,$event){

        },
        checkboxClick: function(treeModel,node,$event){

        },
    },
    keys: {
        // [KEYS.ENTER]: (tree, node, $event) => alert(`This is ${node.data.name}`)
    }
}

/**
 * This class builds the recipientOptions tree (Users and Organizational Unit) and it allows to select them and add tasks
 */

@Component({
    selector: 'app-addressee-tree',
    templateUrl: './addressee-tree.component.html',
    styleUrls: ['./addressee-tree.component.css']
})
export class AddresseeTreeComponent implements OnInit, OnDestroy {
    @ViewChild('tree') treeComponent: TreeComponent;
    @ViewChild(ErrorMessageComponent) errorMessage;
    @Input() data: { addresseeType: string, data: Array<any> };

    destroy: Subject<void> = new Subject();

    currentOrganizationalUnitId: number;

    faEdit = faEdit;
    faDelete = faTrashAlt;
    faTask = faTasks;
    faTrash = faTrash;
    faSearch = faSearchPlus;
    subjectType$: Observable<any>;

    addresseType;

    users = [];
    organizationalUnit = [];

    nodes = [];
    options: ITreeOptions = {
        // useCheckbox: true,
        // useTriState: false,
        useVirtualScroll: false,
        actionMapping,  //Actions over the tree
        // scrollContainer: <HTMLElement>document.body.parentElement
    };



    constructor(
        private dialog: MatDialog,
        private store$: Store<MailboxReducer.State>
    ) {
    }

    ngOnInit() {
        this.store$.select(MailboxSelector.getCurrentOrganizationalUnitId)
            .pipe(
                takeUntil(this.destroy),
                filter(data => data !== null)
            )
            .subscribe(response => {
                this.currentOrganizationalUnitId = response;
            });
    }

    // buildTree(addresseeType, users, organizationalUnit) {
    buildTree(addresseeType, data) {
        this.addresseType = addresseeType;

        this.refreshTree();

        if (addresseeType === 'user') {
            this.buildUsersTree(data);
        } else {
            if(data.length > 0) {
                this.buildOrganizationalUnitTree(data);
            }
        }

    }

    refreshTree(){
        let roots = this.treeComponent.treeModel.roots;

        if (!isNullOrUndefined(roots)) {
            roots.forEach(function(root){
                if(root.hasOwnProperty('data') && root.data.hasOwnProperty('children'))
                    root.parent.data.children.splice(root.parent.data.children.indexOf(root.data), 1)
            });
        }

        this.updateTree();
    }

    buildUsersTree(usersObject){
        this.users = usersObject;

        if(! (this.users.length > 0 ))
            this.updateTree();

        for (let user of this.users){
            let userNode = this.userNodeData(user);
            this.addNode(userNode);
        }
    }

    updateTree() {
        this.treeComponent.treeModel.update();
    }

    buildOrganizationalUnitTree(organizationalUnitObject){
        let self = this;

        this.organizationalUnit = organizationalUnitObject;


        this.organizationalUnit.forEach(function(organizationalUnit, cont) {
            self.organizationalUnit[cont] = self.organizationalUnitNodeData(self.organizationalUnit[cont]);

            if(!isNullOrUndefined(self.organizationalUnit[cont].children) && self.organizationalUnit[cont].hasOwnProperty('children')) {
                self.organizationalUnit[cont].children = self.buildChildrenNode(self.organizationalUnit[cont].children);
            }

            self.nodes.push(self.organizationalUnit[cont]);

        });

        this.updateTree();
    }

    buildChildrenNode(childrenNodes : Array<any>) {
        let self = this;

        let children = childrenNodes.map(data => {
            return Object.assign({}, data);
        });

        children.forEach(function(node, index) {
            children[index] = self.organizationalUnitNodeData(children[index]);

            if(children[index].hasOwnProperty('children')) {
                children[index].children = self.buildChildrenNode(children[index].children);
            }
        });

        return children;
    }

    userNodeData(user_){
        const user = user_.user;
        return {
            id: user.id,
            name: user.name,
            nodeType: USER_NODE,
            icon: faUser,
            CC: false,
            TURNAR: false,
            organizationalUnitId: this.currentOrganizationalUnitId,
            user_id: user.id
        }
    }

    organizationalUnitNodeData(organizationalUnitObject: OrganizationalUnitModel){
        return {
            id: organizationalUnitObject.id,
            name: organizationalUnitObject.name,
            description: organizationalUnitObject.description,
            parent_id: organizationalUnitObject.parent_id,
            nodeType: ORGANIZATIONAL_UNIT_NODE,
            icon:  faSitemap,
            CC: false,
            TURNAR:  false,
            canReceiveSubjects: organizationalUnitObject.canReceiveSubjects,
            children: organizationalUnitObject.children,
            hidden: (organizationalUnitObject.hasOwnProperty('hidden')) ? organizationalUnitObject.hidden : false,
        };
    }


    addNode(newNode, active = false) {
        let parentNode;

        if (newNode.parent_id > 0) {
            parentNode = this.treeComponent.treeModel.getNodeBy((node) => node.data.id === newNode.parent_id);
        }

        newNode.children = [];


        if (!isNullOrUndefined(parentNode)) {
            parentNode.data.children.push(newNode);
        }
        else {
            this.nodes.push(newNode);
        }

        this.updateTree();

        if (active) {
            let child = this.treeComponent.treeModel.getNodeBy((node) => node.data.id === newNode.id);
            child.setActiveAndVisible(true);
        }
    }

    hasAddresseeSelected() : boolean {
        let node;

        if(this.treeComponent.treeModel.nodes !== undefined)
            node = this.treeComponent.treeModel.getNodeBy(node => node.data.nodeType !== TASK_NODE && (node.data.CC === true || node.data.TURNAR === true) );

         return isNullOrUndefined(node) ? false : true;
    }

    getAddresseeSelected() : {tasks: Array<TaskNodeModel>, addressee: Array<any>, nodes: Array<any>}{
        let self = this;
        let nodes = this.getAllNodes();
        let recipients = [];
        let tasks = [];
        let selectedNodes = [];

        /** filter nodes by selected and CC */
        nodes.forEach(node => {

            if(node.nodeType === TASK_NODE){
                tasks.push(self.mapNodeTask(node));
            }else {
                if(node.CC === true || node.TURNAR === true || node.CCC === true){
                    recipients.push(self.mapNode(node));
                    selectedNodes.push({...node, children: null});
                }
            }
        });


        return {tasks: tasks, addressee: recipients, nodes: selectedNodes};
    }

    mapNodeTask(node) {
        let taskNode : TaskNodeModel = {
            // addresseeType: node.addresseeType, //organizationalUnit_id con el cual se asigna relación entre una tarea y un área.
            // addressee_id: node.addressee_id,
            organizationalUnit_id: (isNullOrUndefined(node.organizationalUnit_id)) ? null : node.organizationalUnit_id,
            description: node.description,
            user_id: (isNullOrUndefined(node.user_id)) ? null : node.user_id
        };

        return taskNode;
    }

    mapNode(node) : AddresseeNodeModel{

        if (node.nodeType === ORGANIZATIONAL_UNIT_NODE){
            let organizationalUnitNode = {
                addressee_id: node.id,
                addresseeType: node.nodeType,
                CC: node.CC,
                CCC: node.CCC,
                TURNAR: node.TURNAR
            };

            return organizationalUnitNode;
        }else { /** if is user */
            return {
                addressee_id: node.id,
                addresseeType: node.nodeType,
                user_id: node.user_id,
                CC: node.CC,
                CCC: node.CCC,
                TURNAR: node.TURNAR,
                organizationalUnitId: node.organizationalUnitId
            }
        }

    }

    getAllNodes(): Array<any>{
        let addressee = Object.assign([],  this.treeComponent.treeModel.nodes);
        let self = this;

        for(let index = 0; index < addressee.length; index++){
            let node = addressee[index];

            if(node.nodeType === TASK_NODE){
                let taskNode = Object.assign({}, node);

                let addresseeIndex;

                if(taskNode.user_id !== null) {
                    addresseeIndex = addressee.find(x => x.id === taskNode.user_id);
                } else {
                    addresseeIndex = addressee.find(x => x.id === taskNode.organizationalUnit_id);
                }

                if(!isNullOrUndefined(addresseeIndex)){
                    if(!addresseeIndex.hasOwnProperty('tasks')){
                        addresseeIndex.tasks = [taskNode];
                    } else {
                        if(isNullOrUndefined(addresseeIndex.tasks.find(node => node.id === taskNode.id)))
                            addresseeIndex.tasks.push(taskNode);
                    }

                }
            }else{
                if(node.hasOwnProperty('children') && node.children.length > 0) {
                    let children = Object.assign([], node.children);
                    addressee = [...addressee, ...children];
                }
            }

        }

        return addressee;
    }

    changeCC($event, node, turnarCheckBoxOU, CCCheckBox, CCCCheckbox): void{

        /** if the node has tasks */
        if(this.hasTaskChildren(node)) {
            console.log("hasTaskChilden");

            // turnarCheckBoxOU.checked = true;
            CCCheckBox.checked = false;
            CCCCheckbox.checked = false;

            node.data.TURNAR = true;
            node.data.CC = false;
            node.data.CCC = false;

            return;
        }

        node.data.CC = $event.checked;
        node.CC = $event.checked;

        if($event.checked){
            turnarCheckBoxOU.checked = false;
            CCCCheckbox.checked = false;

            node.data.TURNAR = false;
            node.data.CCC = false;
        }
    }

    changeCCC($event, node, turnarCheckBoxOU, CCCheckBox, CCCCheckbox): void{
        /** if the node has tasks */
        if(this.hasTaskChildren(node)) {
            turnarCheckBoxOU.checked = true;
            CCCheckBox.checked = false;
            CCCCheckbox.checked = false;

            node.data.TURNAR = true;
            node.data.CC = false;
            node.data.CCC = false;

            return;
        }

        node.data.CCC = $event.checked;
        node.CCC = $event.checked;

        if($event.checked){
            turnarCheckBoxOU.checked = false;
            CCCheckBox.checked = false;

            node.data.TURNAR = !$event.checked;
            node.data.CC = false
        }
    }

    changeTurnar($event, node, turnarCheckBoxUser, CCCheckBox, CCCCheckBox){

        /** if node has task it must to keep activated */
        if(this.hasTaskChildren(node)) {
            turnarCheckBoxUser.checked = true;
            CCCheckBox.checked = false;
            CCCCheckBox.checked = false;

            node.data.TURNAR = true;
            node.data.CC = false;
            node.data.CCC = false;

            return;
        }

        node.data.TURNAR = $event.checked;
        node.TURNAR = $event.checked;

        if($event.checked) {

            CCCheckBox.checked = false;
            CCCCheckBox.CCC = false;

            node.data.CCC = false;
            node.data.CC = false;
        }

    }

    hasTaskChildren(node : TreeNode) {
        let hasTask = false;

        node.data.children.forEach(function(child) {
            if(child.nodeType === TASK_NODE) {
                hasTask = true;
            }
        });

        return hasTask;
    }

    newTaskDialog(addresseeNode){
        let dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.data = addresseeNode;
        dialogConfig.width = '500px';
        // dialogConfig.height = '500px';

        const dialog = this.dialog.open(NewTaskDialogComponent, dialogConfig);

        dialog.afterClosed().subscribe(newTask => {
            /**
             * this object is received if the subject was created
             * {
             *    subject: "subject description"
             * }
             */
            if(isObject(newTask)){
                this.addTaskNode(newTask, addresseeNode);
            }
        });
    }

    deleteTask(node: TreeNode) : void {
        if (node.parent != null) {
            node.parent.data.children.splice(node.parent.data.children.indexOf(node.data), 1)
            this.updateTree();
        }
    }

    taskNodeData(taskNodeDialog, addresseeNode) {
        if(addresseeNode.data.nodeType === 'organizationalUnit'){
            return {
                id: this.ID(),
                organizationalUnit_id: addresseeNode.data.id,
                // addresseeType: addresseeNode.data.nodeType,
                icon: faTasks,
                name: taskNodeDialog.description,
                description: taskNodeDialog.description,
                nodeType: TASK_NODE,
                children: [],
                user_id: null,
            }
        }
        if(addresseeNode.data.nodeType === 'user'){
            return {
                id: this.ID(),
                organizationalUnit_id: addresseeNode.data.organizationalUnitId,
                // addresseeType: addresseeNode.data.nodeType,
                icon: faTasks,
                name: taskNodeDialog.description,
                description: taskNodeDialog.description,
//            parent_id: addresseeNode.data.id,
                nodeType: TASK_NODE,
                children: [],
                user_id: addresseeNode.id
            }
        }
    }

    addTaskNode(taskNodeDialog, addresseeNode: TreeNode){
        let taskNode = this.taskNodeData(taskNodeDialog, addresseeNode);
        //parentNode = this.treeComponent.treeModel.getNodeBy((node) => node.data.id === newNode.parent_id);
        addresseeNode.data.children.unshift(taskNode);

        addresseeNode.data.CC = false;
        addresseeNode.data.CCC = false;
        addresseeNode.data.TURNAR = true;

        this.updateTree();

        let nodeTask = this.treeComponent.treeModel.getNodeBy((node) => node.data.id === taskNode.id);

        nodeTask.setActiveAndVisible();

        return taskNode;
    }

    ID () {
        // Math.random should be unique because of its seeding algorithm.
        // Convert it to base 36 (numbers + letters), and grab the first 9 characters
        // after the decimal.
        return '_' + Math.random().toString(36).substr(2, 9);
    };

    /**
     *
     * @param text
     */
    filterNodes(text) {
        if(text.trim().length > 0)
            this.treeComponent.treeModel.filterNodes(text.trim(), true);
        else
            this.treeComponent.treeModel.clearFilter();
    }

    ngOnDestroy(): void {
        console.log("destroy");
        this.destroy.next();
    }
}
