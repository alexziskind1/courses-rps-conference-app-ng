

// angular
import { Component, ViewChild, ChangeDetectorRef, Inject, Output, EventEmitter, OnInit, AfterViewInit, ElementRef } from '@angular/core';
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

import { SessionsService } from '../../services/sessions.service';
import { SessionModel } from '../shared/session.model';


@Component({
  moduleId: module.id,
  selector: 'session-details',
  templateUrl: 'session-details.component.html',
  styleUrls: ['session-details.component.css']
})
export class SessionDetailsComponent implements OnInit {

  public session: SessionModel;

  @Output() favorited = new EventEmitter();

  @ViewChild('btnDesc') btnDesc: ElementRef;
  @ViewChild('lblDesc') lblDesc: ElementRef;


  constructor(private _page: Page, private _sessionsService: SessionsService, private route: ActivatedRoute,
    private location: Location, private routerExtensions: RouterExtensions) {
    this._page.actionBarHidden = true;


    this.favorited.subscribe((f) => {
      console.log('subscription hit');
      console.dir(f);
    });
  }

  public ngOnInit() {
    this.route.params.forEach((params: Params) => {
      let id: string = params['id'];

      console.log('details oninit id:' + id);

      this._sessionsService.getSessionById(id)
        .then((session: SessionModel) => {
          this.session = session;
        });

    });
  }


  public backSwipe(args: SwipeGestureEventData) {
    if (args.direction === SwipeDirection.right) {
      this.routerExtensions.backToPreviousPage();
    }
  }

  public backTap() {
    this.routerExtensions.back();
  }

  public showMapTap() {
    //console.log('select session ' + session.title);
    let link = ['/session-map', this.session.id];
    this.routerExtensions.navigate(link);
  }

  public toggleFavorite() {
    this.session.toggleFavorite();
    this.favorited.next(this.session.favorite);
  }

  public toogleDescription() {
    let btn = <Button>this.btnDesc.nativeElement;
    let lbl = <Label>this.lblDesc.nativeElement;
    if (btn.text === 'MORE') {
      btn.text = 'LESS';
      lbl.text = this.session.description;
    }
    else {
      btn.text = 'MORE';
      lbl.text = this.session.descriptionShort;
      //scroll.scrollToVerticalOffset(0, false);
    }
  }

}
