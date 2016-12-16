//angular
import { Component, Input, Output, EventEmitter, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, NgZone, ElementRef } from "@angular/core";
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
import { conferenceDays, hideSearchKeyboard, slideInAnimations } from '../../shared';


@Component({
    moduleId: module.id,
    selector: "session-list",
    templateUrl: "session-list.component.html",
    styleUrls: ['session-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: slideInAnimations
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

    public get animationState() {
        return this.selectedViewIndex === 2 ? 'off' : 'on';
    }

    constructor(private _sessionsService: SessionsService,
        private _zone: NgZone,
        private _routerExtensions: RouterExtensions) {
        this._selectedIndex = 0;
    }

    public ngOnInit() {
        this._sessionsService.items.subscribe(observer => {
            var delay = 0;
            observer.forEach((value: SessionModel, i: number, array: SessionModel[]) => {
                delay = delay + 500;
                setTimeout(() => {
                    value.triggerShow.next(true);
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
        if (this.sessionCardVisible)
            return;

        this.hideSearchKeyboard();
        if (!session.isBreak) {
            let link = ['/session-details', session.id];
            this._routerExtensions.navigate(link);
        }
    }

    public showSessionCard(session: SessionModel) {
        this.notifySessionSelected.emit(session);
    }

    private hideSearchKeyboard() {
        hideSearchKeyboard(this.searchBar.nativeElement);
    }

}
