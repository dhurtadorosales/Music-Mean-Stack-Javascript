import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {GLOBAL} from './global';
import 'rxjs/Observable';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';

@Injectable()
export class UserService {
    public url: string;
    public identity;
    public token;

    constructor(
        private http: HttpClient
    ) {
        this.url = GLOBAL.url;
    }

    public signup(userToLogin, getHash = null): Observable<any> {
        if (getHash != null) {
            userToLogin.gethash = getHash;
        }

        const params = JSON.stringify(userToLogin);
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        return this.http.post(
            this.url + 'login',
            params, {
                headers: headers
            });
    }

    public register(userToRegister) {
        const params = JSON.stringify(userToRegister);
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        return this.http.post(
            this.url + 'register',
            params, {
                headers: headers
            });
    }

    public updateUser(user) {
        const params = JSON.stringify(user);
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': this.getToken()
        });

        return this.http.put(
            this.url + 'update-user/' + user._id,
            params, {
                headers: headers
            });
    }

    public getIdentity() {
        const identity = JSON.parse(localStorage.getItem('identity'));

        this.identity = null;
        if (identity !== 'undefined') {
            this.identity = identity;
        }

        return this.identity;
    }

    public getToken() {
        const token = localStorage.getItem('token');

        this.token = null;
        if (token !== 'undefined') {
            this.token = token;
        }

        return this.token;
    }
}
