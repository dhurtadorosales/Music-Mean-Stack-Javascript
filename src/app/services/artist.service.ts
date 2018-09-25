import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {GLOBAL} from './global';
import 'rxjs/Observable';
import {Artist} from '../models/artist';

@Injectable()
export class ArtistService {
    public url: string;
    public identity;
    public token;

    constructor(
        private http: HttpClient
    ) {
        this.url = GLOBAL.url;
    }

    public getArtists(token, page) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this.http.get(
            this.url + 'artists/' + page,
            {headers: headers}
            );
    }

    public getArtist(token, id: string) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this.http.get(
            this.url + 'artist/' + id,
            {headers: headers}
        );
    }

    public addArtist(token, artist: Artist) {
        const params = JSON.stringify(artist);
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this.http.post(
            this.url + 'artist',
            params, {
                headers: headers
            });
    }

    public editArtist(token, id: string, artist: Artist) {
        const params = JSON.stringify(artist);
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this.http.put(
            this.url + 'artist/' + id,
            params, {
                headers: headers
            });
    }

    public deleteArtist(token, id: string) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this.http.delete(
            this.url + 'artist/' + id,
            {headers: headers}
        );
    }
}
