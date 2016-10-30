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

    constructor(private _sessionsService: SessionsService,
        private _zone: NgZone,
        private _routerExtensions: RouterExtensions) {
        this._selectedIndex = 0;
    }

    public ngOnInit() {
        //var delay = 1000;

        var source = Observable.timer(
            5000, /* 5 seconds */
            1000 /* 1 second */)
            .timestamp();

        /*
                var subscription = source.subscribe(
                    x => console.log(x.value + ': ' + x.timestamp));
        */

        this._sessionsService.items.subscribe(observer => {
            var delay = 0;
            observer.forEach((value: SessionModel, i: number, array: SessionModel[]) => {
                delay = delay + 500;
                setTimeout(() => {
                    value.triggerShow.next(true);

                    console.log('item observed: ' + value.title + ', trieggerShow: ' + value.triggerShow);
                }, delay);
            });
        });

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
        this.hideSearchKeyboard();
        if (!session.isBreak) {
            let link = ['/session-details', session.id];
            this._routerExtensions.navigate(link);
        }
    }

    public toggleFavorite(session: SessionModel) {
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