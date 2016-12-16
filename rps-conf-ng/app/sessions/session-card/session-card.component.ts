// angular
import { Component, Input, Output, EventEmitter } from '@angular/core';


//nativescript
import { StackLayout } from 'ui/layouts/stack-layout';
import * as platform from 'platform';

//app
import { SessionModel } from '../shared/session.model';

@Component({
    moduleId: module.id,
    selector: 'session-card',
    templateUrl: 'session-card.component.html',
    styleUrls: ['session-card.component.css']
})
export class SessionCardComponent {

    @Input() public session: SessionModel;
    @Output() notifyCardClosed: EventEmitter<void> = new EventEmitter<void>();

    public cardSwipe() {
        //close card - an exercise for you!
    }

    public cardClose() {
        this.notifyCardClosed.emit();
    }

    public cardLoaded(sessionCard: StackLayout) {
        if (platform.isIOS) {
            let nativeIosView = sessionCard.ios;
            nativeIosView.layer.masksToBounds = false;
            nativeIosView.layer.shadowRadius = 10;
            nativeIosView.layer.shadowOpacity = 0.5;
        }
    }
}
