import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from "src/app/environments/environment";
import { LocalstorageService } from "./Localstorage.service";
import { isNullOrUndefined, isObject } from "util";
import { CAT_SYSTEM_USER_ROLE } from "../_constants/CatSystemUserRoleConstants";

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
};

@Injectable({
  providedIn: 'root'
})
export class UsersService {

    constructor(
        private http: HttpClient,
        private LocalStorage: LocalstorageService
        ) { }

    url = environment.apiUrl + '/api/user';

    /**
     *
     * @param {any} idUser
     * @returns {Observable<any>}
     */
    getUsers(idUser = null): Observable<any> {
        const url = (idUser === null) ? this.url :  this.url + '/' + idUser;
        return this.http.get(url, httpOptions);
    }

    getUsersByOrganizationalUnit(params) : Observable<any> {
        httpOptions['params'] = params;
        return this.http.get(this.url + '/getUsersByOrganizationalUnit', httpOptions);
    }

    /**
     * add a new user from admin console
     * @returns {Observable<any>}
     */
    public newUser(userData): Observable<any> {
        return this.http.post(this.url + '/register', userData );
    }

    /**
     * signup from login interface
     * @param userData
     */
    public signUp(userData): Observable<any> {
        return this.http.post(this.url + '/signup', userData );
    }

    /**
     *
     * @param {number} idUser
     * @returns {Observable<any>}
     */
    public updateUser(idUser: number, userData): Observable<any> {
        return this.http.put(this.url + '/' + idUser, userData);
    }

    /**
     *
     * @param {number} idUser
     * @returns {Observable<any>}
     */
    public deleteUser(idUser: number): Observable<any> {
        return this.http.delete(this.url + '/' + idUser, httpOptions);
    }

    /**
     *
     * @param params
     */
    public checkPassword(params): Observable<any> {
        return this.http.post(this.url + '/checkpassword', params);
    }

    /**
     *
     * @param params
     */
    public changePassword(params): Observable<any> {
        return this.http.post(this.url + '/changepassword', params);
    }

    /**
     *
     */
    public getOperadoresByUnidadOrganizacional(organizationalUnitId) {
        return this.http.get(this.url + '/operadores/ByUnidadOrganizacional/' + organizationalUnitId, httpOptions);
    }

    /**
     *
     */
    public getUserProfile() {
        return this.http.get(this.url + '/signed/profile', httpOptions);
    }

    /**
     *
     * @param data
     */
    public uploadFirel(data){
        return this.http.post(this.url + '/upload/firel', data);
    }

    /**
     *
     * @param data
     */
    public updateProfile(data){
        return this.http.post(this.url + '/update/profile', data);
    }

    /**
     *
     */
    get userData(): any{
        return this.LocalStorage.getUserData();
    }

    /**
     *
     */
    public isTitular(organizationalUnitId): boolean {
        if(isNullOrUndefined(this.userData.roles) || isNullOrUndefined(organizationalUnitId))
            return false;
        const isTitular = this.userData.roles.find(role => role.pivot.organizationalUnit_id === organizationalUnitId);

        return !isNullOrUndefined(isTitular) && isTitular.code === 'titular';
    }

    /**
     * returns the asistente status flag of user
     */
    public isAsistente(organizationalUnitId): boolean {
        if(isNullOrUndefined(this.userData.roles) || isNullOrUndefined(organizationalUnitId))
            return false;

        const isAsistente = this.userData.roles.find(role => role.pivot.organizationalUnit_id === organizationalUnitId);

        return !isNullOrUndefined(isAsistente) && isAsistente.code === 'asistente';
    }

    /**
     * returns the operador status flag of user
     */
    public isOperador(organizationalUnitId): boolean {
        if(isNullOrUndefined(this.userData.roles) || isNullOrUndefined(organizationalUnitId))
            return false;

        const isOperador = this.userData.roles.find(role => role.pivot.organizationalUnit_id === organizationalUnitId);

        return  !isNullOrUndefined(isOperador) && isOperador.code === 'operador';
    }

    public isRoot(): boolean {
        let userData = this.userData;
        return isObject(userData) && userData.id === 1;
    }

    /**
     * returns the operador status flag of user
     */
    public isAdmin(): boolean {
        let userData = this.userData;

        if (isNullOrUndefined(userData) || !userData.hasOwnProperty('systemRole'))
            return false;

        return userData.systemRole.code === CAT_SYSTEM_USER_ROLE.ADMIN;
    }
}
