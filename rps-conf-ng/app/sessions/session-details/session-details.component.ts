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
import { TextView } from 'ui/text-view';
import { Layout } from 'ui/layouts/layout';
import { View } from 'ui/core/view';

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
  @ViewChild('lblDesc1') lblDesc1: ElementRef;

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

  private descHeight = 20;

  public descWrapperLoaded(wrapper: Layout, txtDesc: TextView, lblDesc: Label) {
    let h1 = lblDesc.getMeasuredHeight();

    this.descHeight = h1;
    lblDesc.visibility = 'collapsed';
    wrapper.height = 60;

    txtDesc.ios.scrollEnabled = false;
    console.log('SCROLL enabled: ' + txtDesc.ios.scrollEnabled);
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

  public toogleDescription(wrapper: Layout) {
    let btn = <Button>this.btnDesc.nativeElement;
    let lbl = <Label>this.lblDesc.nativeElement;




    if (btn.text === 'MORE') {
      btn.text = 'LESS';
      changeHeight(wrapper, quad, 1000, this.descHeight, 60);
      //lbl.text = this.session.description;
    }
    else {
      btn.text = 'MORE';
      //lbl.text = this.session.descriptionShort;
      //scroll.scrollToVerticalOffset(0, false);
      changeHeight(wrapper, quad, 1000, 60, this.descHeight);
    }
  }

}


function changeHeight(view: View, delta: (p) => {}, duration?: number, to?: number, from?: number) {
  var from = from || 1;
  var to = to || 500;

  animate({
    delay: 5,
    duration: duration || 1000, // 1 sec by default
    delta: delta,
    step: function (delta) {
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

function quad(progress) {
  return Math.pow(progress, 2);
}