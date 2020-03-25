import { Component, OnInit, ViewChild } from '@angular/core';
import { UsersService } from "../_services/users.service";
import { ErrorMessageComponent } from "../messages/error-message/error-message.component";
import { UploadFileComponent } from "../share-components/upload-file/upload-file.component";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { WarningConfirmationDialogComponent } from "../dialog/warning-confirmation-dialog/warning-confirmation-dialog.component";
import { isNullOrUndefined } from "util";
import { MatDialog, MatDialogConfig } from "@angular/material";
import {faUserEdit} from "@fortawesome/free-solid-svg-icons";
import {faIdCard} from "@fortawesome/free-solid-svg-icons/faIdCard";

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
    @ViewChild(ErrorMessageComponent) errorMessage;
    @ViewChild(UploadFileComponent) uploadFile;

    faUserEdit = faUserEdit;
    idCardIcon = faIdCard;

    user;
    formGroup: FormGroup;
    formGroupFirel: FormGroup;
    submitted: boolean = false;
    acceptString = '.pfx';

    constructor(
        private userService: UsersService,
        private fb: FormBuilder,
        private dialog: MatDialog,
    ) {
    }

    ngOnInit() {
        this.getUserProfile();
        this.formGroup = this.fb.group({
            name: ['', [Validators.required]],
            last_name: new FormControl('', [Validators.required]),
            mothers_last_name: new FormControl('', []),
        });

        this.formGroupFirel = this.fb.group({
            firelPassword: ['', [Validators.required, Validators.maxLength(30), Validators.minLength(3)]],
        });
    }

    getUserProfile() {
        this.userService.getUserProfile().subscribe(
            response => {
                if (response['status']) {
                    this.user = response['profile'];
                    this.setUserData();
                } else {
                    this.errorMessage.setErrorMessage(response);
                }
            },
            error => {
                this.errorMessage.setErrorMessage(error);
            }
        );
    }

    updateFirel() {
        if(!this.formGroupFirel.valid)
            return;

        let files = this.uploadFile.getFilesForm();

        files.append("data", JSON.stringify(this.formGroupFirel.value));

        this.userService.uploadFirel(files).subscribe(
            response => {

                this.uploadFile.reset();

                if (response["status"]) {
                    this.user.firelName = response['firel'].firelName;
                } else {
                    this.errorMessage.setErrorMessage(response);
                }
            },
            error => {
                console.error(error);

                this.uploadFile.reset();

                this.errorMessage.setErrorMessage(error);
            }
        );

    }

    get form() {
        return this.formGroup.controls;
    }

    updateProfile() {
        this.submitted = true;

        Object.keys(this.formGroup.controls).forEach(field => { // {1}
            const control = this.formGroup.get(field);            // {2}
            control.markAsTouched({onlySelf: true});       // {3}
        });

        // stop here if form is invalid
        if (!this.formGroup.valid) {
            return;
        }

        let profileParams = this.formGroup.value;

        let dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {title: 'Confirmación', textContent: '¿Desea actualizar la información de su perfil?'};
        dialogConfig.maxWidth = '300px';
        dialogConfig.panelClass = 'dialog-confirmation-class';

        const dialog = this.dialog.open(WarningConfirmationDialogComponent, dialogConfig);

        dialog.afterClosed().subscribe(userConfirmation => {
            if (!isNullOrUndefined(userConfirmation) && userConfirmation.confirmation) {
                this.userService.updateProfile(profileParams).subscribe(
                    response => {
                        if (response['status']) {
                            this.user = response['profile'];
                        } else {
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

    public setUserData() {
        for (const key of Object.keys(this.user)) {
            if (this.form.hasOwnProperty(key)) {
                this.formGroup.controls[key].setValue(this.user[key]);
            }
        }

        for (const key of Object.keys(this.user)) {
            if (this.formFirel.hasOwnProperty(key)) {
                this.formGroupFirel.controls[key].setValue(this.user[key]);
            }
        }
    }

    get formFirel() {
        return this.formGroupFirel.controls;
    }

}
