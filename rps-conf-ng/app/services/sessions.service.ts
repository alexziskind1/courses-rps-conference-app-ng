import { Injectable } from '@angular/core';
import * as httpModule from 'http';
import * as constantsModule from '../shared/constants';
import * as fakeDataServiceModule from './fake-data.service';
import { ISession } from '../shared/interfaces';
import { SessionModel } from '../sessions/shared/session.model';

@Injectable()
export class SessionsService {

    public sessionsLoaded = false;
    private _useHttpService: boolean = false;
    private _allSessions: Array<SessionModel> = [];

    public get allSessions() {
        return this._allSessions;
    }

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
}

