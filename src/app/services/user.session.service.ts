import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable()
export class SessionService {

    _userSessionObj: Object = null;
    _userSessionObjKey: string = "sessionUser";
    _userObject: User = null;
    _isUserLoggedInKey: string = "isUserLoggedInKey";
    _isUserLoggedIn: boolean = false;

    constructor(private routerObj: Router) {
    }

    setUserSessionObj(val: Object): void {
        this._userSessionObj = val;
        sessionStorage.setItem(this._userSessionObjKey, JSON.stringify(this._userSessionObj));
    }

    getUserObjectFromSession(): User {
        this._userObject = JSON.parse(sessionStorage.getItem(this._userSessionObjKey));
        return this._userObject;
    }

    logoutUser(): void {
        sessionStorage.setItem(this._userSessionObjKey, null);
        sessionStorage.setItem(this._isUserLoggedInKey, "false");
        this.routerObj.navigateByUrl("/home");
    }

    setIsUserLoggedIn(val: string) {
        sessionStorage.setItem(this._isUserLoggedInKey, val);
    }

    isUserSessionAlive(): boolean {
        if (typeof sessionStorage.getItem(this._isUserLoggedInKey) === "string" && sessionStorage.getItem(this._isUserLoggedInKey) === "true") {
            return true;
        }
        return false;
    }

    isUserAdmin(): boolean {
        if(this.isUserSessionAlive()){
            if (this.getUserObjectFromSession()["userRole"] === "appAdmin") {
                return true;
            }
        }       
        return false;
    }
}