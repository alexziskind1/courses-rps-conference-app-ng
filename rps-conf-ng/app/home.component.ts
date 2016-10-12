// angular
import {Component, ViewChild, ChangeDetectorRef, Inject, OnInit, AfterViewInit} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import { Location }                 from '@angular/common';

import { NativeScriptRouterModule, RouterExtensions } from 'nativescript-angular/router';


// nativescript
import {RadSideDrawerComponent} from 'nativescript-telerik-ui/sidedrawer/angular';
import {DrawerTransitionBase, SlideInOnTopTransition} from 'nativescript-telerik-ui/sidedrawer';
import {Page} from "ui/page";

import { DrawerService } from './drawer.service';


@Component({
  moduleId: module.id,
  selector: 'home',
  templateUrl: 'home.component.html'
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild(RadSideDrawerComponent) public drawerComponent: RadSideDrawerComponent;
  //private _sideDrawerTransition: DrawerTransitionBase;
  //private _drawer: SideDrawerType;
  isLoading = false;
  
  constructor(
    @Inject(Page) private _page: Page,
    private _changeDetectionRef: ChangeDetectorRef,
    private _router: Router,
    private _routerExtensions: RouterExtensions,
    private _location: Location,
    private _drawerService: DrawerService) {
    _page.on("loaded", this.onLoaded, this);
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
    this._router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        //this._drawer.closeDrawer();
        this._drawerService.closeDrawer();
      }
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
}