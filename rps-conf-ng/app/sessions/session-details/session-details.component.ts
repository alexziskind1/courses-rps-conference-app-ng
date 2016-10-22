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
import { GridLayout } from 'ui/layouts/grid-layout';
import { AbsoluteLayout } from 'ui/layouts/absolute-layout';
import { Button } from 'ui/button';
import { Label } from 'ui/label';
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

  public toggleFavorite(args: GestureEventData) {
    console.log('toggleFavorite');
    let grid = <GridLayout>args.view;
    let abs = <AbsoluteLayout>grid.getChildAt(0);
    let lbl = <Label>abs.getChildAt(0);

    this._sessionsService.toggleFavorite(this.session)
      .then(() => {
        console.log('done toggling fav from details');
        if (this.session.favorite) {
          this.animateStar(lbl);
        } else {
          this.animateUnfavorite(lbl);
        }
      });
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

  private animateStar(lbl: Label) {
    console.log('animateStar');
    var x = 0;
    var y = 0;
    var index = 1;

    var cancel = setInterval(() => {

      this.setBackgroundPosition(lbl, x + ' ' + y);
      x = x - 50;
      index++;
      if (index == 30) {
        clearInterval(cancel);
      }
    }, 20);
  }

  private animateUnfavorite(lbl: Label) {
    this.setBackgroundPosition(lbl, '0 0');
  }

  private setBackgroundPosition(view: View, posish: string) {
    view.style.backgroundPosition = posish;
  }

}
