import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user';
import {GLOBAL} from '../../services/global';
import {Artist} from '../../models/artist';
import {ActivatedRoute, Router} from '@angular/router';
import {ArtistService} from '../../services/artist.service';

@Component({
    selector: 'app-artist-add',
    templateUrl: 'views/artist-add.component.html',
    providers: [UserService, ArtistService]
})

export class ArtistAddComponent implements OnInit {
    public title: string;
    public user: User;
    public artist: Artist;
    public identity;
    public token;
    public url: string;
    public errorMessage;
    public alertMessage;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private artistService: ArtistService
    ) {
        this.title = 'Nuevo artista';
        this.identity = this.userService.getIdentity();
        this.token = this.userService.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('', '', '');
    }

    ngOnInit() {
    }

    onSubmit() {
        this.artistService.addArtist(this.token, this.artist).subscribe(
            response => {
                 if (!response['artist']) {
                    this.alertMessage = 'Error to add artist';
                } else {
                    this.alertMessage = 'Exit, artist created';
                    this.artist = response['artist'];
                    this.router.navigate(['/artist-edit'], response['artist']._id);
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
