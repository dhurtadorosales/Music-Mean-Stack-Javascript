import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {GLOBAL} from './global';
import 'rxjs/Observable';
import {Album} from '../models/album';

@Injectable()
export class AlbumService {
    public url: string;
    public identity;
    public token;

    constructor(
        private http: HttpClient
    ) {
        this.url = GLOBAL.url;
    }

    public getAlbums(token, artistId = null) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });


        if (artistId == null) {
            return this.http.get(
                this.url + 'albums',
                {headers: headers}
            );
        } else {
            return this.http.get(
                this.url + 'albums/' + artistId,
                {headers: headers}
            );
        }
    }

    public getAlbum(token, id: string) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this.http.get(
            this.url + 'album/' + id,
            {headers: headers}
        );
    }

    public addAlbum(token, album: Album) {
        const params = JSON.stringify(album);
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this.http.post(
            this.url + 'album',
            params, {
                headers: headers
            });
    }

    public editAlbum(token, id: string, album: Album) {
        const params = JSON.stringify(album);
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this.http.put(
            this.url + 'album/' + id,
            params, {
                headers: headers
            });
    }

    public deleteAlbum(token, id: string) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this.http.delete(
            this.url + 'album/' + id,
            {headers: headers}
        );
    }
}
