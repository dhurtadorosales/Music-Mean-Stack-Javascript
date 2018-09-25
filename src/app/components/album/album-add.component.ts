import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user';
import {GLOBAL} from '../../services/global';
import {Artist} from '../../models/artist';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Album} from '../../models/album';
import {AlbumService} from '../../services/album.service';

@Component({
    selector: 'app-album-add',
    templateUrl: 'views/album-add.component.html',
    providers: [UserService, AlbumService]
})

export class AlbumAddComponent implements OnInit {
    public title: string;
    public user: User;
    public artist: Artist;
    public album: Album;
    public identity;
    public token;
    public url: string;
    public errorMessage;
    public alertMessage;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private albumService: AlbumService
    ) {
        this.title = 'Nuevo album';
        this.identity = this.userService.getIdentity();
        this.token = this.userService.getToken();
        this.url = GLOBAL.url;
        this.album = new Album('', '', 2018, '', '');
    }

    ngOnInit() {
    }

    onSubmit() {
        this.route.params.forEach((params: Params) => {
           const artistId = params['artist'];
           this.album.artist = artistId;
        });

        this.albumService.addAlbum(this.token, this.album).subscribe(
            response => {
                 if (!response['album']) {
                    this.alertMessage = 'Error to add album';
                } else {
                    this.alertMessage = 'Exit, album created';
                    this.album = response['album'];
                    this.router.navigate(['/album-edit'], response['album']._id);
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
