import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {GLOBAL} from './global';
import 'rxjs/Observable';
import {Song} from '../models/song';

@Injectable()
export class SongService {
    public url: string;
    public identity;
    public token;

    constructor(
        private http: HttpClient
    ) {
        this.url = GLOBAL.url;
    }

    public getSongs(token, albumId = null) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });


        if (albumId == null) {
            return this.http.get(
                this.url + 'songs',
                {headers: headers}
            );
        } else {
            return this.http.get(
                this.url + 'songs/' + albumId,
                {headers: headers}
            );
        }
    }

    public getSong(token, id: string) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this.http.get(
            this.url + 'song/' + id,
            {headers: headers}
        );
    }

    public addSong(token, song: Song) {
        const params = JSON.stringify(song);
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this.http.post(
            this.url + 'song',
            params, {
                headers: headers
            });
    }

    public editSong(token, id: string, song: Song) {
        const params = JSON.stringify(song);
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this.http.put(
            this.url + 'song/' + id,
            params, {
                headers: headers
            });
    }

    public deleteSong(token, id: string) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this.http.delete(
            this.url + 'song/' + id,
            {headers: headers}
        );
    }
}
