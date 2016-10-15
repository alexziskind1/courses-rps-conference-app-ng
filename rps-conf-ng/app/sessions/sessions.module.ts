import { NativeScriptModule } from "nativescript-angular/platform";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NgModule } from "@angular/core";

import { SIDEDRAWER_DIRECTIVES } from "nativescript-telerik-ui/sidedrawer/angular";

import { sessionsRouting } from "./sessions.routing";
import { SessionsComponent } from "./sessions.component";
import { SessionDetailsComponent } from "./session-details/session-details.component";
import { SessionMapComponent } from "./session-map/session-map.component";
//import { SessionsListComponent } from "./session-list/session-list.component";


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
    SIDEDRAWER_DIRECTIVES
  ]
})
export class SessionsModule {}
