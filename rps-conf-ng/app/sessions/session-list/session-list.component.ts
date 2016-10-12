import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { RadSideDrawerComponent } from "nativescript-telerik-ui/sidedrawer/angular";


import { conferenceDays } from '../../shared/static-data';
import { SessionsService } from '../../services/sessions.service';
import { FavoritesService } from '../../services/favorites.service';
import { ISession, IConferenceDay } from '../../shared/interfaces';
import { SessionModel } from '../shared/session.model';


class DataItem {
    constructor(public id: number, public name: string) { }
}


@Component({
    selector: "session-list",
    templateUrl: "sessions/session-list/session-list.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionListComponent implements OnInit {
    private _selectedIndex = 0;
    private _search = '';
    private _allSessions: Array<SessionModel> = [];
    private _sessions: Array<SessionModel> = [];

    public actionBarTitle = 'All sessions';
    public dayHeader = '';
    public isLoading = true;
    public isSessionsPage = true;
    public selectedViewIndex: number = 1;


    public myItems: Array<DataItem> = [];
    private counter: number = 0;


    get confDayOptions(): Array<IConferenceDay> {
        return conferenceDays;
    }

    get sessions(): Array<SessionModel> {
        return this._sessions;
    }

    get favorites(): Array<SessionModel> {
        
        return this.sessions.filter(i => { return i.favorite });
    }

    get search(): string {
        return this._search;
    }
    set search(value: string) {
        if (this._search !== value) {
            this._search = value;
            //this.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: "search", value: value });

            this.filter();
        }
    }

    get selectedIndex(): number {
        return this._selectedIndex;
    }
    set selectedIndex(value: number) {
        if (this._selectedIndex !== value) {
            this._selectedIndex = value;
            //this.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: "selectedIndex", value: value });

            this.dayHeader = conferenceDays[value].desc;

            if (this.search !== '') {
                this.search = '';
            } else {
                this.filter();
            }
        }
    }


    @ViewChild(RadSideDrawerComponent) public sidedrawer: RadSideDrawerComponent;

    constructor(private sessionsService: SessionsService, private favoritesService: FavoritesService) {
            for (var i = 0; i < 50; i++) {
                this.myItems.push(new DataItem(i, "data item " + i));
                this.counter = i;
                console.log('item' +i );
        }
    }

    public ngOnInit() {
        this.sessionsService.loadSessions()
            .then((result: Array<ISession>) => {
                this.pushSessions(result);
                this.onDataLoaded();
            });
    }

    private onDataLoaded() {
        this.isLoading = false;
        
        this.filter();
        console.log('num sessions: ' + this.sessions.length);
    }

    private filter() {
        this._sessions = this._allSessions.filter(s => {
            return s.startDt.getDate() === conferenceDays[this.selectedIndex].date.getDate()
                && s.title.toLocaleLowerCase().indexOf(this.search.toLocaleLowerCase()) >= 0;
        });

        if (this.selectedViewIndex === 0) {
            this._sessions = this._sessions.filter(i=> { return i.favorite || i.isBreak; });
        }

        //this.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: "sessions", value: this._sessions });
    }

    private pushSessions(sessionsFromService: Array<ISession>) {
        for (var i = 0; i < sessionsFromService.length; i++) {
            var newSession = new SessionModel(sessionsFromService[i]);

            var indexInFavs = this.favoritesService.findSessionIndexInFavourites(newSession.id);
            if (indexInFavs >= 0) {
                newSession.favorite = true;
                //newSession.calendarEventId = this.favoritesService.favourites[indexInFavs].calendarEventId;
            }
            this._allSessions.push(newSession);
        }
    }

    public openDrawer() {
        this.sidedrawer.sideDrawer.showDrawer();
    }

}
