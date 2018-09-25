import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user';
import {GLOBAL} from '../../services/global';
import {Artist} from '../../models/artist';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ArtistService} from '../../services/artist.service';
import {UploadService} from '../../services/upload.service';

@Component({
    selector: 'app-artist-edit',
    templateUrl: 'views/artist-add.component.html',
    providers: [UserService, ArtistService, UploadService]
})

export class ArtistEditComponent implements OnInit {
    public title: string;
    public user: User;
    public artist: Artist;
    public identity;
    public token;
    public url: string;
    public errorMessage;
    public alertMessage;
    public isEdit = true;
    public filesToUpload: Array<File>;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private artistService: ArtistService,
        private uploadService: UploadService
    ) {
        this.title = 'Editar artista';
        this.identity = this.userService.getIdentity();
        this.token = this.userService.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('', '', '');
    }

    ngOnInit() {
        this.getArtists();
    }

    getArtists() {
        this.route.params.forEach((params: Params) => {
            const id = params['id'];

            this.artistService.getArtist(this.token, id).subscribe(
                response => {

                    if (!response['artist']) {
                        this.router.navigate(['/']);
                    } else {
                        this.artist = response['artist'];
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

            this.artistService.editArtist(this.token, id, this.artist).subscribe(
                response => {
                    if (!response['artist']) {
                        this.alertMessage = 'Error to update artist';
                    } else {
                        this.alertMessage = 'Exit, artist updated';

                        if (!this.filesToUpload) {
                            this.router.navigate(['/artist', response['artist']._id]);
                        } else {
                            // Upload image
                            this.uploadService.makeFileRequest(
                                this.url + 'upload-image-artist/' + id,
                                [],
                                this.filesToUpload,
                                this.token,
                                'image'
                            )
                                .then(
                                    (result) => {
                                        this.router.navigate(['/artists', 1]);
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
