//angular
import { Component, Input } from '@angular/core';

//nativescript
import { Label } from 'ui/label';
import * as enums from 'ui/enums';

//app
import { SessionModel } from '../shared/session.model';
import { SessionsService } from '../../services/sessions.service';


@Component({
    moduleId: module.id,
    selector: 'fav-star',
    templateUrl: 'fav-star.component.html',
    styleUrls: ['fav-star.component.css']
})
export class FavStarComponent {
    @Input() public item: SessionModel;

    public isToggling = false;

    constructor(private _sessionsService: SessionsService) {

    }

    public toggleFavorite(session: SessionModel, lbl: Label) {
        if (this.isToggling) {
            return;
        }
        this.isToggling = true;

        this._sessionsService.toggleFavorite(session)
            .then(() => {
                //done toggling fovaorite
                this.toggleFavVisual(session, lbl)
                    .then(() => {
                        this.isToggling = false;
                    });
            });
    }

    private toggleFavVisual(session: SessionModel, lbl: Label) {
        return new Promise((resolve, reject) => {
            if (!session.favorite) {
                this.animateUnfavorite(lbl)
                    .then(() => {
                        resolve();
                    })
            } else {
                this.animateFavorite(lbl)
                    .then(() => {
                        resolve();
                    });
            }
        });
    }

    private animateFavorite(lbl: Label) {
        return new Promise((resolve, reject) => {
            var x = 0;
            var y = 0;
            var index = 1;

            var cancelId = setInterval(() => {
                this.setBackgroundPosition(lbl, x + ' ' + y);
                x = x - 50;
                index++;
                if (index == 30) {
                    clearInterval(cancelId);
                    resolve();
                }
            }, 20);
        });
    }

    private animateUnfavorite(lbl: Label) {
        return new Promise((resolve, reject) => {
            this.setBackgroundPosition(lbl, '0 0');

            lbl.animate({
                duration: 500,
                scale: { x: 1.5, y: 1.5 },
                curve: enums.AnimationCurve.easeIn
            }).then(() => {
                lbl.animate({
                    duration: 500,
                    scale: { x: 1.0, y: 1.0 },
                    curve: enums.AnimationCurve.easeOut
                }).then(() => {
                    resolve();
                });
            });

        });
    }

    private setBackgroundPosition(lbl: Label, positionStr: string) {
        lbl.style.backgroundPosition = positionStr;
    }
}