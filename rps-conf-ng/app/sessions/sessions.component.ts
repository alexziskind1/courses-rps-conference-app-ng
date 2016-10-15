// angular
import { Component, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy, Inject, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { ActivatedRoute, Params, Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { NativeScriptRouterModule, RouterExtensions } from 'nativescript-angular/router';

// nativescript
import { RadSideDrawerComponent } from 'nativescript-telerik-ui/sidedrawer/angular';
import { DrawerTransitionBase, SlideInOnTopTransition } from 'nativescript-telerik-ui/sidedrawer';
import { Page } from "ui/page";
import { Button } from 'ui/button';
import { ItemEventData } from 'ui/list-view';
import { GestureEventData } from 'ui/gestures';
import * as frameModule from 'ui/frame';

import { ISession, IConferenceDay } from '../shared/interfaces';
import { SessionsService } from '../services/sessions.service';
import { DrawerService } from '../services/drawer.service';
import { SessionModel } from './shared/session.model';
import { conferenceDays } from '../shared/static-data';

@Component({
  moduleId: module.id,
  selector: 'sessions',
  templateUrl: 'sessions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionsComponent implements OnInit, AfterViewInit {

  @ViewChild(RadSideDrawerComponent) public drawerComponent: RadSideDrawerComponent;
  //private _sideDrawerTransition: DrawerTransitionBase;
  //private _drawer: SideDrawerType;
  isLoading = false;
  private _selectedIndex: number = 0;
  public selectedViewIndex: number = 1;

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




  constructor(
    @Inject(Page) private _page: Page,
    private _changeDetectionRef: ChangeDetectorRef,
    private _router: Router,
    private _routerExtensions: RouterExtensions,
    private _location: Location,
    private _drawerService: DrawerService,
    private _sessionsService: SessionsService, private zone: NgZone, private routerExtensions: RouterExtensions, private route: ActivatedRoute) {

    _page.on("loaded", this.onLoaded, this);
    _page.backgroundSpanUnderStatusBar = true;
  }

  public get sideDrawerTransition(): DrawerTransitionBase {
    //return this._sideDrawerTransition;
    return this._drawerService.sideDrawerTransition;
  }

  public toggle() {
    //this._drawer.toggleDrawerState();
    this._drawerService.toggleDrawerState();
  }


  public onLoaded(args) {
    this._drawerService.sideDrawerTransition = new SlideInOnTopTransition();
    //this._sideDrawerTransition = new SlideInOnTopTransition();
  }

  ngOnInit() {
    console.log('home oninit');
    this.route.params.forEach((params: Params) => {
      let id: string = params['id'];

      console.log('home oninit id:' + id);

      this.selectedViewIndex = parseInt(id);
    });


    this._router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        //this._drawer.closeDrawer();
        this._drawerService.closeDrawer();
      }
    });

    //console.log('list on init. sessionsloaded= ' + this._sessionsService.sessionsLoaded);
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

  ngAfterViewInit() {
    //this._drawer = this.drawerComponent.sideDrawer;
    //this._changeDetectionRef.detectChanges();

    this._drawerService.initDrawer(this.drawerComponent.sideDrawer);
    this._changeDetectionRef.detectChanges();
  }

  showActivityIndicator() {
    this.isLoading = true;
  }

  public selectView(viewIndex: number, pageTitle: string) {
    this.selectedViewIndex = viewIndex;
    this._drawerService.closeDrawer();

    if (this.selectedViewIndex < 2) {
      //this.filter();
    }
    //this.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: "selectedViewIndex", value: this.selectedViewIndex });
    //this.set('actionBarTitle', titleText);
    //this.set('isSessionsPage', this.selectedViewIndex < 2);

    this.actionBarTitle = pageTitle;
  }


  public selectSession(args: ItemEventData) {
    var session = <SessionModel>args.view.bindingContext;
    //hideSearchKeyboard();
    if (!session.isBreak) {
      //console.log('select session ' + session.title);
      let link = ['/session-details', session.id];
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


///////////////////////////////////////////// 
/*
import { Label } from 'ui/label';
import { StackLayout } from 'ui/layouts/stack-layout';

function navFactoryFunc() {
    var label = new Label();
    label.text = "App created by Nuvious";
        
    var btnBack = new Button();
    btnBack.text = "back";
    btnBack.on('tap', navigationModule.goBack);
    
    var stackLayout = new StackLayout();
    stackLayout.addChild(label);
    stackLayout.addChild(btnBack);

    var dynamicPage = new Page();
    dynamicPage.content = stackLayout;
    return dynamicPage;
};

export function goToAcknowledgementPage() {
    navigationModule.goToPageByFunction(navFactoryFunc);
}

*/