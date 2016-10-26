// angular
import { Component, ViewChild, ChangeDetectorRef, Inject, Input, Output, OnInit, EventEmitter, AfterViewInit, ElementRef } from '@angular/core';
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

//app
import { SessionsService } from '../../services/sessions.service';
import { SessionModel } from '../shared/session.model';


@Component({
    moduleId: module.id,
    selector: 'session-card',
    templateUrl: 'session-card.component.html',
    styleUrls: ['session-card.component.css']
})
export class SessionCardComponent implements OnInit {

    @Input() public session: SessionModel;
    @Output() notifyCardClosed: EventEmitter<void> = new EventEmitter<void>();

    constructor() {

    }

    public ngOnInit() {

    }

    public cardSwipe() {
        console.log('cardSwipe');
    }

    public cardClose() {
        this.notifyCardClosed.emit();
    }

}
var a = 0;