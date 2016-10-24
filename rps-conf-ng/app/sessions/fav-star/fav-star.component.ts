// angular
import { Component, ViewChild, ChangeDetectorRef, Inject, Input, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Rx';


// nativescript
import { RadSideDrawerComponent, SideDrawerType } from 'nativescript-telerik-ui/sidedrawer/angular';
import { DrawerTransitionBase, SlideInOnTopTransition } from 'nativescript-telerik-ui/sidedrawer';
import { NativeScriptRouterModule, RouterExtensions } from 'nativescript-angular/router';
import { GestureEventData, SwipeGestureEventData, SwipeDirection } from 'ui/gestures';
import { Page } from "ui/page";
import { Button } from 'ui/button';
import { Label } from 'ui/label';

//app
import { SessionsService } from '../../services/sessions.service';
import { SessionModel } from '../shared/session.model';


@Component({
    moduleId: module.id,
    selector: 'fav-star',
    templateUrl: 'fav-star.component.html',
    styleUrls: ['fav-star.component.css']
})
export class FavStarComponent implements OnInit {

    @Input() public item: SessionModel;

    public isToggling = false;

    constructor(private _page: Page, private _sessionsService: SessionsService) {

    }

    public ngOnInit() {

    }

    public toggleFavorite(session: SessionModel, lbl: Label) {
        if (this.isToggling) {
            return;
        }
        this.isToggling = true;

        this._sessionsService.toggleFavorite(session)
            .then(() => {
                console.log('done toggling favorite: ' + session.title);
                this.toggleFavVisual(session, lbl)
                    .then(() => {
                        this.isToggling = false;
                    });
            });
    }

    private toggleFavVisual(session: SessionModel, lbl: Label) {
        return new Promise((resolve, reject) => {
            if (!session.favorite) {
                this.animateUnfavorite(lbl)
                    .then(() => {
                        resolve();
                    });
            } else {
                this.animateFavorite(lbl)
                    .then(() => {
                        resolve();
                    });
            }
        });
    }

    private animateFavorite(lbl: Label) {
        return new Promise((resolve, reject) => {
            var x = 0;
            var y = 0;
            var index = 1;

            var cancel = setInterval(() => {
                this.setBackgroundPosition(lbl, x + ' ' + y);
                x = x - 50;
                index++;
                if (index == 30) {
                    clearInterval(cancel);
                    resolve();
                }
            }, 20);
        });
    }

    private animateUnfavorite(lbl: Label) {
        return new Promise((resolve, reject) => {
            this.setBackgroundPosition(lbl, '0 0');
            resolve();
        });

    }

    private setBackgroundPosition(lbl: Label, posish: string) {
        lbl.style.backgroundPosition = posish;
    }



}
