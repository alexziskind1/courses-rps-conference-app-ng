import { Injectable } from '@angular/core';
import { IRoomInfo } from '../shared/interfaces';
import * as imageSourceModule from 'image-source';



@Injectable()
export class RoomMapService {

    private _defaultImageSource = imageSourceModule.fromFile('~/images/rooms/conf-map.png');

    public getRoomImage(info: IRoomInfo) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this._defaultImageSource);
            }, 1000);
        });
    }
}

