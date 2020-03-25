import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelNavbarComponent } from './panel-navbar.component';

describe('PanelNavbarComponent', () => {
  let component: PanelNavbarComponent;
  let fixture: ComponentFixture<PanelNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
