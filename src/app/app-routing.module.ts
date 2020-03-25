import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanelComponent }       from './panel/panel.component';
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { NewUserComponent } from "./register/new-user.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./forgot-password/reset-password.component";
import { UserResetPasswordComponent } from "./user-profile/user-reset-password/user-reset-password.component";

const routes: Routes = [
        { path: '', redirectTo: 'panel', pathMatch: 'full' },
        {
            path: 'login',
            loadChildren: './login/login.module#LoginModule'
        },
        { path: 'register/newUser', component: NewUserComponent },
        { path: 'forgotpassword', component: ForgotPasswordComponent },
        { path: 'forgotPassword/reset/:token/:email', component: ResetPasswordComponent },
        {
            path: 'panel',
            component: PanelComponent,
            children: [
                { path: '', redirectTo: 'inbox', pathMatch: 'full' },
                {
                    path: 'systemSettings',
                    loadChildren: './system-settings/system-settings.module#SystemSettingsModule'
                },
                {
                    path: 'users',
                    loadChildren: './admin-users/admin-users.module#AdminUsersModule'
                },
                { path: 'userProfile', component: UserProfileComponent },
                {
                    path: 'companies',
                    loadChildren: './admin-companies/admin-companies.module#AdminCompaniesModule'
                },
                {
                    path: 'process',
                    loadChildren: './process-module/process.module#ProcessModule'
                },
                {
                    path: 'organizationalUnit',
                    loadChildren: './organizational-unit/organizational-unit.module#OrganizationalUnitModule',
                },
                {
                    path: 'newSubject/:process_id/:organizationalUnitId',
                    loadChildren: './new-subject/new-subject.module#NewSubjectModule',
                },
                {
                    path: 'mailbox',
                    pathMatch: 'prefix',
                    loadChildren: './mailboxes/mailboxes.module#MailboxesModule'
                },
                {
                    path: 'user/resetpassword',
                    component: UserResetPasswordComponent
                },
            ]
        },
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})

export class AppRoutingModule {

}
