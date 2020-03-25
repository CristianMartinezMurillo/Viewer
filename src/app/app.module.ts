import { NgModule                   } from '@angular/core';
import { AppComponent               } from './app.component';
import { AppRoutingModule           } from './app-routing.module';
import { HttpClientModule           } from '@angular/common/http';
import { FormsModule                } from '@angular/forms';
import { ReactiveFormsModule        } from '@angular/forms';
import { HTTP_INTERCEPTORS          } from '@angular/common/http';
import { AuthInterceptor            } from "./_interceptor/Auth.interceptor";
import { NgbModule                  } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule    } from '@angular/platform-browser/animations';
import { PanelComponent             } from './panel/panel.component';
import { PanelNavbarComponent       } from './panel/panel-navbar/panel-navbar.component';
import { MaterialModule             } from './material.module';
import { FontAwesomeModule          } from '@fortawesome/angular-fontawesome';
import { DangerConfirmationDialogComponent } from './dialog/danger-confirmation-dialog/danger-confirmation-dialog.component';
import { SharedModule               } from "./shared.module";
import { ProcessTreePanelModule } from "./process-tree-panel/process-tree-panel.module";
import { WarningConfirmationDialogComponent } from './dialog/warning-confirmation-dialog/warning-confirmation-dialog.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ViewerPdfDialogComponent } from './document-viewer/viewer-pdf-dialog.component';
import { NewUserComponent } from './register/new-user.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './forgot-password/reset-password.component';
import { DefaultNavbarComponent } from './default-navbar/default-navbar.component';
import { UserResetPasswordComponent } from './user-profile/user-reset-password/user-reset-password.component';
import { reducers } from "./_store/reducers";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { StoreModule } from '@ngrx/store';
import { metaReducers } from './_store/reducers/index';
import { environment } from 'src/app/environments/environment';

@NgModule({
  declarations: [
    AppComponent,
      PanelComponent,
      PanelNavbarComponent,
      DangerConfirmationDialogComponent,
      WarningConfirmationDialogComponent,
      UserProfileComponent,
      ViewerPdfDialogComponent,
      NewUserComponent,
      ForgotPasswordComponent,
      ResetPasswordComponent,
      DefaultNavbarComponent,
      UserResetPasswordComponent,
  ],
  imports: [
      AppRoutingModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      BrowserAnimationsModule,
      NgbModule,
      MaterialModule,
      FontAwesomeModule,
      SharedModule,
      ProcessTreePanelModule,
      StoreModule.forFeature('newSubject', reducers, { metaReducers }),
      StoreModule.forRoot({}),
      // Instrumentation must be imported after importing StoreModule (config is optional)
      StoreDevtoolsModule.instrument({
          maxAge: 25, // Retains last 25 states
          logOnly: environment.production, // Restrict extension to log-only mode
      }),
  ],
    exports: [
    ],
  providers: [
      {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true
      }
  ],
  bootstrap: [AppComponent],
    entryComponents: [
        DangerConfirmationDialogComponent,
        WarningConfirmationDialogComponent,
        ViewerPdfDialogComponent,
    ]
})
export class AppModule {
  src = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
}
