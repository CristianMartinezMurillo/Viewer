import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { faEdit, faPlusCircle, faTrashAlt, faSitemap, faUserFriends, faUsers, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { NewOrganizationalUnitDialogComponent } from "../new-organizational-unit/new-organizational-unit-dialog.component";
import { EditOrganizationalUnitDialogComponent } from "../edit-organizational-unit/edit-organizational-unit-dialog.component"
import { ErrorMessageComponent } from "../../messages/error-message/error-message.component";
import { isNullOrUndefined, isObject } from "util";
import { TREE_ACTIONS, KEYS, IActionMapping, ITreeOptions, TreeModel, TreeNode, TreeComponent } from 'angular-tree-component';
import { OrganizationalUnitService } from "../../_services/organizational-unit.service";
import { DangerConfirmationDialogComponent } from "../../dialog/danger-confirmation-dialog/danger-confirmation-dialog.component"
import { MembersDialogComponent } from "../members-dialog/members-dialog.component";
import { faSearchPlus } from "@fortawesome/free-solid-svg-icons/faSearchPlus";

const ORGANIZATIONAL_UNIT_NODE = "organizationalUnit";
const COMPANY_NODE = "company";
const PREFIX_COMPANY_NODE = "company_";
@Component({
  selector: 'app-organizational-unit-admin',
  templateUrl: './organizational-unit-admin.component.html',
  styleUrls: ['./organizational-unit-admin.component.css']
})
export class OrganizationalUnitAdminComponent implements OnInit, AfterViewInit {
    @ViewChild('tree') treeComponent: TreeComponent;
    @ViewChild(ErrorMessageComponent) errorMessage;

    treeOptions: ITreeOptions = {
        // useVirtualScroll: true,
        // nodeHeight: 22
    }

    loading : boolean = false;
    organizationalUnitIconTitle = faSitemap;
    organizationalUnitIcon = faUserFriends;
    addAdminUnit = faPlusCircle;
    deleteAdminUnit = faTrashAlt;
    faEdit = faEdit;
    faUsers = faUsers;
    faSearch = faSearchPlus;
    faCompany = faBuilding;
    faOrganizationalUnit = faSitemap;
    treeModel:TreeModel;
    nodes = [];
    companies = [];

    constructor(
        private dialog: MatDialog,
        private organizationalUnitService: OrganizationalUnitService,
    ) { }

  ngOnInit() {
        this.loading = true;

        this.organizationalUnitService.getWithCompanies().subscribe(
            response => {
                if(response.status)
                    this.buildTree(response);
                else{
                    this.errorMessage.setErrorMessage(response);
                    this.loading = false;
                }
            },
            error => {
                console.error(error);
                this.loading = false;
                this.errorMessage.setErrorMessage(error);
            }
        );
  }

    ngAfterViewInit() {
    }

    /**
     * first create company tree and then add their organizational unit nodes
     * @param response
     */
    buildTree(response){
        let organizationalUnit = response.organizationalUnit;

        this.companies = response.companies;

        if(this.companies.length === 0 && organizationalUnit.length === 0) {
            this.loading = false;
            return 0;
        }

        for (let index = 0; index < this.companies.length; index++){

            let companyNodeData         = this.companies[index];
            this.companies[index].company_id  = companyNodeData.id;
            this.companies[index].id          = PREFIX_COMPANY_NODE + companyNodeData.id;
            this.companies[index].nodeType    = COMPANY_NODE;
            this.companies[index].level       = 0;

        }

        for (let index = 0; index < organizationalUnit.length; index++){

            let organizationalUnitNodeData      = organizationalUnit[index];
            // organizationalUnitNodeData.nodeType = ORGANIZATIONAL_UNIT_NODE;
            // organizationalUnitNodeData.icon                = faSitemap;

            let findCompany = this.companies.filter(function(company) {
                return company.id === PREFIX_COMPANY_NODE + organizationalUnitNodeData.company.id;
            });

            if(findCompany.length > 0) {
                let company = findCompany[0];

                if(!company.hasOwnProperty("children")) {
                    company.children = [organizationalUnitNodeData];
                } else {
                    company.children .push(organizationalUnitNodeData);
                }
            }

        }

        let self = this;
        this.companies.forEach(function(company) {
            self.nodes.push(company);
        });

        this.treeComponent.treeModel.update();

        this.treeComponent.treeModel.getVisibleRoots().forEach(function(root) {
            root.expand();
        });

        this.loading = false;
    }

    addNode(newNode, active = false){
        let parentNode;

        if( newNode.nodeType === COMPANY_NODE) {
        }else{
            if(newNode.parent_id > 0){
                parentNode = this.treeComponent.treeModel.getNodeBy((node) => node.data.id === newNode.parent_id);
            }
            else{
                parentNode = this.treeComponent.treeModel.getNodeBy((node) => node.data.id === PREFIX_COMPANY_NODE + newNode.company.id);
            }
        }

        newNode.children = [];

        if(!isNullOrUndefined(parentNode)){
            if(!parentNode.data.hasOwnProperty('children'))
                parentNode.data.children = [];

            parentNode.data.children.push(newNode);
        }
        else{
            this.nodes.push(newNode);
        }

        if(active){
            this.treeComponent.treeModel.update();

             let child = this.treeComponent.treeModel.getNodeBy((node) => node.data.id === newNode.id);

             child.setActiveAndVisible(true);
        }
    }

    newOrganizationalUnitDialog(){
        const activeNode:TreeNode = this.treeComponent.treeModel.getActiveNode();

        if(isNullOrUndefined(activeNode))
            return 0;

        let dialogConfig            = new MatDialogConfig();
        dialogConfig.disableClose   = false;
        dialogConfig.autoFocus      = true;
        dialogConfig.data           = activeNode.data;
        dialogConfig.maxWidth       = '400px';
        // dialogConfig.panelClass = 'dialog-confirmation-class';

        const dialog = this.dialog.open(NewOrganizationalUnitDialogComponent, dialogConfig);

        dialog.afterClosed().subscribe(response => {
            if(isObject(response)){
                let organizationalUnit = response.organizationalUnit;
                organizationalUnit.nodeType = ORGANIZATIONAL_UNIT_NODE;
                organizationalUnit.icon     = faSitemap;


                activeNode.setIsActive(false);
                activeNode.setIsSelected(false);

                this.addNode(organizationalUnit, true);

            }
        });
    }

    /**
     * Delete only organizational unit nodes
     * @returns {number}
     */
    deleteOrganizationUnitDialog(){
        let activeNode = this.treeComponent.treeModel.getActiveNode();

        if(isNullOrUndefined(activeNode) || activeNode.data.nodeType === COMPANY_NODE)
            return 0;

        let dialogConfig            = new MatDialogConfig();
        dialogConfig.disableClose   = false;
        dialogConfig.autoFocus      = true;
        dialogConfig.data           = {title: 'Precaución', textContent: '¿Realmente desea eliminar la unidad organizacional '
                                        + activeNode.data.name + "?  Este proceso no puede revertirse y se eliminaran los asuntos asociados."};
        dialogConfig.maxWidth       = '300px';
        dialogConfig.panelClass     = 'dialog-confirmation-class';

        const dialog = this.dialog.open(DangerConfirmationDialogComponent, dialogConfig);

        dialog.afterClosed().subscribe(confirmation => {
           if(isObject(confirmation) && confirmation.confirmation){
               this.organizationalUnitService.delete(activeNode.data.id).subscribe(
                   response => {

                       if(response.status){
                             this.deleteNode(activeNode);
                       }else{
                           this.errorMessage.setErrorMessage(response);
                       }
                   },
                   error => {
                       this.errorMessage.setErrorMessage(error);
                   }
               );
           }
        });
    }

    deleteNode(node: TreeNode) : void {
        if (node.parent != null) {
            node.parent.data.children.splice(node.parent.data.children.indexOf(node.data), 1)
            this.treeComponent.treeModel.update()
        }
    }

    updateNode(id, newData){
        let node = this.treeComponent.treeModel.getNodeBy((node) => node.data.id === id)

        for(let key in newData){
            if(!isNullOrUndefined(node.data[key]))
                node.data[key] = newData[key];
        }

        this.treeComponent.treeModel.update();
    }

    /**
     * Edit only organizational unit nodes
     * @returns {number}
     */
    edit(){
        let activeNode = this.treeComponent.treeModel.getActiveNode();

        if(isNullOrUndefined(activeNode) || activeNode.data.nodeType === COMPANY_NODE)
            return 0;

        let dialogConfig            = new MatDialogConfig();
        dialogConfig.disableClose   = false;
        dialogConfig.autoFocus      = true;
        dialogConfig.data           = activeNode.data;
        dialogConfig.maxWidth       = '400px';

        const dialog = this.dialog.open(EditOrganizationalUnitDialogComponent, dialogConfig);

        dialog.afterClosed().subscribe(newdata => {
            if(isObject(newdata)){
                this.updateNode(activeNode.data.id, newdata);
            }
        });
    }

    /**
     * Manage members of organizational unit
     * @returns {number}
     */
    userInterface(){
        let activeNode = this.treeComponent.treeModel.getActiveNode();

        if(isNullOrUndefined(activeNode) || activeNode.data.nodeType === COMPANY_NODE)
            return 0;

        let dialogConfig            = new MatDialogConfig();
        dialogConfig.disableClose   = true;
        dialogConfig.autoFocus      = true;
        dialogConfig.data           = activeNode.data;
        dialogConfig.maxWidth       = '800px';
        dialogConfig.minWidth       = '300px';
        dialogConfig.width          = '600px';
        // dialogConfig.height         = '800px';
        // dialogConfig.maxHeight      = '800px';

        const dialog = this.dialog.open(MembersDialogComponent, dialogConfig);

        dialog.afterClosed().subscribe(response => {
            if(isObject(response)){
            }
        });

    }

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

    initializedTree() {
    }
}
