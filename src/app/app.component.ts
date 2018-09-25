import {Component, OnInit} from '@angular/core';
import { User } from './models/user';
import { UserService } from './services/user.service';
import {GLOBAL} from './services/global';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    providers: [UserService]
})
export class AppComponent implements OnInit {
    public title = 'MUSICFY';
    public user: User;
    public userRegister: User;
    public identity;
    public token;
    public errorMessage;
    public alertRegister;
    public url;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService
    ) {
        this.user = new User('', '', '', '', '', 'ROLE_USER', '');
        this.userRegister = new User('', '', '', '', '', 'ROLE_USER', '');
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        this.identity = this.userService.getIdentity();
        this.token = this.userService.getToken();
    }

    public onSubmit() {
        // Get user data
        this.userService.signup(this.user).subscribe(
            response => {
                this.identity = response.user;

                if (!this.identity._id) {
                    alert('El usuario no está correctamente identificado');
                } else {
                    // Save object in localstorage
                    localStorage.setItem('identity', JSON.stringify(this.identity));

                    // Get token for every http request
                    this.userService.signup(this.user, 'true').subscribe(
                        res => {
                            this.token = res.token;

                            if (this.token.length <= 0) {
                                alert('Token no generado');
                            } else {
                                // Save in localstorage
                                localStorage.setItem('token', this.token);

                                this.user = new User('', '', '', '', '', 'ROLE_USER', '');
                            }
                        },
                        error => {
                            this.errorMessage = <any>error;

                            if (this.errorMessage != null) {
                                this.errorMessage = error.error.message;
                            }
                        }
                    );
                }
            },
            error => {
                this.errorMessage = <any>error;

                if (this.errorMessage != null) {
                    this.errorMessage = error.error.message;
                }
            }
        );
    }

    public logout() {
        localStorage.removeItem('identity');
        localStorage.removeItem('token');

        this.identity = null;
        this.token = null;
        this.router.navigate(['/']);
    }

    public onSubmitRegister() {
        this.userService.register(this.userRegister).subscribe(
            response => {
                this.userRegister = response['user'];

                if (!this.userRegister._id)  {
                    this.alertRegister = 'Error al registrarse';
                } else {
                    this.alertRegister = 'El registro se ha realizado correctamente, identíficate con ' + this.userRegister.email;
                    this.userRegister = new User('', '', '', '', '', 'ROLE_USER', '');
                }
            },
            error => {
                this.errorMessage = <any>error;

                if (this.errorMessage != null) {
                    this.errorMessage = error.error.message;
                }
            }
        );
    }
}
