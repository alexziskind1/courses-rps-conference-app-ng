import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NgModule } from "@angular/core";

import { SIDEDRAWER_DIRECTIVES } from "nativescript-telerik-ui/sidedrawer/angular";

import { sessionsRouting } from "./sessions.routing";
import { SessionsComponent } from "./sessions.component";
import { SessionDetailsComponent } from "./session-details/session-details.component";
import { SessionMapComponent } from "./session-map/session-map.component";
import { SessionListComponent } from "./session-list/session-list.component";
import { SponsorsListComponent } from "./sponsors-list/sponsors-list.component";
import { FavStarComponent } from './fav-star/fav-star.component';
import { FilledBarComponent } from "./filled-bar/filled-bar.component";
import { SessionCardComponent } from "./session-card/session-card.component";


@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    sessionsRouting
  ],
  declarations: [
    SessionsComponent,
    SessionDetailsComponent,
    SessionMapComponent,
    SessionListComponent,
    SponsorsListComponent,
    FavStarComponent,
    FilledBarComponent,
    SessionCardComponent,
    SIDEDRAWER_DIRECTIVES
  ]
})
export class SessionsModule { }
