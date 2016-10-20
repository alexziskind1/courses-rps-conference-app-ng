//angular
import { Component, Input, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, NgZone, ElementRef } from "@angular/core";
import { Observable, BehaviorSubject } from 'rxjs/Rx';


//nativescript
import { RadSideDrawerComponent } from "nativescript-telerik-ui/sidedrawer/angular";
import { NativeScriptRouterModule, RouterExtensions } from 'nativescript-angular/router';
import { ItemEventData } from 'ui/list-view';


//app
import { SessionsService } from '../../services/sessions.service';
import { FavoritesService } from '../../services/favorites.service';
import { ISession, IConferenceDay } from '../../shared/interfaces';
import { SessionModel } from '../shared/session.model';
import { conferenceDays, hideSearchKeyboard } from '../../shared';


@Component({
    moduleId: module.id,
    selector: "session-list",
    templateUrl: "session-list.component.html",
    //changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionListComponent implements OnInit {

    private _selectedIndex: number;
    private _search = '';
    private _selectedViewIndex: number;

    public get selectedViewIndex() {
        return this._selectedViewIndex;
    }
    @Input() public set selectedViewIndex(val: number) {
        this._selectedViewIndex = val;
        if (this._selectedViewIndex < 2) {
            this.filter();
        }
    }
    public dayHeader: string = '';
    public sessions: BehaviorSubject<Array<SessionModel>> = new BehaviorSubject([]);

    @ViewChild('searchBar') public searchBar: ElementRef;

    public get selectedIndex(): number {
        return this._selectedIndex;
    }
    public set selectedIndex(value: number) {
        if (this._selectedIndex !== value) {
            this._selectedIndex = value;
            this.dayHeader = conferenceDays[value].desc;

            if (this.search !== '') {
                this.search = '';
            } else {
                this.filter();
            }
        }
    }

    public get search(): string {
        return this._search;
    }
    public set search(value: string) {
        if (this._search !== value) {
            this._search = value;
            this.filter();
        }
    }

    constructor(private _sessionsService: SessionsService,
        private _zone: NgZone,
        private _routerExtensions: RouterExtensions) {
        this.selectedIndex = 0;
        //this.selectedViewIndex = 1;
    }


    public ngOnInit() {
        var p = this._sessionsService.loadSessions<Array<ISession>>()
            .then((newSessions: Array<ISession>) => {
                this.filter();
            });
    }

    private filter() {
        var filtered = this._sessionsService.filter(conferenceDays[this.selectedIndex].date.getDate(), this.search, this.selectedViewIndex);
        this.publishUpdates();
    }

    private publishUpdates() {
        // Make sure all updates are published inside NgZone so that change detection is triggered if needed
        this._zone.run(() => {
            // must emit a *new* value (immutability!)
            this.sessions.next([...this._sessionsService.sessions]);
        });
    }

    public selectSession(args: ItemEventData) {
        var session = <SessionModel>args.view.bindingContext;
        //shideSearchKeyboard(this.searchBar.nativeElement);
        if (!session.isBreak) {
            let link = ['/session-details', session.id];
            this._routerExtensions.navigate(link);
        }
    }

    public toggleFavorite(session: SessionModel) {
        session.toggleFavorite();
    }


}
