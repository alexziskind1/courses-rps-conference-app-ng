import { NativeScriptModule } from "nativescript-angular/platform";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NgModule } from "@angular/core";

import { SIDEDRAWER_DIRECTIVES } from "nativescript-telerik-ui/sidedrawer/angular";

import { sessionsRouting } from "./sessions.routing";
import { SessionsComponent } from "./sessions.component";
import { SessionDetailsComponent } from "./session-details/session-details.component";
import { SessionMapComponent } from "./session-map/session-map.component";
import { SessionListComponent } from "./session-list/session-list.component";
import { SponsorsListComponent } from "./sponsors-list/sponsors-list.component";
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
    SessionCardComponent,
    SIDEDRAWER_DIRECTIVES
  ]
})
export class SessionsModule { }
