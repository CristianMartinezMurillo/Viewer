import { Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import * as shape from 'd3-shape';
import { Store } from "@ngrx/store";
import * as SubjectReducer from '../../_store/reducers/subject.reducer';
import * as SubjectActions from '../../_store/actions/subject.actions';
import * as SubjectSelector from '../../_store/selectors/subject.selector';
import { SubjectFlowModel } from "../../_models/SubjectRequest.model";
import { filter, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import * as ReceptionType from '../../_constants/ReceptionType.constants';
import { DagreNodesOnlyLayout } from './customDagreNodesOnly'
import { Edge, Node, Layout } from '@swimlane/ngx-graph';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit, OnDestroy {
  destroy$: Subject<void> = new Subject();

  subjectFlow: Array<SubjectFlowModel>;

  curves = {
    Basis: shape.curveBasis,
    'Basis Closed': shape.curveBasisClosed,
    Bundle: shape.curveBundle.beta(1),
    Cardinal: shape.curveCardinal,
    'Cardinal Closed': shape.curveCardinalClosed,
    'Catmull Rom': shape.curveCatmullRom,
    'Catmull Rom Closed': shape.curveCatmullRomClosed,
    Linear: shape.curveLinear,
    'Linear Closed': shape.curveLinearClosed,
    'Monotone X': shape.curveMonotoneX,
    'Monotone Y': shape.curveMonotoneY,
    Natural: shape.curveNatural,
    Step: shape.curveStep,
    'Step After': shape.curveStepAfter,
    'Step Before': shape.curveStepBefore,
    default: shape.curveLinear
  };

  // line interpolation
  curveType: string = 'Monotone X';
  // curve: any = this.curves[this.curveType];

  view: any[];
  autoZoom: boolean = false;
  panOnZoom: boolean = true;
  enableZoom: boolean = false;
  autoCenter: boolean = true;
  showLegend: boolean = false;
  draggingEnabled: boolean = false;
  orientation = 'LR';
  colorScheme: any = {
    domain: ['#eadc55', '#e7b8b6', '#abcdef']
  };
  /*colorScheme: 'air';*/

  public layoutSettings = {
    orientation: "TB"
  }
  public curve: any = shape.curveLinear;
  public layout: Layout = new DagreNodesOnlyLayout();

  nodes: Array<any> = [];
  links: Array<Edge> = [];
  cluster: Array<any> = [];

  constructor(
      private store$: Store<SubjectReducer.State>,
  ) {
  }

  ngOnInit() {
    this.store$.select(SubjectSelector.getSubjectFlow)
        .pipe(
            takeUntil(this.destroy$),
            filter(data => data !== null)
        )
        .subscribe( subjectFlow => {
          console.log(subjectFlow);

          this.subjectFlow = subjectFlow.details;
          this.nodes = this.fetchNodes(subjectFlow.details);
          this.links = this.fetchLinks(subjectFlow.details);
        });


  }

  onLegendLabelClick($event) {
    console.log($event);
  }

  select($event) {

  }

  /**
   *
   * @param subjectFlow
   */
  fetchNodes(subjectFlow: Array<any>): any {
    let nodes = [];

    for (let value of subjectFlow) {

      let senderNode = {};
      let senderId;

      const senderStep = (parseInt(value.step) > 1) ? parseInt(value.step) - 1 : parseInt(value.step);

      console.log("senderStep: " + senderStep);

      senderId = String(value.senderOrganizationalUnit.id) + '_' + String(value.senderUser.id);

      if (value.senderUser !== null) { //User
        senderId =  String(value.senderOrganizationalUnit.id) + '_' + String(value.senderUser.id);
      } else { // OrganizationalUnit
        senderId =  String(value.senderOrganizationalUnit.id);
      }

      let existsSender = nodes.find(node => node.id === senderId);

      if (existsSender === undefined || existsSender === null) {
        senderNode = {
          id: senderId,
          label: value.senderOrganizationalUnit.name,
          user: (value.senderUser !== null) ? value.senderUser.name + ' ' + value.senderUser.last_name: '',
          step: value.step,
          senderOrganizationalUnitId: value.senderOrganizationalUnit.id,
          recipientType: value.recipientType
        };

        nodes.push(senderNode);
      }


      if (value.destinOrganizationalUnit === undefined || value.destinOrganizationalUnit === null) {
        continue;
      }

      let destinId;

      if (value.destinUser !== null) { // User
        destinId =String(value.destinOrganizationalUnit.id) + '_' + String(value.destinUser.id);
      } else { // OrganizationalUnit
        destinId =String(value.destinOrganizationalUnit.id);
      }

      let destinNode = {
        id: destinId,
        label: value.destinOrganizationalUnit.name,
        user: (value.destinUser !== null) ? value.destinUser.name + ' ' + value.destinUser.last_name : '',
        step: value.step,
        destinOrganizationalUnitId: value.destinOrganizationalUnit.id,
        recipientType: value.recipientType
      };

      const existsDestinNode = nodes.find(node => node.id === destinId);

      if (existsDestinNode === undefined || existsDestinNode === null) {
        nodes.push(destinNode);
      }
    }
    console.log(nodes);
    return nodes;
  }

  /**
   *
   * @param subjectFlow
   */
  fetchLinks(subjectFlow): any {
    let links = [];

    for (let cont = 0; cont < subjectFlow.length; cont++ ) {
      const value = subjectFlow[cont];
      if (value.destinOrganizationalUnit === undefined || value.destinOrganizationalUnit === null)
        continue;

      let senderId;
      let targetId;

      if (value.senderUser === null) { // OrganizationalUnit
        senderId = String(value.senderOrganizationalUnit.id);

      } else { // User
        senderId = String(value.senderOrganizationalUnit.id) + '_' + String(value.senderUser.id);
      }

      if (value.destinOrganizationalUnit === null) {
        continue;
      }

      if (value.destinUser === null) { // organizationalUnit
        targetId = String(value.destinOrganizationalUnit.id);
      } else { // User
        targetId = String(value.destinOrganizationalUnit.id) + '_' + String(value.destinUser.id);
      }

      let link = {
        "source": senderId,
        "target": targetId,
        "label": String(value.step),
        "receptionType": value.receptionType
      };

      links.push(link);
    }

    console.log(links);

    return links;
  }

  public getNodeStyles(node: Node): any {
    return {
      "background-color": '#abcdef',
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
