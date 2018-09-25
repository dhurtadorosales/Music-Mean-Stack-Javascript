import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {AlbumService} from '../../services/album.service';
import {User} from '../../models/user';
import {Album} from '../../models/album';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {GLOBAL} from '../../services/global';
import {Song} from '../../models/song';
import {SongService} from '../../services/song.service';

@Component({
    selector: 'app-album-detail',
    templateUrl: 'views/album-detail.component.html',
    providers: [UserService, AlbumService, SongService]
})

export class AlbumDetailComponent implements OnInit {
    public title: string;
    public user: User;
    public album: Album;
    public songs: Song[];
    public identity;
    public token;
    public url: string;
    public nextPage;
    public prevPage;
    public errorMessage;
    public alertMessage;
    public confirmed;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private albumService: AlbumService,
        private songService: SongService
    ) {
        this.title = 'Album';
        this.identity = this.userService.getIdentity();
        this.token = this.userService.getToken();
        this.user = this.identity;
        this.url = GLOBAL.url;
    }

    ngOnInit() {
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

                        // Songs of this album
                        this.songService.getSongs(this.token, id).subscribe(
                            res => {
                                if (!res['songs']) {
                                    this.alertMessage = 'This album doesn\'t have any songs';
                                } else {
                                    this.songs = res['songs'];
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
        });
    }

    onDeleteConfirm(id) {
        this.confirmed = id;
    }

    onCancelSong() {
        this.confirmed = null;
    }

    onDeleteSong(id) {
        this.songService.deleteSong(this.token, id).subscribe(
            response => {
                if (!response['song']) {
                    this.alertMessage = 'Error to delete';
                }

                this.getAlbum();
            },
            error => {
                this.errorMessage = <any>error;

                if (this.errorMessage != null) {
                    this.errorMessage = error.error.message;
                }
            }
        );
    }

    startPlayer(song) {
        const songPlayer = JSON.stringify(song);
        const filePath = this.url + 'get-song-file/' + song.file;
        const imagePath = this.url + 'get-image-album/' + song.album.image;

        localStorage.setItem('sound_song', songPlayer);

        document.getElementById('mp3-source').setAttribute('src', filePath);

        (document.getElementById('player') as any).load();
        (document.getElementById('player') as any).play();

        document.getElementById('play-song-title').innerHTML = song.name;
        document.getElementById('play-song-artist').innerHTML = song.album.artist.name;
        document.getElementById('play-image-album').setAttribute('src', imagePath);
    }
}
