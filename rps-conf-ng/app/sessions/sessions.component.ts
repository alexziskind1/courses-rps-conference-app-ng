// angular
import { Component, ViewChild, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Inject, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { ActivatedRoute, Params, Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { NativeScriptRouterModule, RouterExtensions } from 'nativescript-angular/router';

// nativescript
import { RadSideDrawerComponent } from 'nativescript-telerik-ui/sidedrawer/angular';
import { DrawerTransitionBase, SlideInOnTopTransition, ScaleUpTransition } from 'nativescript-telerik-ui/sidedrawer';
import { Page } from "ui/page";
import { Button } from 'ui/button';
import { Label } from 'ui/label';
import { StackLayout } from 'ui/layouts/stack-layout';
import { SearchBar } from 'ui/search-bar';
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
  styleUrls: ['sessions.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionsComponent implements OnInit, AfterViewInit {

  @ViewChild(RadSideDrawerComponent) public drawerComponent: RadSideDrawerComponent;
  @ViewChild('searchBar') public searchBar: ElementRef;

  private _selectedIndex: number;
  private _search = '';

  public isLoading = true;
  public selectedViewIndex: number;
  public actionBarTitle: string = 'All sessions';
  public dayHeader: string = '';
  public sessions: BehaviorSubject<Array<SessionModel>> = new BehaviorSubject([]);
  public session = {};
  public sessionPopupVisible: boolean = false;

  public get confDayOptions(): Array<IConferenceDay> {
    return conferenceDays;
  }

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

  constructor(
    @Inject(Page) private _page: Page,
    private _changeDetectionRef: ChangeDetectorRef,
    private _router: Router,
    private _location: Location,
    private _drawerService: DrawerService,
    private _sessionsService: SessionsService,
    private _zone: NgZone,
    private _routerExtensions: RouterExtensions,
    private _route: ActivatedRoute) {

    _page.backgroundSpanUnderStatusBar = true;

    this.selectedIndex = 0;
    this.selectedViewIndex = 1;
  }

  public ngOnInit() {
    this._route.params.forEach((params: Params) => {
      let id: string = params['id'];
      this.selectedViewIndex = parseInt(id);
    });

    this._router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this._drawerService.closeDrawer();
      }
    });

    var p = this._sessionsService.loadSessions<Array<ISession>>()
      .then((newSessions: Array<ISession>) => {
        this.filter();
      });
  }

  public get sideDrawerTransition(): DrawerTransitionBase {
    return this._drawerService.sideDrawerTransition;
  }

  public toggle() {
    this._drawerService.toggleDrawerState();
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

  public ngAfterViewInit() {
    this._drawerService.initDrawer(this.drawerComponent.sideDrawer);
    this._changeDetectionRef.detectChanges();
  }

  public showActivityIndicator() {
    this.isLoading = true;
  }

  public selectView(viewIndex: number, pageTitle: string) {
    this.selectedViewIndex = viewIndex;
    this._drawerService.closeDrawer();

    if (this.selectedViewIndex < 2) {
      this.filter();
    }
    this.actionBarTitle = pageTitle;
    this.hideSearchKeyboard();
  }

  public selectSession(args: ItemEventData) {
    var session = <SessionModel>args.view.bindingContext;
    this.hideSearchKeyboard();
    if (!session.isBreak) {
      let link = ['/session-details', session.id];
      this._routerExtensions.navigate(link);
    }
  }

  public longPressSession(item: SessionModel) {
    console.log('long press: ' + item.title);
    this.session = item;
    this.sessionPopupVisible = true;
  }

  public closeSessionPopup() {
    this.sessionPopupVisible = false;
  }

  public toggleFavorite(session: SessionModel) {
    session.toggleFavorite();
  }

  public showSlideout(args: GestureEventData) {
    this._drawerService.showDrawer();
    this.hideSearchKeyboard();
  }

  private hideSearchKeyboard() {
    var searchBar = <SearchBar>this.searchBar.nativeElement;
    if (searchBar.android) {
      searchBar.android.clearFocus();
    }
    if (searchBar.ios) {
      searchBar.ios.resignFirstResponder();
    }
  }

  public goToAcknowledgementPage() {
    console.log('goToAcknowledgementPage');
    frameModule.topmost().navigate(this.navFactoryFunc);
  }

  public navFactoryFunc() {
    var label = new Label();
    label.text = "App created by Nuvious";

    var btnBack = new Button();
    btnBack.text = "back";
    btnBack.on('tap', frameModule.goBack);


    var stackLayout = new StackLayout();
    stackLayout.addChild(label);
    stackLayout.addChild(btnBack);

    var dynamicPage = new Page();
    dynamicPage.content = stackLayout;
    return dynamicPage;
  };

}





var a = 2;