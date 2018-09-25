import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user';
import {GLOBAL} from '../../services/global';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Song} from '../../models/song';
import {SongService} from '../../services/song.service';

@Component({
    selector: 'app-song-add',
    templateUrl: 'views/song-add.component.html',
    providers: [UserService, SongService]
})

export class SongAddComponent implements OnInit {
    public title: string;
    public user: User;
    public song: Song;
    public identity;
    public token;
    public url: string;
    public errorMessage;
    public alertMessage;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private songService: SongService
    ) {
        this.title = 'Nueva canción';
        this.identity = this.userService.getIdentity();
        this.token = this.userService.getToken();
        this.url = GLOBAL.url;
        this.song = new Song('', '', 0, '', '');
    }

    ngOnInit() {
    }

    onSubmit() {
        this.route.params.forEach((params: Params) => {
           const albumId = params['album'];
           this.song.album = albumId;
        });
        this.songService.addSong(this.token, this.song).subscribe(
            response => {
                 if (!response['song']) {
                    this.alertMessage = 'Error to add song';
                } else {
                    this.alertMessage = 'Exit, song created';
                    this.song = response['song'];
                    this.router.navigate(['/song-edit'], response['song']._id);
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
