import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user';
import {GLOBAL} from '../../services/global';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Song} from '../../models/song';
import {SongService} from '../../services/song.service';
import {UploadService} from '../../services/upload.service';

@Component({
    selector: 'app-song-edit',
    templateUrl: 'views/song-add.component.html',
    providers: [UserService, SongService, UploadService]
})

export class SongEditComponent implements OnInit {
    public title: string;
    public user: User;
    public song: Song;
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
        private songService: SongService,
        private uploadService: UploadService
    ) {
        this.title = 'Editar canción';
        this.identity = this.userService.getIdentity();
        this.token = this.userService.getToken();
        this.url = GLOBAL.url;
        this.song = new Song('', '', 0, '', '');
        this.isEdit = true;
    }

    ngOnInit() {
        this.getSong();
    }

    getSong() {
        this.route.params.forEach((params: Params) => {
            const id = params['id'];

            this.songService.getSong(this.token, id).subscribe(
                response => {
                    if (!response['song']) {
                        this.router.navigate(['/']);
                    } else {
                        this.song = response['song'];
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

            this.songService.editSong(this.token, id, this.song).subscribe(
                response => {
                     if (!response['song']) {
                        this.alertMessage = 'Error to update song';
                    } else {
                         this.alertMessage = 'Exit, song updated';

                        if (!this.filesToUpload) {
                            this.router.navigate(['/album', response['song'].album]);
                        } else {
                            // Upload audio file
                            this.uploadService.makeFileRequest(
                                this.url + 'upload-file-song/' + id,
                                [],
                                this.filesToUpload,
                                this.token,
                                'file')
                                .then(
                                    (result) => {
                                        this.router.navigate(['/album', response['song'].album]);
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
