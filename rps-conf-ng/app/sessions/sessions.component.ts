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
import { View } from 'ui/core/view';
import { StackLayout } from 'ui/layouts/stack-layout';
import { ItemEventData } from 'ui/list-view';
import { GestureEventData } from 'ui/gestures';
import * as frameModule from 'ui/frame';

//app
import { ISession, IConferenceDay } from '../shared/interfaces';
import { DrawerService } from '../services/drawer.service';
import { conferenceDays, hideSearchKeyboard } from '../shared';
import { SessionModel } from './shared/session.model';


@Component({
  moduleId: module.id,
  selector: 'sessions',
  templateUrl: 'sessions.component.html'
})
export class SessionsComponent implements OnInit, AfterViewInit {

  private _menuOnClass = 'menu-bar-on';
  private _menuOffClass = 'menu-bar-off';
  private _selectedIndex: number;

  public isLoading = true;
  public isSessionsPage = true;
  public selectedViewIndex: number;
  public actionBarTitle: string = 'All sessions';
  public dayHeader: string = '';
  public selectedSession: SessionModel = null;

  @ViewChild(RadSideDrawerComponent) public drawerComponent: RadSideDrawerComponent;
  @ViewChild("myMenuBtnBar1") bar1Ref: ElementRef;
  @ViewChild("myMenuBtnBar2") bar2Ref: ElementRef;
  @ViewChild("myMenuBtnBar3") bar3Ref: ElementRef;

  public get bar1(): Label {
    return this.bar1Ref.nativeElement;
  }
  public get bar2(): Label {
    return this.bar2Ref.nativeElement;
  }
  public get bar3(): Label {
    return this.bar3Ref.nativeElement;
  }

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
    return this._drawerService.sideDrawerTransition;
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

  public drawerClosing(args) {
    if (this._drawerService.IsDrawerOpen) {
      this.animateMenuIcon();
    }
  }

  public showSlideout(args: GestureEventData) {
    this._drawerService.showDrawer();
    this.animateMenuIcon();
    //hideSearchKeyboard(this.searchBar.nativeElement);
  }

  public sessionSelected(session: SessionModel) {
    this.selectedSession = session;
    this.removeMenuAnimationClasses();
  }

  private animateMenuIcon() {
    this.toggleClassOnView(this.bar1, this._menuOnClass, this._menuOffClass);
    this.toggleClassOnView(this.bar2, this._menuOnClass, this._menuOffClass);
    this.toggleClassOnView(this.bar3, this._menuOnClass, this._menuOffClass);
  }

  private toggleClassOnView(view: View, className1: string, className2: string) {
    var newClassName = view.className.trim();
    if (view.className.indexOf(className1) >= 0) {
      newClassName = view.className.replace(className1, '');
      newClassName = newClassName.trim() + ' ' + className2;
    } else {
      newClassName = view.className.replace(className2, '');
      newClassName = newClassName.trim() + ' ' + className1;
    }
    view.className = newClassName;
  }

  private removeMenuAnimationClasses() {
    this.bar1.className = this.bar1.className.replace(this._menuOnClass, '').replace(this._menuOffClass, '');
    this.bar2.className = this.bar2.className.replace(this._menuOnClass, '').replace(this._menuOffClass, '');
    this.bar3.className = this.bar3.className.replace(this._menuOnClass, '').replace(this._menuOffClass, '');
  }


  /*-----navigate by function*/
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

var a = 0;