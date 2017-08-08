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
import { View } from 'ui/core/view';
import { Layout } from 'ui/layouts/layout';
import { TextView } from 'ui/text-view';


//app
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

  @ViewChild('btnDesc') btnDesc: ElementRef;
  @ViewChild('lblDesc') lblDesc: ElementRef;

  constructor(private _page: Page, private _sessionsService: SessionsService, private route: ActivatedRoute,
    private location: Location, private routerExtensions: RouterExtensions) {
    this._page.actionBarHidden = true;
    this._page.backgroundSpanUnderStatusBar = true;
  }

  public ngOnInit() {
    this.route.params.forEach((params: Params) => {
      let id: string = params['id'];

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
    let link = ['/session-map', this.session.id];
    this.routerExtensions.navigate(link);
  }

  public toggleFavorite() {
    this._sessionsService.toggleFavorite(this.session)
      .then(() => {
        console.log('done toggling fav from details');
      });
  }

  private descHeight = 20;

  public descWrapperLoaded(lblDescWrapper: Layout, txtDesc: TextView, lblDesc: Label) {
    let lblHeight = lblDesc.getMeasuredHeight();
    this.descHeight = lblHeight;

    lblDesc.visibility = 'collapse';
    lblDescWrapper.height = 60;

    if (txtDesc.ios) {
      txtDesc.ios.scrollEnabled = false;
    }
    if (txtDesc.android) {
      //txtDesc.android.//android equivalent of scrollEnabled
    }

  }

  public toogleDescription(wrapper: Layout) {
    let btn = <Button>this.btnDesc.nativeElement;
    let lbl = <Label>this.lblDesc.nativeElement;
    if (btn.text === 'MORE') {
      btn.text = 'LESS';
      //lbl.text = this.session.description;
      changeHeight(wrapper, toTheFifth, 1000, 60, this.descHeight);
    }
    else {
      btn.text = 'MORE';
      //lbl.text = this.session.descriptionShort;
      //scroll.scrollToVerticalOffset(0, false);
      changeHeight(wrapper, toTheFifth, 1000, this.descHeight, 60);
    }
  }

}

function changeHeight(view: View, deltaCalc: (p) => {}, duration?: number, from?: number, to?: number) {
  var _from = from || 1;
  var _to = to || 500;

  animate({
    duration: duration || 1000, //1 second by default
    delay: 5,
    delta: deltaCalc,
    step: function (delta: number) {
      view.height = (to - from) * delta + from;
    }
  });
}

function animate(opts) {
  var start = new Date();

  var id = setInterval(function () {
    var timePassed = <any>(new Date()) - <any>start;
    var progress = timePassed / opts.duration;
    if (progress > 1) progress = 1;

    var delta = opts.delta(progress);
    opts.step(delta);

    if (progress == 1) {
      clearInterval(id);
    }
  }, opts.delay || 10);

}

function toTheFifth(progress) {
  return Math.pow(progress, 5);
}
