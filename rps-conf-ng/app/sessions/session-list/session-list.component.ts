//angular
import { Component, Input, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, NgZone, ElementRef } from "@angular/core";
import { Observable, BehaviorSubject } from 'rxjs/Rx';


//nativescript
import { RadSideDrawerComponent } from "nativescript-telerik-ui/sidedrawer/angular";
import { NativeScriptRouterModule, RouterExtensions } from 'nativescript-angular/router';
import { ItemEventData } from 'ui/list-view';
import { GestureEventData } from 'ui/gestures';
import { GridLayout } from 'ui/layouts/grid-layout';
import { AbsoluteLayout } from 'ui/layouts/absolute-layout';
import { StackLayout } from 'ui/layouts/stack-layout';
import { Label } from 'ui/label';
import { View } from 'ui/core/view';
import { Page } from 'ui/page';
import { ListView } from 'ui/list-view';


//app
import { SessionsService } from '../../services/sessions.service';
import { FavoritesService } from '../../services/favorites.service';
import { ISession, IConferenceDay } from '../../shared/interfaces';
import { SessionModel } from '../shared/session.model';
import { FilterState } from '../shared/filter-state.model';
import { conferenceDays, hideSearchKeyboard } from '../../shared';


@Component({
    moduleId: module.id,
    selector: "session-list",
    templateUrl: "session-list.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionListComponent implements OnInit {

    private _search = '';
    private _selectedIndex: number = 0;
    private _selectedViewIndex: number;

    public dayHeader: string = '';
    @ViewChild('searchBar') public searchBar: ElementRef;

    public get selectedViewIndex() {
        return this._selectedViewIndex;
    }
    @Input() public set selectedViewIndex(value: number) {
        this._selectedViewIndex = value;
        if (this._selectedViewIndex < 2) {
            this.refresh();
        }
        this.hideSearchKeyboard();
    }

    public get selectedIndex(): number {
        return this._selectedIndex;
    }
    @Input() public set selectedIndex(value: number) {
        if (this._selectedIndex !== value) {
            this._selectedIndex = value;
            this.dayHeader = conferenceDays[value].desc;

            if (this.search !== '') {
                this.search = '';
            } else {
                this.refresh();
            }
        }
    }

    public get search(): string {
        return this._search;
    }
    public set search(value: string) {
        if (this._search !== value) {
            this._search = value;
            this.refresh();
        }
    }

    constructor(private _page: Page,
        private _sessionsService: SessionsService,
        private _zone: NgZone,
        private _routerExtensions: RouterExtensions) {
        this._selectedIndex = 0;
        this._sessionsService.items.subscribe(() => {
            console.log('ITEMS CHANGED');
        });
    }

    public ngOnInit() {

    }

    public load() {
        var p = this._sessionsService.loadSessions<Array<ISession>>()
            .then((newSessions: Array<ISession>) => {
                this.refresh();
            });
    }

    private refresh() {
        let filterState: FilterState = new FilterState(
            conferenceDays[this.selectedIndex].date.getDate(),
            this.search,
            this.selectedViewIndex);
        this._sessionsService.update(filterState);
    }

    public selectSession(args: ItemEventData) {
        var session = <SessionModel>args.view.bindingContext;
        this.hideSearchKeyboard();
        if (!session.isBreak) {
            let link = ['/session-details', session.id];
            this._routerExtensions.navigate(link);
        }
    }


    public getClass(session: SessionModel) {
        if (session.favorite) {
            return 'star-img';
        }
        else {
            return 'star-img star-img-29';
        }
    }



    public toggleFavorite(session: SessionModel, args: GestureEventData, idx: number) {

        let grid = <GridLayout>args.view;
        let abs = <AbsoluteLayout>grid.getChildAt(0);
        let stack = <StackLayout>abs.getChildAt(0);
        let lbl = <Label>stack.getChildAt(0);

        console.log('toggleFavorite lbl class: ' + lbl.className + ', index: ' + idx);


        this._sessionsService.toggleFavorite(session)
            .then(() => {
                console.log('done toggling favorite: ' + session.title);
                this.toggleFavVisual(session, lbl)
                    .then(() => {
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
                this.animateStar(lbl)
                    .then(() => {
                        resolve();
                    });
            }
        });
    }

    /*
        private animateStar(lbl: Label) {
            return new Promise((resolve, reject) => {
                console.log('animateStar');
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
        */

    private animateStar(lbl: Label) {
        return new Promise((resolve, reject) => {
            console.log('animateStar');
            var x = 0;
            var y = 0;
            var index = 1;

            var cancel = setInterval(() => {

                //this.setBackgroundPosition(lbl, x + ' ' + y);
                this.setStarClass(lbl, index);
                x = x - 50;
                index++;
                if (index == 30) {
                    clearInterval(cancel);
                    resolve();
                }
            }, 20);

        });
    }

    private setStarClass(view: View, idx: number) {
        view.className = 'star-img star-img-' + idx;
    }

    private animateUnfavorite(lbl: Label) {
        return new Promise((resolve, reject) => {
            //this.setBackgroundPosition(lbl, '0 0');
            lbl.className = 'star-img';
            resolve();
        });

    }

    private setBackgroundPosition(view: View, posish: string) {
        view.style.backgroundPosition = posish;
    }

    private hideSearchKeyboard() {
        hideSearchKeyboard(this.searchBar.nativeElement);
    }

    public report() {
        let lv = <ListView>this._page.getViewById('sessionList');
        console.log('---------------------------------------------------------------------------------------');
        for (var i = 0; i < lv.items.length; i++) {

            let sm = <SessionModel>lv.items[i];
            console.dir(i + ': ' + sm.favorite);
        }

    }

}


var a = 0;