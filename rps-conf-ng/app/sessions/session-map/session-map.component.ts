// angular
import { Component, ViewChild, ChangeDetectorRef, Inject, OnInit, AfterViewInit, ElementRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

// nativescript
import { RadSideDrawerComponent, SideDrawerType } from 'nativescript-telerik-ui/sidedrawer/angular';
import { DrawerTransitionBase, SlideInOnTopTransition } from 'nativescript-telerik-ui/sidedrawer';
import { NativeScriptRouterModule, RouterExtensions } from 'nativescript-angular/router';
import { GestureEventData, SwipeGestureEventData, SwipeDirection } from 'ui/gestures';
import { Page } from "ui/page";
import { Button } from 'ui/button';
import { Label } from 'ui/label';
import { ImageSource } from 'image-source';
import * as imageSourceModule from 'image-source';

import { IRoomInfo } from '../../shared/interfaces';
import { SessionsService } from '../../services/sessions.service';
import { RoomMapService } from '../../services/room-map.service';
import { SessionModel } from '../shared/session.model';


@Component({
  moduleId: module.id,
  selector: 'session-map',
  templateUrl: 'session-map.component.html'
})
export class SessionMapComponent implements OnInit {

  public room: IRoomInfo;

  public isLoading: boolean = false;
  public image: Observable<ImageSource>;

  constructor(private _page: Page, private _sessionsService: SessionsService, private _roomMapService: RoomMapService, private route: ActivatedRoute,
    private location: Location, private routerExtensions: RouterExtensions, private zone: NgZone) {
    this._page.actionBarHidden = true;
  }

  public ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.isLoading = true;
      let id: string = params['id'];
      this._sessionsService.getSessionById(id)
        .then((session: SessionModel) => {
          this.room = session.roomInfo;
          this.image = Observable.fromPromise<ImageSource>(this._roomMapService.getRoomImage(this.room));
          this.image.subscribe(observer => {
            this.isLoading = false;
          });
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
