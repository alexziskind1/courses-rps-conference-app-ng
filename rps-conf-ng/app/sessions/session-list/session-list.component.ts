//angular
import { Component, Input, Output, EventEmitter, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, NgZone, ElementRef } from "@angular/core";
import { Observable, BehaviorSubject } from 'rxjs/Rx';


//nativescript
import { RadSideDrawerComponent } from "nativescript-telerik-ui/sidedrawer/angular";
import { NativeScriptRouterModule, RouterExtensions } from 'nativescript-angular/router';
import { ItemEventData } from 'ui/list-view';
import { GestureEventData, GestureEventDataWithState } from 'ui/gestures';


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
    styleUrls: ['session-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionListComponent implements OnInit {

    private _search = '';
    private _selectedIndex: number = 0;
    private _selectedViewIndex: number;

    public dayHeader: string = '';

    @Output() notifySessionSelected: EventEmitter<SessionModel> = new EventEmitter<SessionModel>();

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

    @Input() public sessionCardVisible: boolean;

    public get search(): string {
        return this._search;
    }
    public set search(value: string) {
        if (this._search !== value) {
            this._search = value;
            this.refresh();
        }
    }

    constructor(private _sessionsService: SessionsService,
        private _zone: NgZone,
        private _routerExtensions: RouterExtensions) {
        this._selectedIndex = 0;
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

    public selectSession(args: ItemEventData, session: SessionModel) {
        //var session = <SessionModel>args.view.bindingContext;
        if (this.sessionCardVisible)
            return;

        this.hideSearchKeyboard();
        if (!session.isBreak) {
            let link = ['/session-details', session.id];
            this._routerExtensions.navigate(link);
        }
    }

    public showSessionCard(session: SessionModel, event: GestureEventData) {
        this.notifySessionSelected.emit(session);
    }


    public toggleFavorite(session: SessionModel) {
        if (this.sessionCardVisible)
            return;

        this._sessionsService.toggleFavorite(session)
            .then(() => {
                console.log('done toggling favorite');
            });
    }

    private hideSearchKeyboard() {
        hideSearchKeyboard(this.searchBar.nativeElement);
    }

}

var a = 0;