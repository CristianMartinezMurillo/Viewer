import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { faBuilding } from '@fortawesome/free-solid-svg-icons';
import { ProcessService } from "../_services/process.service";
import { CompanyService } from "../_services/company.service";
import { TREE_ACTIONS, KEYS, IActionMapping, ITreeOptions, TreeModel, TreeNode, TreeComponent } from 'angular-tree-component';
import {isNull, isNullOrUndefined} from "util";
import { Router } from "@angular/router";
import { ProcessTreePanelService } from "./process-tree-panel.service";
import {
    COMPANY_NODE,
    MailboxNodes,
    MAILBOX_CODES,
    INBOX_NODE,
    PREFIX_COMPANY_NODE,
    PREFIX_PROCESS_NODE,
    PROCESS_NODE,
    PROCESS_ROOT_NODE,
    getMailboxId,
    PREFIX_INBOX, NUEVO_CODE, PREFIX_ORGANIZATIONAL_UNID, PREFIX_PROCESS_NODE_ROOT
} from "./_models/MailboxNodes";
import { TreeNodeModel } from "./_models/TreeNode.model";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons/faFileAlt";
import { MailboxService } from "../_services/mailbox.service";
import * as MailboxActions from "../_store/actions/mailbox.actions";
import { Store } from "@ngrx/store";
import * as ProcessReducer from '../_store/reducers/process.reducer';
import * as ProcessActions from '../_store/actions/process.actions';
import * as ProcessSelector from '../_store/selectors/process.selector';
import * as MailboxReducer from "../_store/reducers/mailbox.reducer";
import * as MailboxSelector from "../_store/selectors/mailbox.selector";
import { Observable, Subject } from "rxjs";
import { UsersService } from "../_services/users.service";
import { takeUntil } from "rxjs/operators";
import {ProcessModel} from "../_models/process.model";

@Component({
  selector: 'app-process-tree',
  templateUrl: './process-tree.component.html',
  styleUrls: ['./process-tree.component.css']
})
export class ProcessTreeComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('tree') treeComponent: TreeComponent;

    destroy: Subject<void> = new Subject();

    processes = [];

    treeModel:TreeModel;

    nodes = [];

    mailboxSubscription: Observable<any>;

    treeOptions = {
            //useVirtualScroll: false,
            //nodeHeight: (node: TreeNode) => node.myHeight,
            //dropSlotHeight: 3
        }

    constructor(
        private processService: ProcessService,
        private companyService: CompanyService,
        private router: Router,
        private processTreeService: ProcessTreePanelService,
        private mailboxService: MailboxService,
        private store$: Store<MailboxReducer.State>,
        private process$: Store<ProcessReducer.State>,
        private userService: UsersService
    ) {

    }

    ngOnInit() {
        this.buildTreeNodes();

         this.store$.select(MailboxSelector.getMailboxUnread)
             .pipe(takeUntil(this.destroy))
             .subscribe(
            response => {
                this.setBadgeUnreadMailbox(response);
            }
        );

         this.process$.select(ProcessSelector.getProcesses)
             .pipe(takeUntil(this.destroy))
             .subscribe(processes => {
                 console.log(processes);
                 if (processes !== null) {
                     this.buildProcessTree(processes);
                 }
             });

    }

    buildProcessTree(processes: Array<ProcessModel>) {
        let self = this;

        if (this.userService.userData === null)
            return;

        const organizationalUnits = this.userService.userData.organizationalUnits as Array<any>;

        organizationalUnits.forEach(organizationalUnit => {
            let processRootNode = this.treeComponent.treeModel.getNodeBy((node) => node.data.id === PREFIX_PROCESS_NODE_ROOT + organizationalUnit.id);

            if(processRootNode !== null && processRootNode !== undefined) {
                processRootNode.data.children = [];
            }

            processes.forEach(function(node_) {
                let node = {...node_};
                let processNode = self.processNode(node, organizationalUnit.id);
                self.addProcessNode(organizationalUnit.id, processNode);
            });
        });

        this.treeComponent.treeModel.update();

        if(this.getProcessId > 0 && this.organizationalUnitFromUrl > 0 ) {
            const nodeId = PREFIX_PROCESS_NODE + this.getProcessId + '_' + this.organizationalUnitFromUrl;

            this.activateNodeById(nodeId);
        }
    }

    buildTreeNodes(): void{
        if(isNull(this.userService.userData))
            return;

        const self = this;
        const organizationalUnits = this.userService.userData.organizationalUnits as Array<any>;
        const roles = this.userService.userData.roles;

        organizationalUnits.forEach(function (organizationalUnit) {
            const role = roles.find(role => role.id === organizationalUnit.pivot.role_id);

            if (role === undefined)
                return;

            self.getMailboxes(organizationalUnit).forEach(function(mailbox){
                self.nodes.push(mailbox);
            });

            self.treeComponent.treeModel.update();

            let organizationalUnitNode = self.nodes.find((node) => node.id === PREFIX_ORGANIZATIONAL_UNID + organizationalUnit.id);

            if (isNullOrUndefined(organizationalUnitNode))
                return;

            organizationalUnitNode.children.push(PROCESS_ROOT_NODE(organizationalUnit.id));
        });


        this.treeComponent.treeModel.update();


        this.getUnreadMailbox();
    }

    processNode(process, organizationalUnitId): TreeNodeModel {
        process.process_id  = process.id;
        process.id          = PREFIX_PROCESS_NODE + process.id + "_" +organizationalUnitId;
        process.organizationalUnitId = organizationalUnitId;
        process.icon        = faFileAlt;
        process.name        = process.process_name_text;
        process.nodeType    = PROCESS_NODE;
        // process.company_id  = process.organizationalUnit.company.company_id;
        process.route       = ["panel/newSubject/" + process.process_id + '/' + organizationalUnitId, {processName: process.name}];

        return process;
    }

    get processNodeName() {
        return PROCESS_NODE;
    }

    get mailboxNodeName() {
        return INBOX_NODE;
    }

    addProcessNode(organizationalUnitId, processNode) {
        let parentNode = this.treeComponent.treeModel.getNodeBy((node) => node.data.id === PREFIX_PROCESS_NODE_ROOT + organizationalUnitId);

        if (parentNode === undefined || parentNode === null)
            return;

        processNode.route = ["panel/newSubject/"+ processNode.process_id + '/' + organizationalUnitId, {processName: processNode.name}];

        parentNode.data.children.push(processNode);

    }

    getMailboxes(organizationalUnitId) {
        return MailboxNodes(organizationalUnitId);
    }

    onClickNode(node){
        if(!isNullOrUndefined(node.data.route)){
            this.router.navigate(node.data.route);
        }
    }

    activateNode() : void{
        if(this.getUrlType === 'newSubject') {
            return;
        }

        const mailboxStatus = this.getMailboxType();

        let nodeId = getMailboxId(this.getUrlType, mailboxStatus)

        if(isNullOrUndefined(nodeId))
            return;


        this.activateNodeById(nodeId);
    }

    get getUrlType() {
        return this.urlArray[2];
    }

    getMailboxType() {
        return this.urlArray[3];
    }

    get getProcessId(): number {
        if (this.urlArray.length < 3 || isNullOrUndefined(this.urlArray[3]))
            return 0;

        const split =  this.urlArray[3].split(";");
        return parseInt(split[0]);
    }

    get organizationalUnitFromUrl(): number {
        if (this.urlArray.length < 4 || isNullOrUndefined(this.urlArray[4]))
            return 0;

        const split =  this.urlArray[4]
        return parseInt(split);
    }

    get urlArray() {
        return this.router.url.split("/");
    }

     activateNodeById(idNode: string) {
         const node = this.treeComponent.treeModel.getNodeBy((node) => node.data.id === idNode);

         if(!isNullOrUndefined(node))
            node.setActiveAndVisible(true);
    }

    setBadgeUnreadMailbox(unreadMailbox): void {
        if(this.nodes.length === 0)
            return;

        let inbox = this.treeComponent.treeModel.getNodeBy((node) => node.data.id === PREFIX_INBOX);

        if (isNullOrUndefined(inbox))
            return;

        inbox.children.map(node => {
            const counter = (unreadMailbox.hasOwnProperty(node.data.code)) ? unreadMailbox[node.data.code] : null;
            node.data.unread = counter;
        });

        this.treeComponent.treeModel.update();
    }

    getUnreadMailbox() {
        this.mailboxService.unreadMailbox().subscribe(
            response => {
                if (response['status']) {
                    this.store$.dispatch(new MailboxActions.StoreUnreadMailbox(response['unreadMailbox']));
                }
            } ,
            error => {
                console.error(error);
            }
        );
    }

    ngAfterViewInit() {
        this.activateNode();
    }

    ngOnDestroy() {
        this.destroy.next();
    }
}
