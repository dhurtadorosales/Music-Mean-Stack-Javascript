import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {
    public title: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
    ) {
        this.title = 'Home';
    }

    ngOnInit() {
    }
}
