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
import { GridLayout } from 'ui/layouts/grid-layout';

//app
import { SessionsService } from '../../services/sessions.service';
import { SessionModel } from '../shared/session.model';


declare var UIView, CGAffineTransformMakeTranslation;

@Component({
  moduleId: module.id,
  selector: 'session-details',
  templateUrl: 'session-details.component.html',
  styleUrls: ['session-details.component.css']
})
export class SessionDetailsComponent implements OnInit {

  private _lblDescShortHeight: number;
  private _lblDescHeight: number;
  private _animationDurationSeconds: number = 0.3;

  public session: SessionModel;

  @ViewChild('btnDesc') btnDescRef: ElementRef;
  @ViewChild('lblDesc') lblDescRef: ElementRef;
  @ViewChild('lblDescShort') lblDescShortRef: ElementRef;
  @ViewChild('speakersContainer') speakersContainerRef: ElementRef;

  public get btnDesc(): Button {
    return this.btnDescRef.nativeElement;
  }

  public get lblDesc(): Label {
    return this.lblDescRef.nativeElement;
  }

  public get lblDescShort(): Label {
    return this.lblDescShortRef.nativeElement;
  }

  public get speakersContainer(): GridLayout {
    return this.speakersContainerRef.nativeElement;
  }

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

  public sessionWrapperLoaded() {
    //let speakersContainer = <GridLayout>this.speakersContainer.nativeElement;
    //let btnDesc = <Button>this.btnDesc.nativeElement;
    //let lblDesc = <Label>this.lblDesc.nativeElement;
    //let lblDescShort = <Label>this.lblDescShort.nativeElement;

    this._lblDescHeight = this.lblDesc.getMeasuredHeight()
    this._lblDescShortHeight = this.lblDescShort.getMeasuredHeight();

    this.speakersContainer.marginTop = this._lblDescShortHeight;
    this.lblDesc.opacity = 0;

    if (this.session.description.length === this.session.descriptionShort.length) {
      this.btnDesc.visibility = 'collapsed';
    }
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

  public toogleDescription() {

    let transY = this._lblDescHeight - this._lblDescShortHeight;

    if (this.btnDesc.text === 'MORE') {

      UIView.animateWithDurationAnimations(this._animationDurationSeconds, () => {
        this.speakersContainer.ios.transform = CGAffineTransformMakeTranslation(0, transY);
        this.lblDesc.ios.alpha = 1;
        this.lblDescShort.ios.alpha = 0;
      });

      this.speakersContainer.marginTop = this._lblDescHeight;
      this.btnDesc.text = 'LESS';
    }
    else {
      UIView.animateWithDurationAnimations(this._animationDurationSeconds, () => {
        this.speakersContainer.ios.transform = CGAffineTransformMakeTranslation(0, 0);
        this.lblDesc.ios.alpha = 0;
        this.lblDescShort.ios.alpha = 1;
      });

      this.speakersContainer.marginTop = this._lblDescShortHeight;
      this.btnDesc.text = 'MORE';
    }
  }

}
