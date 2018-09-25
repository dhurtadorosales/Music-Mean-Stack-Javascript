import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user';
import {GLOBAL} from '../../services/global';
import {Artist} from '../../models/artist';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ArtistService} from '../../services/artist.service';

@Component({
    selector: 'app-artist-list',
    templateUrl: 'views/artist-list.component.html',
    providers: [UserService, ArtistService]
})

export class ArtistListComponent implements OnInit {
    public title: string;
    public user: User;
    public artists: Artist[];
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
        private artistService: ArtistService
    ) {
        this.title = 'Artistas';
        this.identity = this.userService.getIdentity();
        this.token = this.userService.getToken();
        this.user = this.identity;
        this.url = GLOBAL.url;
        this.nextPage = 1;
        this.prevPage = 1;
    }

    ngOnInit() {
        this.getArtists();
    }

    getArtists() {
        this.route.params.forEach((params: Params) => {
            let page = +params['page'];

            if (!page) {
                page = 1;
            } else {
                this.nextPage = page + 1;
                this.prevPage = page - 1;

                if (this.prevPage === 0) {
                    this.prevPage = 1;
                }
            }

            this.artistService.getArtists(this.token, page).subscribe(
                response => {
                    if (!response['artists']) {
                        this.router.navigate(['/']);
                    } else {
                        this.artists = response['artists'];
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

    onCancelArtist() {
        this.confirmed = null;
    }

    onDeleteArtist(id) {
        this.artistService.deleteArtist(this.token, id).subscribe(
            response => {
                if (!response['artist']) {
                    this.alertMessage = 'Error to delete';
                }

                this.getArtists();
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
