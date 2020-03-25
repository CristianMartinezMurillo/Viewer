import { Injectable } from '@angular/core';
import {isNullOrUndefined} from "util";

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

    public storeToken(token) : void{
        sessionStorage.setItem('token', token);
    }

    public storeUserData(userData){
        sessionStorage.setItem('userData', JSON.stringify(userData));
    }

    public getToken() : String | null{
        return sessionStorage.getItem('token');
    }

    public getUserData() : String {
        let userData = sessionStorage.getItem('userData');

        return (!isNullOrUndefined(userData)) ? JSON.parse(userData) : null;

    }

    public clearSessionStorage(): void{
        sessionStorage.clear();
    }

    public storeJsonItem(keyname, jsonString : string) {
        sessionStorage.setItem(keyname, JSON.stringify(jsonString));
    }

    public getJsonItem(keyname) {
        let settings = sessionStorage.getItem(keyname);

        return (isNullOrUndefined(settings)) ? null : JSON.parse(settings);
    }
}
