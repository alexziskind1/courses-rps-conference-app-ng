// angular
import { Component, ViewChild, ChangeDetectorRef, Inject, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, Params } from '@angular/router';
import { Location } from '@angular/common';

// nativescript
import { RadSideDrawerComponent, SideDrawerType } from 'nativescript-telerik-ui/sidedrawer/angular';
import { DrawerTransitionBase, SlideInOnTopTransition } from 'nativescript-telerik-ui/sidedrawer';
import { NativeScriptRouterModule, RouterExtensions } from 'nativescript-angular/router';
import { GestureEventData, SwipeGestureEventData, SwipeDirection } from 'ui/gestures';
import { Page } from "ui/page";
import { Button } from 'ui/button';
import { Label } from 'ui/label';
import { ImageSource } from 'image-source';

import { IRoomInfo } from './shared/interfaces';
import { SessionsService } from './services/sessions.service';
import { SessionModel } from './sessions/shared/session.model';


@Component({
  moduleId: module.id,
  selector: 'session-map',
  templateUrl: 'map.component.html'
})
export class MapComponent implements OnInit {

  public room: IRoomInfo;

public isLoading: boolean = false;
public image: ImageSource;


  constructor(private _page: Page, private _sessionsService: SessionsService, private route: ActivatedRoute,
    private location: Location, private routerExtensions: RouterExtensions) {
    this._page.actionBarHidden = true;
  }

  public ngOnInit() {
    this.route.params.forEach((params: Params) => {
      let id: string = params['id'];

      console.log('details oninit id:' + id);

      this._sessionsService.getSessionById(id)
        .then((session: SessionModel) => {
            this.room = session.roomInfo;
        });
    });
  }


  public backSwipe(args: SwipeGestureEventData) {
    if (args.direction === SwipeDirection.right) {
      this.routerExtensions.backToPreviousPage();
    }
  }

  public backTap() {
    this.routerExtensions.backToPreviousPage();
  }


}
