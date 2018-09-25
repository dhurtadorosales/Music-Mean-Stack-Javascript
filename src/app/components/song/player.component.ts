import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {GLOBAL} from '../../services/global';
import {Song} from '../../models/song';
import {SongService} from '../../services/song.service';
import {UploadService} from '../../services/upload.service';

@Component({
    selector: 'app-player',
    templateUrl: 'views/player.component.html',
    providers: [UserService, SongService, UploadService]
})

export class PlayerComponent implements OnInit {
    public song: Song;
    public url: string;

    constructor() {
        this.url = GLOBAL.url;
        this.song = new Song('', '', 0, '', '');
    }

    ngOnInit() {
        const song = JSON.parse(localStorage.getItem('sound_song'));

        if (song) {
            this.song = song;
        } else {
            this.song = new Song('', '', 0, '', '');
        }
    }
}
