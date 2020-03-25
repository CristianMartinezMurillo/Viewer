import {Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { InstanceService } from '../_services/instance.service';
import { AuthClass } from "../auth/Auth.class"
import { Router} from "@angular/router";
import { Title} from "@angular/platform-browser";
import { LocalstorageService } from "../_services/Localstorage.service";
import { SystemSettingsService } from "../_services/system-settings.service";
import { ErrorMessageComponent } from "../messages/error-message/error-message.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
    @ViewChild( ErrorMessageComponent ) errorMessage;
    loginForm: FormGroup;
    submitted = false;
    instanceTransformable = [];
    errorResponseLogin: Boolean;
    disableButtonLogin = false;
    textButton: String;
    errorTextResponseLogin: String;
    settings: any;

    constructor(
        private formBuilder: FormBuilder,
        private instanceService: InstanceService,
        private authClass: AuthClass,
        private router: Router,
        private title: Title,
        private localStorage: LocalstorageService,
        private systemSettingsService :  SystemSettingsService
    ) { }

    ngOnInit() {
        this.title.setTitle('Login - Control de Gestión');

        this.textButton = 'Iniciar Sesión';

        this.errorResponseLogin = false;

        this.loginForm = this.formBuilder.group({
            usernameInput: new FormControl('', [Validators.required, Validators.email]),
            passwordInput: new FormControl('', [Validators.required, Validators.minLength(4)]),
        });

        this.setLoginSettings();
    }

    // convenience getter for easy access to form fields
    get form() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;
        this.errorResponseLogin = false;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.buttonLoginOnLogin();
        this.disableButtonLogin = true;

        this.authClass.login(
            this.form.usernameInput.value,
            this.form.passwordInput.value
            // this.form.instanceSelect.value
        ).subscribe(loginResponse => {

            this.buttonLoginBeforeLogin();
            this.disableButtonLogin = false;

            if ( loginResponse.status === true && loginResponse.token !== null && loginResponse !== ''){
                this.localStorage.storeToken(loginResponse.token);
                this.localStorage.storeUserData(loginResponse.userData);
                this.redirectUserToPanel();
            }

        }, error => {

            this.errorResponseLogin = true;
            this.disableButtonLogin = false;

            this.buttonLoginBeforeLogin();

            if(error.hasOwnProperty('status') && error.status === 401){
                this.errorTextResponseLogin = "Usuario o contraseña incorrectos";
            }
            else if(error.error.hasOwnProperty('message'))
                this.errorTextResponseLogin = error.error.message;
            else
                this.errorTextResponseLogin = error.message;
        });


        // let response = this.authClass.loginPromise(
        //     this.form.passwordInput.value,
        //     this.form.usernameInput.value,
        //     this.form.instanceSelect.value
        // );

    }

    private redirectUserToPanel(){
        this.router.navigate(['/panel/mailbox/inbox/nuevo']);
    }

    private buttonLoginBeforeLogin() {
        this.textButton = 'Iniciar Sesión';
    }

    private buttonLoginOnLogin(){
        this.textButton = 'Iniciando Sesión...';
    }

    transformInstancesData(instances) {
        for (const entry of instances.data) {
            this.instanceTransformable.push({'id': entry.idInstance, 'name': entry.instanceName});
        }
        return this.instanceTransformable;
    }

    setLoginSettings() {
        this.systemSettingsService.global().subscribe(
            response => {
                if(response['status']) {
                    this.systemSettingsService.setLoginSettings(response["settings"]);
                    this.settings = this.systemSettingsService.getLoginSettings();
                }
            },
            error => {
                console.error(error);
                this.errorMessage.setErrorMessage(error);
            }
        );
    }
}
