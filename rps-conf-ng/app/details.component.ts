

// angular
import {Component, ViewChild, ChangeDetectorRef, Inject, OnInit, AfterViewInit} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';

// nativescript
import {RadSideDrawerComponent, SideDrawerType} from 'nativescript-telerik-ui/sidedrawer/angular';
import {DrawerTransitionBase, SlideInOnTopTransition} from 'nativescript-telerik-ui/sidedrawer';
import {Page} from "ui/page";


@Component({
  moduleId: module.id,
  selector: 'session-details',
  templateUrl: 'details.component.html',
  styleUrls: ['details.component.css']
})
export class DetailsComponent {

  constructor(private _page: Page) {
    this._page.actionBarHidden = true;
  }

}
