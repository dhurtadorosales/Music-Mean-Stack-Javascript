import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user';
import {GLOBAL} from '../../services/global';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Album} from '../../models/album';
import {AlbumService} from '../../services/album.service';
import {UploadService} from '../../services/upload.service';

@Component({
    selector: 'app-album-edit',
    templateUrl: 'views/album-add.component.html',
    providers: [UserService, AlbumService, UploadService]
})

export class AlbumEditComponent implements OnInit {
    public title: string;
    public user: User;
    public album: Album;
    public identity;
    public token;
    public url: string;
    public errorMessage;
    public alertMessage;
    public isEdit;
    public filesToUpload: Array<File>;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private albumService: AlbumService,
        private uploadService: UploadService
    ) {
        this.title = 'Editar album';
        this.identity = this.userService.getIdentity();
        this.token = this.userService.getToken();
        this.url = GLOBAL.url;
        this.album = new Album('', '', 2018, '', '');
        this.isEdit = true;
    }

    ngOnInit() {
        // Get the album
        this.getAlbum();
    }

    getAlbum() {
        this.route.params.forEach((params: Params) => {
            const id = params['id'];

            this.albumService.getAlbum(this.token, id).subscribe(
                response => {
                    if (!response['album']) {
                        this.router.navigate(['/']);
                    } else {
                        this.album = response['album'];
                    }
                },
                error => {
                    this.errorMessage = <any>error;

                    if (this.errorMessage != null) {
                        this.errorMessage = error.error.message;
                    }
                }
            );
        });
    }

    onSubmit() {
        this.route.params.forEach((params: Params) => {
            const id = params['id'];

            this.albumService.editAlbum(this.token, id, this.album).subscribe(
                response => {
                    if (!response['album']) {
                        this.alertMessage = 'Error to update album';
                    } else {
                        this.alertMessage = 'Exit, album updated';

                        if (!this.filesToUpload) {
                            // Redirection
                            this.router.navigate(['/artist', response['album'].artist]);
                        } else {
                            // Upload image
                            this.uploadService.makeFileRequest(
                                this.url + 'upload-image-album/' + id,
                                [],
                                this.filesToUpload,
                                this.token,
                                'image')
                                .then(
                                    (result) => {
                                        this.router.navigate(['/artist', response['album'].artist]);
                                    },
                                    (error) => {
                                        this.errorMessage = error;
                                    }
                                );
                        }
                    }
                },
                error => {
                    this.errorMessage = <any>error;

                    if (this.errorMessage != null) {
                        this.errorMessage = error.error.message;
                    }
                }
            );
        });
    }

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }
}
