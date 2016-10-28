// angular
import { Component, ViewChild, ChangeDetectorRef, Inject, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';

// nativescript
import { RouterExtensions } from 'nativescript-angular/router';
import { GestureEventData, SwipeGestureEventData, PinchGestureEventData, PanGestureEventData, TouchGestureEventData, SwipeDirection } from 'ui/gestures';
import { Page } from "ui/page";
import { View, Point, Size } from "ui/core/view";
import { ImageSource } from 'image-source';
import { AnimationDefinition } from 'ui/animation';
import { Layout } from 'ui/layouts/layout';
import * as platformModule from 'platform';

//app
import { IRoomInfo } from '../../shared/interfaces';
import { SessionsService } from '../../services/sessions.service';
import { RoomMapService } from '../../services/room-map.service';
import { SessionModel } from '../shared/session.model';

let states = ["unknown", "start", "change", "end"];

@Component({
  moduleId: module.id,
  selector: 'session-map',
  templateUrl: 'session-map.component.html',
  styleUrls: ['session-map.component.css']
})
export class SessionMapComponent implements OnInit {

  private startScale: number = 1;
  private prevDeltaX: number;
  private prevDeltaY: number;

  public room: IRoomInfo;

  private tempRoomLocPoint: Point = { x: 3505, y: 4473 };

  public isLoading: boolean = false;
  public image: Observable<ImageSource>;

  @ViewChild('imageWrapper') imageWrapperRef: ElementRef;
  @ViewChild('imgMap') imgMapRef: ElementRef;
  @ViewChild('imgPin') imgPinRef: ElementRef;

  public get imgMap(): View {
    return this.imgMapRef.nativeElement;
  }

  public get imgPin(): View {
    return this.imgPinRef.nativeElement;
  }

  public get imageWrapper(): Layout {
    return this.imageWrapperRef.nativeElement;
  }

  constructor(private _page: Page, private _sessionsService: SessionsService, private _roomMapService: RoomMapService, private route: ActivatedRoute,
    private routerExtensions: RouterExtensions) {
    this._page.actionBarHidden = true;
    this._page.backgroundSpanUnderStatusBar = true;

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


  public onImageWrapperLoaded() {
    let imgWrapperSize: Size = { width: this.imageWrapper.getMeasuredWidth(), height: this.imageWrapper.getMeasuredHeight() };
    let imgSize: Size = { width: this.imgMap.getMeasuredWidth(), height: this.imgMap.getMeasuredHeight() };
    let pinImgSize: Size = { width: this.imgPin.getMeasuredWidth(), height: this.imgPin.getMeasuredHeight() };

    let widthScale = imgSize.width / imgWrapperSize.width;
    let heightScale = imgSize.height / imgWrapperSize.height;
    let largerScale = widthScale > heightScale ? widthScale : heightScale;

    this.imgMap.translateX = imgSize.width / -2;
    this.imgMap.translateY = imgSize.height / -2;

    this.imgPin.scaleX = 3;
    this.imgPin.scaleY = 3;
    this.imgPin.translateX = pinImgSize.width / -3;
    this.imgPin.translateY = pinImgSize.height / -2 + pinImgSize.height * 3 / 4;

    this.imgMap.animate({
      translate: { x: imgSize.width / -2 + imgWrapperSize.width / 2, y: imgSize.height / -2 + imgWrapperSize.height / 2 },
      scale: { x: largerScale / 100, y: largerScale / 100 },
      duration: 1000,
      curve: 'easeInOut'
    })
      .then(() => {
        let imageSizeScaled: Size = { width: imgSize.width / largerScale, height: imgSize.height / largerScale };

        let calcPinLoc = this.calculatePinImageLocation(this.tempRoomLocPoint, imgSize, imageSizeScaled, largerScale);

        this.imgPin.animate({
          translate: { x: pinImgSize.width / -2 + imgWrapperSize.width / 2, y: pinImgSize.height / -2 + imgWrapperSize.height / 2 },
          scale: { x: largerScale / 100, y: largerScale / 100 },
          opacity: 1,
          duration: 1000,
          curve: 'easeOut'
        })
          .then(() => {

          });
      });
  }

  private calculatePinImageLocation(roomLocFullPoint: Point, mapFullSize: Size, pinImgSize: Size, scale: number): Point {
    console.log('tScale: ' + scale);
    let newX = roomLocFullPoint.x / scale;
    let newY = roomLocFullPoint.y / scale;
    let roomScaledPoint: Point = { x: newX, y: newY };
    console.dir(roomScaledPoint);

    let pinImageWidthSpecifiedInMarkup = pinImgSize.width;
    let pinImageLocPoint: Point = { x: roomScaledPoint.x - (pinImageWidthSpecifiedInMarkup / 2), y: roomScaledPoint.y - pinImageWidthSpecifiedInMarkup };

    return pinImageLocPoint;
  }


  public backSwipe(args: SwipeGestureEventData) {
    if (args.direction === SwipeDirection.right) {
      this.routerExtensions.backToPreviousPage();
    }
  }

  public backTap() {
    this.routerExtensions.backToPreviousPage();
  }

  public onPan(args: PanGestureEventData) {
    console.log("PAN[" + states[args.state] + "] deltaX: " + Math.round(args.deltaX) + " deltaY: " + Math.round(args.deltaY));

    if (args.state === 1) {
      this.prevDeltaX = 0;
      this.prevDeltaY = 0;
      if (!this.imageWrapper.translateX) {
        this.imageWrapper.translateX = 0;
      }
      if (!this.imageWrapper.translateY) {
        this.imageWrapper.translateY = 0;
      }
    }
    else if (args.state === 2) {
      this.imageWrapper.translateX = this.imageWrapper.translateX + args.deltaX - this.prevDeltaX;
      this.imageWrapper.translateY = this.imageWrapper.translateY + args.deltaY - this.prevDeltaY;

      this.prevDeltaX = args.deltaX;
      this.prevDeltaY = args.deltaY;

      console.log('tx: ' + this.imageWrapper.translateX);
    }
  }

  public onPinch(args: PinchGestureEventData) {
    if (args.state === 1) {
      console.log('state: ' + args.state);
      const newOriginX = args.getFocusX() - this.imageWrapper.translateX;
      const newOriginY = args.getFocusY() - this.imageWrapper.translateY;

      const oldOriginX = this.imageWrapper.originX * this.imageWrapper.getMeasuredWidth();
      const oldOriginY = this.imageWrapper.originY * this.imageWrapper.getMeasuredHeight();

      this.imageWrapper.translateX += (oldOriginX - newOriginX) * (1 - this.imageWrapper.scaleX);
      this.imageWrapper.translateY += (oldOriginY - newOriginY) * (1 - this.imageWrapper.scaleY);

      this.imageWrapper.originX = newOriginX / this.imageWrapper.getMeasuredWidth();
      this.imageWrapper.originY = newOriginY / this.imageWrapper.getMeasuredHeight();

      if (this.imageWrapper.scaleX) {
        this.startScale = this.imageWrapper.scaleX;
      } else {
        this.imageWrapper.scaleX = 1;
      }
    }

    else if (args.scale && args.scale !== 1) {
      let newScale = this.startScale * args.scale;
      newScale = Math.min(8, newScale);
      newScale = Math.max(0.125, newScale);

      this.imageWrapper.scaleX = newScale;
      this.imageWrapper.scaleY = newScale;
    }
  }


  public onDoubleTap(args: TouchGestureEventData) {
    console.log("DOUBLETAP:");
    console.dir(args);

    var tx: number = 0;
    var ty: number = 0;

    if (platformModule.isIOS) {
      let locInView = args.ios.locationInView(this.imageWrapper.ios);

      if (locInView) {
        tx = locInView.x;
        ty = locInView.y;
      }
    }

    if (this.imageWrapper.scaleX === 1) {
      this.imageWrapper.animate({
        translate: { x: tx * -1, y: ty * -1 },
        scale: { x: 2, y: 2 },
        curve: "easeOut",
        duration: 300
      }).then(function () {

      });

    } else {
      this.imageWrapper.animate({
        translate: { x: 0, y: 0 },
        scale: { x: 1, y: 1 },
        curve: "easeOut",
        duration: 300
      }).then(function () {

      });
    }
  }

  private getFullScaleAnimation() {
    let def: AnimationDefinition = {

    };
    return def;
  }
}
var a = 0;