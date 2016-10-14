// angular
import { Component, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, Inject, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

// nativescript
import { RadSideDrawerComponent, SideDrawerType } from 'nativescript-telerik-ui/sidedrawer/angular';
import { DrawerTransitionBase, SlideInOnTopTransition } from 'nativescript-telerik-ui/sidedrawer';
import { NativeScriptRouterModule, RouterExtensions } from 'nativescript-angular/router';
import { Page } from "ui/page";
import { ItemEventData } from 'ui/list-view';
import { GestureEventData } from 'ui/gestures';

import { ISession, IConferenceDay } from './shared/interfaces';
import { SessionModel } from './sessions/shared/session.model';
import { SessionsService } from './services/sessions.service';
import { conferenceDays } from './shared/static-data';

import { DrawerService } from './drawer.service';


@Component({
  moduleId: module.id,
  selector: 'start',
  templateUrl: 'start.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StartComponent implements OnInit {

  private _selectedIndex: number = 0;

  public actionBarTitle: string = 'All sessions';
  public dayHeader: string = '';

  //public sessions: Observable<Array<SessionModel>>;
  public sessions: BehaviorSubject<Array<SessionModel>> = new BehaviorSubject([]);
  //private _allSessions: Array<SessionModel> = [];


  public get confDayOptions(): Array<IConferenceDay> {
    return conferenceDays;
  }

  get selectedIndex(): number {
    //console.log('getting selectedIndex');
    return this._selectedIndex;
  }
  set selectedIndex(value: number) {
    //console.log('setting selectedIndex=' + value);
    if (this._selectedIndex !== value) {
      this._selectedIndex = value;
      //this.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: "selectedIndex", value: value });

      this.dayHeader = conferenceDays[value].desc;

      /*
                  if (this.search !== '') {
                      this.search = '';
                  } else {
                      this.filter();
                  }
                  */
    }
  }

  constructor(private _sessionsService: SessionsService, private zone: NgZone, private _drawerService: DrawerService, private routerExtensions: RouterExtensions) {
    this.dayHeader = conferenceDays[this.selectedIndex].desc;


  }

  public ngOnInit() {

    /*
    var p = this._sessionsService.loadSessions<Array<ISession>>();
    this.sessions = Observable.fromPromise(p)
      .map(s => s.map(s1 => new SessionModel(s1)));
      */


    console.log('list on init. sessionsloaded= ' + this._sessionsService.sessionsLoaded);
    var p = this._sessionsService.loadSessions<Array<ISession>>()
      .then((newSessions: Array<ISession>) => {
        //this._allSessions = newSessions.map(s => new SessionModel(s));

        this.publishUpdates();
      });
  }

  private publishUpdates() {
    // Make sure all updates are published inside NgZone so that change detection is triggered if needed
    this.zone.run(() => {
      // must emit a *new* value (immutability!)
      //console.log('in the zone, updating sessions');
      this.sessions.next([...this._sessionsService.allSessions]);


    });
  }

  public selectSession(args: ItemEventData) {
    var session = <SessionModel>args.view.bindingContext;
    //hideSearchKeyboard();
    if (!session.isBreak) {
      //console.log('select session ' + session.title);
      let link = ['/details', session.id];
      this.routerExtensions.navigate(link);
      //navigationModule.gotoSessionPage(session);
    }

  }

  public toggleFavorite(session: SessionModel) {
    session.toggleFavorite();
  }

  public showSlideout(args: GestureEventData) {
    this._drawerService.showDrawer();
  }

}
var a = 5;