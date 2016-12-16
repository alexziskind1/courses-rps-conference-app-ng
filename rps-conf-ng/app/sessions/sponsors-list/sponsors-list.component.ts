import { Component, trigger, style, animate, state, transition } from '@angular/core';

import { slideInAnimations } from '../../shared';

@Component({
    moduleId: module.id,
    selector: 'sponsors-list',
    templateUrl: 'sponsors-list.component.html',
    animations: slideInAnimations
})
export class SponsorsListComponent {
    public currentState: string;

    constructor() {
        this.currentState = 'off';
    }

    public sponsorsWrapperLoaded() {
        this.currentState = 'on';
    }

    public getState() {
        return this.currentState;
    }
}