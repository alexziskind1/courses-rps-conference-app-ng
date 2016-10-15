import { Injectable, ViewChild } from '@angular/core';

import {SideDrawerType} from 'nativescript-telerik-ui/sidedrawer/angular';
import {DrawerTransitionBase, SlideInOnTopTransition} from 'nativescript-telerik-ui/sidedrawer';


@Injectable()
export class DrawerService {
    private _drawerIsOpen: boolean = false;

//@ViewChild(RadSideDrawerComponent) public drawerComponent: RadSideDrawerComponent;
  private _sideDrawerTransition: DrawerTransitionBase;
  private _drawer: SideDrawerType;

    public get IsDrawerOpen() {
        return this._drawerIsOpen;
    }

    public set IsDrawerOpen(val: boolean) {
        this._drawerIsOpen = val;
    }

public initDrawer(drawer) {
    this._drawer = drawer;
}
    public toggleDrawerState() {
        this._drawerIsOpen = !this._drawerIsOpen;
        this._drawer.toggleDrawerState();
    }


    public get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }

    public set sideDrawerTransition(val) {
        this._sideDrawerTransition = val;
    }

    public closeDrawer() {
        this._drawer.closeDrawer();
    }

    public showDrawer() {
        this._drawer.showDrawer();
    }

}