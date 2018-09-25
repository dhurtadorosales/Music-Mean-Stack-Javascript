import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {UserEditComponent} from './components/user/user-edit.component';
import {appRoutingProviders, routing} from './routing';
import {ArtistListComponent} from './components/artist/artist-list.component';
import {HomeComponent} from './components/home/home.component';
import {ArtistAddComponent} from './components/artist/artist-add.component';
import {ArtistEditComponent} from './components/artist/artist-edit.component';
import {ArtistDetailComponent} from './components/artist/artist-detail.component';
import {AlbumAddComponent} from './components/album/album-add.component';
import {AlbumEditComponent} from './components/album/album-edit.component';
import {AlbumDetailComponent} from './components/album/album-detail.component';
import {SongAddComponent} from './components/song/song-add.component';
import {SongEditComponent} from './components/song/song-edit.component';
import {PlayerComponent} from './components/song/player.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        UserEditComponent,
        ArtistListComponent,
        ArtistAddComponent,
        ArtistEditComponent,
        ArtistDetailComponent,
        AlbumAddComponent,
        AlbumEditComponent,
        AlbumDetailComponent,
        SongAddComponent,
        SongEditComponent,
        PlayerComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        routing
    ],
    providers: [appRoutingProviders],
    bootstrap: [AppComponent]
})
export class AppModule { }
