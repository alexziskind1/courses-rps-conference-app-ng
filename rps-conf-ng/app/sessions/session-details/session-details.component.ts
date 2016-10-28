

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
import { ScrollView } from 'ui/scroll-view';
import { GridLayout } from 'ui/layouts/grid-layout';
import { StackLayout } from 'ui/layouts/stack-layout';
import { AnimationDefinition, Animation, CubicBezierAnimationCurve } from 'ui/animation';

import { SessionsService } from '../../services/sessions.service';
import { SessionModel } from '../shared/session.model';


declare var UIView, UIColor, CGSizeMake, CGPointMake, UIBlurEffect, UIBlurEffectStyle, UIVisualEffectView, UIBlurEffectStyleDark, UIBlurEffectStyleLight, UIViewAutoresizingFlexibleWidth, UIViewAnimationOptionLayoutSubviews, UIViewContentModeRedraw, CGAffineTransformIdentity, CGAffineTransformMakeTranslation, UIViewAutoresizingFlexibleHeight, CGRect, CGSize, CGRectMake, NSLineBreakByTruncatingTail;


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
  @ViewChild('descContainer') descContainer: ElementRef;


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
          this.session = session;

        });

    });
  }

  public sessionWrapperLoaded() {
    let speakersGrid = <GridLayout>this._page.getViewById('speakersContainer');
    let btn = <Button>this.btnDesc.nativeElement;

    speakersGrid.marginTop = this._initDescHeight;

    //speakersGrid.ios.center = CGPointMake(50, 200);

    let lbl1 = <Label>this.lblDesc1.nativeElement;
    lbl1.opacity = 0;

    if (this.session.description.length === this.session.descriptionShort.length) {
      btn.visibility = 'collapsed';
    }
  }

  public onDescriptionWrapperLoaded(lblDesc1: Label) {
    console.log('onDescriptionWrapperLoaded');


    //let lblDescHeight = lblDesc.getMeasuredHeight();
    let lblDesc1Height = lblDesc1.getMeasuredHeight();
    //this._lblHeightDiff = lblDesc1Height - lblDescHeight;

    //console.log('lblDesc height: ' + lblDescHeight);
    console.log('lblDesc1 height: ' + lblDesc1Height);

    //lblDesc1.visibility = "collapsed";
    //lblDesc1.opacity = 0;
    lblDesc1.ios.adjustsFontSizeToFitWidth = false;
    lblDesc1.ios.lineBreakMode = NSLineBreakByTruncatingTail;

    lblDesc1.height = 10;

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
  }


  private _lblHeightDiff: number = -1;


  private ensureLblHeightDiff(oldLabel: Label, session: SessionModel): number {
    if (this._lblHeightDiff >= 0)
      return this._lblHeightDiff;

    oldLabel.text = session.descriptionShort;
    var sizeMin = oldLabel.ios.sizeThatFits(oldLabel.ios.frame.size);
    oldLabel.text = session.description;
    var sizeMax = oldLabel.ios.sizeThatFits(oldLabel.ios.frame.size);
    this._lblHeightDiff = sizeMax.height - sizeMin.height;
    return this._lblHeightDiff;
  }

  private _initDescHeight = 72;
  private _nativeAnimDuration = 0.3;

  public toogleDescription() {
    let btn = <Button>this.btnDesc.nativeElement;
    let speakersGrid = <GridLayout>this._page.getViewById('speakersContainer');
    let lbl = <Label>this.lblDesc.nativeElement;
    let lbl1 = <Label>this.lblDesc1.nativeElement;

    let lblDesc1Height = lbl1.getMeasuredHeight();
    console.log('lblDesc1Height: ' + lblDesc1Height);
    var transX = 0;
    var transY = lblDesc1Height - this._initDescHeight;


    if (btn.text === 'MORE') {



      UIView.animateWithDurationDelayOptionsAnimationsCompletion(this._nativeAnimDuration,
        0,
        UIViewAnimationOptionLayoutSubviews,
        () => {
          speakersGrid.ios.transform = CGAffineTransformMakeTranslation(0, transY);
          lbl.ios.alpha = 0;
          lbl1.ios.alpha = 1;
        },
        () => {
          //lblScreen.translateY = 50;
        });


      speakersGrid.marginTop = lblDesc1Height;
      btn.text = 'LESS';

    } else {

      UIView.animateWithDurationAnimationsCompletion(this._nativeAnimDuration, () => {
        speakersGrid.ios.transform = CGAffineTransformMakeTranslation(0, 0);
        lbl.ios.alpha = 1;
        lbl1.ios.alpha = 0;
      },
        () => {


        });
      speakersGrid.marginTop = this._initDescHeight;
      btn.text = 'MORE';

    }

  }


  public toogleDescription_() {
    let btn = <Button>this.btnDesc.nativeElement;
    //let lbl = <Label>this.lblDesc.nativeElement;
    let lbl1 = <Label>this.lblDesc1.nativeElement;
    let speakersGrid = <GridLayout>this._page.getViewById('speakersContainer');
    let descContaner = <StackLayout>this.descContainer.nativeElement;

    //let lblHeightDiff = this.ensureLblHeightDiff(lbl, this.session);

    //console.log('height diff: ' + lblHeightDiff);
    //console.log('lbl height: ' + lbl.getMeasuredHeight());
    console.log('lbl1 height: ' + lbl1.getMeasuredHeight());

    if (btn.text === 'MORE') {
      btn.text = 'LESS';

      lbl1.ios.contentMode = UIViewContentModeRedraw;
      //let theCenter = lbl1.ios.center; //CGPoint
      //theCenter.y = theCenter.y + 55;
      //lbl1.ios.center = theCenter;

      UIView.animateWithDurationAnimations(2.0, () => {
        //let theFrame = descContaner.ios.frame;
        //theFrame.size.height += 50;
        //descContaner.ios.frame = theFrame;

        let theBounds = lbl1.ios.bounds; //CGRect
        let theCenter = lbl1.ios.center; //CGPoint
        theBounds.size = CGSizeMake(theBounds.size.width, theBounds.size.height + 100);

        theCenter.y = theCenter.y + 55;
        lbl1.ios.bounds = theBounds;
        lbl1.ios.center = theCenter;


      });



      /*
            let ad1: AnimationDefinition = {
              translate: { x: 0, y: lblHeightDiff },
              duration: 500,
              curve: 'spring' //new CubicBezierAnimationCurve(.17, .67, .83, .67)
            };
      
            speakersGrid.animate(ad1)
              .then(() => {
                //lbl.text = this.session.description;
      
                let adlbl1: AnimationDefinition = {
                  opacity: 0,
                  duration: 900,
                  delay: 250,
                  target: lbl
                };
      
                let adlbl2: AnimationDefinition = {
                  opacity: 1,
                  duration: 5000,
                  target: lbl1
                };
      
                lbl.visibility = 'collapsed';
                lbl1.visibility = 'visible';
                new Animation([adlbl1, adlbl2]).play();
              });
              */

      //let updatedHeight = 300.0;
      //let updatedFrame = CGRect(lbl.ios.frame.origin,
      //  CGSize(lbl.ios.frame.size.width, updatedHeight));
      //let updatedFrame = CGRectMake(lbl.ios.frame.origin.x, lbl.ios.frame.origin.y, lbl.ios.frame.size.width, updatedHeight);
      //let updatedFrame = CGRectMake(100, 200, lbl.ios.frame.size.width, updatedHeight);

      /*
            UIView.animateWithDurationAnimations(2.0, () => {
              lbl.ios.frame = updatedFrame;
              lbl.text = this.session.description;
            });
            */
    }
    else {
      btn.text = 'MORE';
      /*
      let ad2: AnimationDefinition = {
        translate: { x: 0, y: lblHeightDiff * -1 },
        duration: 500,
        curve: 'spring'//new CubicBezierAnimationCurve(.17, .67, .83, .67)
      };

      let adlbl3: AnimationDefinition = {
        opacity: 1,
        duration: 500,
        target: lbl
      };

      let adlbl4: AnimationDefinition = {
        opacity: 0,
        duration: 900,
        delay: 250,
        target: lbl1
      };

      lbl1.visibility = 'collapsed';
      lbl.visibility = 'visible';
      new Animation([adlbl3, adlbl4]).play()
        .then(() => {
          speakersGrid.animate(ad2);

        });
        */



      //lbl.text = this.session.descriptionShort;

      //scroll.scrollToVerticalOffset(100, true);
    }
  }

}
