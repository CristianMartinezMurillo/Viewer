import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatRadioGroup } from '@angular/material';
import { isNullOrUndefined } from "util";
import { RecipientsModel } from '../../_models/recipients.model';
import * as NewSubjectSelector  from '../../_store/selectors/new-subject.selector';
import * as NewSubjectActions  from '../../_store/actions/new-subject.actions';
import * as NewSubjectReducer  from '../../_store/reducers/new-subject.reducer';
import * as SubjectReducer  from '../../_store/reducers/subject.reducer';
import * as SubjectSelector  from '../../_store/selectors/subject.selector';
import {take, takeUntil, mergeMap, filter, switchMap} from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { Subject} from "rxjs";

@Component({
  selector: 'app-recipients',
  templateUrl: './recipients.component.html',
  styleUrls: ['./recipients.component.css']
})
export class RecipientsComponent implements OnInit, OnDestroy {
  // @ViewChild('subjectSettingsComponent' ) subjectSettingsComponent: SubjectSettingsComponent;
  @ViewChild( 'addresseeRadio', null ) addresseeRadio : MatRadioGroup;
  @ViewChild( 'addresseeTreeComponent', null ) addresseeTreeComponent;

  addresseeTypeRadio: RecipientsModel;
  addresseeGroupButtonStatus: boolean = false;
  chosenItem;
  recipientType: number;
  subjectType: number;
  private destroyOrganizationalUnits$: Subject<void> = new Subject();
  private destroy: Subject<void> = new Subject();


  recipientOptions: Array<RecipientsModel> = [
    {
      name: "Unidad Organizacional",
      code: "organizationalUnit",
      description: "Marque las áreas para avanzar el asunto",
      checked: true
    },
    {
      name: "Responsable",
      description: "Marque los usuarios para avanzar el asunto",
      code: "user",
      checked: false
    },
    // {
    //     name: "Externo",
    //     code: "external",
    //     description: "Asignar un asunto externo.",
    //     checked: false
    // }
  ];

  constructor(
      private store$: Store<NewSubjectReducer.State>,
      private subject$: Store<SubjectReducer.State>
  ) { }

  ngOnInit() {
    // this.changeRecipientType(this.recipientOptions[0]);
    this.store$.select(NewSubjectSelector.getSubjectType).pipe(
        filter(subjectType => subjectType !== null),
        takeUntil(this.destroy)
    ).subscribe(subjectType => {

      this.subjectType = subjectType;

      if (subjectType === 2) {
        this.changeToModeExternalSubject();
      } else {
        this.changeToModeInternalSubject();
      }
    })
  }

  changeToModeExternalSubject() {
    this.chosenItem = this.recipientOptions[0];

    // this.subjectSettingsComponent.disabled();
    this.changeRecipientType(this.recipientOptions[0])
  }

  changeToModeInternalSubject() {
    // this.subjectSettingsComponent.enabled();
    this.chosenItem = this.recipientOptions[0];
    this.changeRecipientType(this.recipientOptions[0])
  }

  changeRecipientType(addressType: RecipientsModel){
    console.log("changeRecipientType", addressType);
    if(isNullOrUndefined(addressType))
      return 0;

    this.store$.dispatch(new NewSubjectActions.StoreRecipientType(addressType.code));

    this.addresseeRadio.value = addressType;

    this.addresseeTypeRadio = addressType;

    this.addresseeGroupButtonStatus = true;

    this.store$.select(NewSubjectSelector.getSubjectType).pipe(
        filter(subjectType => subjectType !== null),
        take(1)
    ).subscribe(subjectType => {
      console.log(subjectType);

      if(subjectType === 2) { // External
        this.addresseeGroupButtonStatus = false;

        this.store$.select(NewSubjectSelector.getOrganizationlUnits)
            .pipe(
                takeUntil(this.destroyOrganizationalUnits$),
                filter(data => data !== null && data.length > 0)
            )
            .subscribe(response => {
              console.log(response);

              if(response !== null && response !== undefined) {
                this.addresseeTreeComponent.buildTree(addressType.code, [...response]);
                this.addresseeGroupButtonStatus = false;
                this.destroyOrganizationalUnits$.next();
              }

            });
      } else { // Internal

        if(addressType.code === 'organizationalUnit') {

          this.store$.select(NewSubjectSelector.getOrganizationlUnits)
              .pipe(
                  takeUntil(this.destroyOrganizationalUnits$),
                  filter(data => data !== null && data.length > 0)
              )
              .subscribe(response => {
                console.log(response);

                if(response !== null && response !== undefined) {
                  this.addresseeTreeComponent.buildTree(addressType.code, [...response]);
                  this.addresseeGroupButtonStatus = false;
                  this.destroyOrganizationalUnits$.next();
                }

              });
        }

        if(addressType.code === 'user') {
          this.store$.select(NewSubjectSelector.getUsers)
              .pipe(
                  take(1),
                  filter(data => data !== null && data.length > 0)
              )
              .subscribe(response => {

                this.addresseeTreeComponent.buildTree(addressType.code, [...response]);

                this.addresseeGroupButtonStatus = false;
              });
        }

      }
    });


  }

  storeRecipients() {
    const recipients = this.addresseeTreeComponent.getAddresseeSelected();
    this.store$.dispatch(new NewSubjectActions.StoreRecipients(recipients.nodes, recipients.tasks, recipients.addressee));
  }

  ngOnDestroy(): void {
    this.destroyOrganizationalUnits$.next();
    this.destroy.next();
  }

}
