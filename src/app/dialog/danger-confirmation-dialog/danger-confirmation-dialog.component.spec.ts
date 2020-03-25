import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DangerConfirmationDialogComponent } from './danger-confirmation-dialog.component';

describe('DangerConfirmationDialogComponent', () => {
  let component: DangerConfirmationDialogComponent;
  let fixture: ComponentFixture<DangerConfirmationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DangerConfirmationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DangerConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
