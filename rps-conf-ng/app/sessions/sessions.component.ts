// angular
import { Component, ViewChild, ElementRef, Inject, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params, Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, BehaviorSubject } from 'rxjs/Rx';


// nativescript
import { NativeScriptRouterModule, RouterExtensions } from 'nativescript-angular/router';
import { RadSideDrawerComponent } from 'nativescript-telerik-ui/sidedrawer/angular';
import { DrawerTransitionBase, SlideInOnTopTransition, ScaleUpTransition } from 'nativescript-telerik-ui/sidedrawer';
import { Page } from "ui/page";
import { Button } from 'ui/button';
import { Label } from 'ui/label';
import { StackLayout } from 'ui/layouts/stack-layout';
import { ItemEventData } from 'ui/list-view';
import { GestureEventData } from 'ui/gestures';
import * as frameModule from 'ui/frame';

//app
import { ISession, IConferenceDay } from '../shared/interfaces';
import { DrawerService } from '../services/drawer.service';
import { conferenceDays, hideSearchKeyboard } from '../shared';

@Component({
  moduleId: module.id,
  selector: 'sessions',
  templateUrl: 'sessions.component.html'
})
export class SessionsComponent implements OnInit, AfterViewInit {

  private _selectedIndex: number;

  public isLoading = true;
  public isSessionsPage = true;
  public selectedViewIndex: number;
  public actionBarTitle: string = 'All sessions';
  public dayHeader: string = '';

  @ViewChild(RadSideDrawerComponent) public drawerComponent: RadSideDrawerComponent;


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
    }
  }


  constructor(
    private _page: Page,
    private _router: Router,
    private _drawerService: DrawerService) {

    _page.backgroundSpanUnderStatusBar = true;
    this.selectedIndex = 0;
    this.selectedViewIndex = 1;
  }

  public ngOnInit() {
    this._router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this._drawerService.closeDrawer();
      }
    });
  }

  public get sideDrawerTransition(): DrawerTransitionBase {
    return new ScaleUpTransition();
  }

  public toggle() {
    this._drawerService.toggleDrawerState();
  }

  public ngAfterViewInit() {
    this._drawerService.initDrawer(this.drawerComponent.sideDrawer);
  }

  public showActivityIndicator() {
    this.isLoading = true;
  }

  public selectView(viewIndex: number, pageTitle: string) {
    this.selectedViewIndex = viewIndex;
    this._drawerService.closeDrawer();
    this.actionBarTitle = pageTitle;
    this.isSessionsPage = this.selectedViewIndex < 2;
  }

  public showSlideout(args: GestureEventData) {
    this._drawerService.showDrawer();
    //hideSearchKeyboard(this.searchBar.nativeElement);
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





