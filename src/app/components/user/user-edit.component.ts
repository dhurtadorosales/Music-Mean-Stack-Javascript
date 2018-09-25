import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user';
import {GLOBAL} from '../../services/global';

@Component({
    selector: 'app-user-edit',
    templateUrl: 'user-edit.component.html',
    providers: [UserService]
})

export class UserEditComponent implements OnInit {
    public title: string;
    public user: User;
    public identity;
    public token;
    public alertMessage;
    public filesToUpload: Array<File>;
    public url: string;

    constructor(
        private userService: UserService
    ) {
        this.title = 'Actualizar mis datos';
        this.identity = this.userService.getIdentity();
        this.token = this.userService.getToken();
        this.user = this.identity;
        this.url = GLOBAL.url;
    }

    ngOnInit() {
    }

    public onSubmit() {
        this.userService.updateUser(this.user).subscribe(
            response => {
                this.user = response['user'];

                if (!response['user']) {
                    this.alertMessage = 'Error to update user';
                } else {
                    // this.user = response.user;

                    // Save object in localstorage
                    localStorage.setItem('identity', JSON.stringify(this.identity));

                    // Change subtitle (firstname)
                    document.getElementById('identity-name').innerHTML = this.user.firstname;

                    if (!this.filesToUpload) {
                        // Redirección
                    } else {
                        this.makeFileRequest(
                            this.url + 'upload-image-user/' + this.user._id,
                            [],
                            this.filesToUpload
                        ).then(
                            (result: any) => {
                                this.user.image = result.image;

                                // Save object in localstorage
                                localStorage.setItem('identity', JSON.stringify(this.identity));

                                // Change image nav
                                const imagePath = this.url + 'get-image/user' + this.user.image;
                                document.getElementById('image-logged').setAttribute('src', imagePath);

                            }
                        );
                    }

                    // Message
                    this.alertMessage = 'Congratulations, user updated!';
                }
            },
            error => {
                this.alertMessage = <any>error;

                if (this.alertMessage != null) {
                    this.alertMessage = error.error.message;
                }
            }
        );
    }

    public fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

    public makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
        const token = this.token;

        return new Promise(function (resolve, reject) {
            const formData: any = new FormData();
            const xhr = new XMLHttpRequest();

            for (let i = 0; i < files.length; i++) {
                formData.append('image', files[i], files[i].name);
            }

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            };

            xhr.open('POST', url, true);
            xhr.setRequestHeader('Authorization', token);
            xhr.send(formData);
        });
    }
}
