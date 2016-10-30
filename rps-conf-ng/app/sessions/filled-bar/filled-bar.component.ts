// angular
import { Component, ViewChild, Input, ChangeDetectorRef, Inject, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, Params } from '@angular/router';
import { Location } from '@angular/common';

// nativescript
import { RadSideDrawerComponent, SideDrawerType } from 'nativescript-telerik-ui/sidedrawer/angular';
import { DrawerTransitionBase, SlideInOnTopTransition } from 'nativescript-telerik-ui/sidedrawer';
import { NativeScriptRouterModule, RouterExtensions } from 'nativescript-angular/router';
import { GestureEventData, SwipeGestureEventData, SwipeDirection } from 'ui/gestures';
import { Animation, AnimationDefinition } from "ui/animation";
import { Color } from 'color';
import { Page } from "ui/page";
import { Button } from 'ui/button';
import { Label } from 'ui/label';

//app
import { SessionsService } from '../../services/sessions.service';
import { SessionModel } from '../shared/session.model';


@Component({
    moduleId: module.id,
    selector: 'filled-bar',
    templateUrl: 'filled-bar.component.html',
    styleUrls: ['filled-bar.component.css']
})
export class FilledBarComponent implements OnInit {

    @Input() public session: SessionModel;
    @ViewChild('fillBar') public fillBarRef: ElementRef;

    public get fillBar(): Label {
        return this.fillBarRef.nativeElement;
    }

    constructor() {

    }

    public ngOnInit() {

    }

    public onLoaded(args, fillBar: Label) {
        let progressClass = this.getProgressClass(this.session.percentFull);

        if (fillBar.className.indexOf(progressClass) < 0) {
            fillBar.className = fillBar.className + ' ' + progressClass;
        }


        /*
        let progressColor = this.getProgressColor(this.session.percentFull);

        let def: AnimationDefinition = {
            backgroundColor: new Color(progressColor),
            duration: 2000
        };

        fillBar.animate(def);
        */
    }

    /*
        private getProgressColor(progress: number) {
            if (progress >= 0 && progress <= 24) return '#3a8d24';
            else if (progress >= 25 && progress <= 49) return '#659a1f';
            else if (progress >= 50 && progress <= 74) return '#997815';
            else if (progress >= 75 && progress <= 89) return '#87581c';
            else if (progress >= 90 && progress <= 100) return '#a41818';
        }
        */

    private getProgressClass(progress: number) {
        if (progress >= 0 && progress <= 24) return 'level1';
        else if (progress >= 25 && progress <= 49) return 'level2';
        else if (progress >= 50 && progress <= 74) return 'level3';
        else if (progress >= 75 && progress <= 89) return 'level4';
        else if (progress >= 90 && progress <= 100) return 'level5';
    }


}
