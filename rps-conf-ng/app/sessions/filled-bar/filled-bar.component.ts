// angular
import { Component, ViewChild, Input, ElementRef } from '@angular/core';

// nativescript
import { Label } from 'ui/label';

//app
import { SessionModel } from '../shared/session.model';


@Component({
    moduleId: module.id,
    selector: 'filled-bar',
    templateUrl: 'filled-bar.component.html',
    styleUrls: ['filled-bar.component.css']
})
export class FilledBarComponent {

    @Input() public session: SessionModel;
    @ViewChild('fillBar') public fillBarRef: ElementRef;

    public get fillBar(): Label {
        return this.fillBarRef.nativeElement;
    }

    public onLoaded(args, fillBar: Label) {
        let progressClass = this.getProgressClass(this.session.percentFull);
        if (fillBar.className.indexOf(progressClass) < 0) {
            fillBar.className = fillBar.className + ' ' + progressClass;
        }
    }

    private getProgressClass(percentFull: number) {
        if (percentFull >= 0 && percentFull <= 24) return 'level1';
        else if (percentFull >= 25 && percentFull <= 49) return 'level2';
        else if (percentFull >= 50 && percentFull <= 74) return 'level3';
        else if (percentFull >= 75 && percentFull <= 89) return 'level4';
        else if (percentFull >= 90 && percentFull <= 100) return 'level5';
    }
}
