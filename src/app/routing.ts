import {RouterModule, Routes} from '@angular/router';
import {UserEditComponent} from './components/user/user-edit.component';
import {ModuleWithProviders} from '@angular/core';
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

const  appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'artists/:page', component: ArtistListComponent},
    {path: 'artist-new', component: ArtistAddComponent},
    {path: 'artist-edit/:id', component: ArtistEditComponent},
    {path: 'artist/:id', component: ArtistDetailComponent},
    {path: 'album-new/:artist', component: AlbumAddComponent},
    {path: 'album-edit/:id', component: AlbumEditComponent},
    {path: 'album/:id', component: AlbumDetailComponent},
    {path: 'song-new/:album', component: SongAddComponent},
    {path: 'song-edit/:id', component: SongEditComponent},
    {path: 'mis-datos', component: UserEditComponent},
    {path: '**', component: HomeComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
