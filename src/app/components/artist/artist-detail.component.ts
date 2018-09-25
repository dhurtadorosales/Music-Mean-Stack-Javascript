import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user';
import {GLOBAL} from '../../services/global';
import {Artist} from '../../models/artist';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ArtistService} from '../../services/artist.service';
import {AlbumService} from '../../services/album.service';
import {Album} from '../../models/album';

@Component({
    selector: 'app-artist-detail',
    templateUrl: 'views/artist-detail.component.html',
    providers: [UserService, ArtistService, AlbumService]
})

export class ArtistDetailComponent implements OnInit {
    public title: string;
    public user: User;
    public artist: Artist;
    public albums: Album[];
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
        private artistService: ArtistService,
        private albumService: AlbumService
    ) {
        this.title = 'Artistas';
        this.identity = this.userService.getIdentity();
        this.token = this.userService.getToken();
        this.user = this.identity;
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        this.getArtist();
    }

    getArtist() {
        this.route.params.forEach((params: Params) => {
            const id = params['id'];

            this.artistService.getArtist(this.token, id).subscribe(
                response => {
                    if (!response['artist']) {
                        this.router.navigate(['/']);
                    } else {
                        this.artist = response['artist'];

                        // Albums of this artist
                        this.albumService.getAlbums(this.token, id).subscribe(
                            res => {
                                if (!res['albums']) {
                                    this.alertMessage = 'This artist doesn\'t have any albums';
                                } else {
                                    this.albums = res['albums'];
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

    onCancelAlbum() {
        this.confirmed = null;
    }

    onDeleteAlbum(id) {
        this.albumService.deleteAlbum(this.token, id).subscribe(
            response => {
                if (!response['album']) {
                    this.alertMessage = 'Error to delete';
                }

                this.getArtist();
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
