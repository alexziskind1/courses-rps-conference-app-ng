//angular
import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from "rxjs/Rx";

//nativescript
import * as httpModule from 'http';

//app
import * as constantsModule from '../shared/constants';
import * as fakeDataServiceModule from './fake-data.service';
import { ISession } from '../shared/interfaces';
import { SessionModel } from '../sessions/shared/session.model';
import { FilterState } from '../sessions/shared/filter-state.model';

@Injectable()
export class SessionsService {

    public sessionsLoaded = false;
    private _useHttpService: boolean = false;
    private _allSessions: Array<SessionModel> = [];
    private _filterState: FilterState;

    public items: BehaviorSubject<Array<SessionModel>> = new BehaviorSubject([]);

    constructor(private _zone: NgZone) { }

    public loadSessions<T>(): Promise<T> {
        return new Promise((resolve, reject) => {
            if (this.sessionsLoaded) {
                resolve(this._allSessions);
            }
            else {
                if (this._useHttpService) {
                    return this.loadSessionsViaHttp<Array<ISession>>()
                        .then((newSessions: Array<ISession>) => {
                            this._allSessions = newSessions.map(s => new SessionModel(s));
                            this.sessionsLoaded = true;
                            resolve(this._allSessions);
                        });
                }
                else {
                    this.loadSessionsViaFaker<Array<ISession>>()
                        .then((newSessions: Array<ISession>) => {
                            this._allSessions = newSessions.map(s => new SessionModel(s));
                            this.sessionsLoaded = true;
                            resolve(this._allSessions);
                        });
                }
            }
        });
    }

    public getSessionById(sessionId: string) {
        return new Promise((resolve, reject) => {
            let filtered = this._allSessions.filter(s => s.id == sessionId);
            if (filtered.length > 0) {
                resolve(filtered[0]);
            }
            reject('could not find session with id:' + sessionId);
        });
    }

    private loadSessionsViaHttp<T>(): Promise<T> {
        var reqParams = {
            url: constantsModule.AZURE_URL + constantsModule.AZURE_TABLE_PATH + constantsModule.AZURE_TABLE_NAME + '?$orderby=start',
            method: 'GET',
            headers: constantsModule.AZURE_VERSION_HEADER
        };
        return httpModule.getJSON<T>(reqParams);
    }

    private loadSessionsViaFaker<T>(): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            let speakers = fakeDataServiceModule.generateSpeakers();
            let roomInfos = fakeDataServiceModule.generateRoomInfos();
            let sessions = <any>fakeDataServiceModule.generateSessions(speakers, roomInfos);
            resolve(sessions);
        });
    }

    public update(filterState: FilterState) {
        this._filterState = filterState;
        this.publishUpdates();
    }

    private publishUpdates() {
        let date = this._filterState.date;
        let search = this._filterState.search;
        let viewIndex = this._filterState.viewIndex;

        var filteredSessions = this._allSessions.filter(s => {
            return s.startDt.getDate() === date
                && s.title.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) >= 0;
        });

        if (viewIndex === 0) {
            filteredSessions = filteredSessions.filter(i => { return i.favorite || i.isBreak; });
        }

        // Make sure all updates are published inside NgZone so that change detection is triggered if needed
        this._zone.run(() => {
            // must emit a *new* value (immutability!)
            /*
            for (var i = 0; i < filteredSessions.length; i++) {
                this.items.next([filteredSessions[i]]);
            }*/
            this.items.next([...filteredSessions]);
        });
    }

    public toggleFavorite(session: SessionModel) {
        session.toggleFavorite();
        this.publishUpdates();
        return Promise.resolve(true);
    }
}

