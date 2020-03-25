import { Component, OnInit, ViewChild} from '@angular/core';
import { OrganizationalUnitService} from "../_services/organizational-unit.service";
import { ErrorMessageComponent} from "../messages/error-message/error-message.component";
import { faBan, faBuilding, faSitemap, faUsers } from "@fortawesome/free-solid-svg-icons";
import { faSearchPlus } from "@fortawesome/free-solid-svg-icons/faSearchPlus";
import { TREE_ACTIONS, KEYS, IActionMapping, ITreeOptions, TreeModel, TreeNode, TreeComponent } from 'angular-tree-component';
import {isNullOrUndefined} from "util";
import {MatDialogRef} from "@angular/material";

const ORGANIZATIONAL_UNIT_NODE = "organizationalUnit";
const COMPANY_NODE = "company";
const PREFIX_COMPANY_NODE = "company_";

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

@Component({
  selector: 'app-organizational-unit-tree-dialog',
  templateUrl: './organizational-unit-tree-dialog.component.html',
  styleUrls: ['./organizational-unit-tree-dialog.component.css']
})
export class OrganizationalUnitTreeDialogComponent implements OnInit {
  @ViewChild('tree') treeComponent: TreeComponent;
  @ViewChild( ErrorMessageComponent ) errorMessage;

  loading : boolean = true;
  organizationalUnitIconTitle = faSitemap;

  faUsers = faUsers;
  faSearch = faSearchPlus;
  faCompany = faBuilding;
  faCancel = faBan;

  faOrganizationalUnit = faSitemap;
  treeModel:TreeModel;

  nodes = [];
  companies = [];

  treeOptions = {
    useVirtualScroll: false,
    //nodeHeight: (node: TreeNode) => node.myHeight,
    //dropSlotHeight: 3
  }

  constructor(
      private organizationalUnitService: OrganizationalUnitService,
      private dialogRef : MatDialogRef<OrganizationalUnitTreeDialogComponent>
  ) { }

  ngOnInit() {
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

  buildTree(data) {
    let organizationalUnit = data.organizationalUnit;

    this.companies = data.companies;

    if(this.companies.length === 0 && organizationalUnit.length === 0) {
      this.loading = false;
      return 0;
    }

    for (let index = 0; index < this.companies.length; index++){

      let companyNodeData         = this.companies[index];
      this.companies[index].company_id  = companyNodeData.id;
      this.companies[index].id          = PREFIX_COMPANY_NODE + companyNodeData.id;
      this.companies[index].nodeType    = COMPANY_NODE;

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

  selectOrganizationalUnit() : TreeNode {
    let activeNode = this.treeComponent.treeModel.getActiveNode();

    if(isNullOrUndefined(activeNode))
      return null;

    this.dialogRef.close( activeNode );
  }
}
