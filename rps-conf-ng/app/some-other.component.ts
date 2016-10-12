

// angular
import {Component, ViewChild, ChangeDetectorRef, Inject, OnInit, AfterViewInit} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';

// nativescript
import {RadSideDrawerComponent, SideDrawerType} from 'nativescript-telerik-ui/sidedrawer/angular';
import {DrawerTransitionBase, SlideInOnTopTransition} from 'nativescript-telerik-ui/sidedrawer';
import {Page} from "ui/page";
import { GestureEventData } from 'ui/gestures';

import { DrawerService } from './drawer.service';

@Component({
  moduleId: module.id,
  selector: 'some-other',
  templateUrl: 'some-other.component.html'
})
export class SomeOtherComponent {

  public actionBarTitle: string = 'Sponsors';

  constructor(private _drawerService: DrawerService) {

  }


  public showSlideout(args: GestureEventData) {
    this._drawerService.showDrawer();
  }
  


}
