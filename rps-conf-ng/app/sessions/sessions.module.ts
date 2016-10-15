import { NativeScriptModule } from "nativescript-angular/platform";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NgModule } from "@angular/core";

import { SIDEDRAWER_DIRECTIVES } from "nativescript-telerik-ui/sidedrawer/angular";

import { sessionsRouting } from "./sessions.routing";
import { SessionsComponent } from "./sessions.component";
import { DetailsComponent } from "../details.component";
import { MapComponent } from "../map.component";
//import { SessionsListComponent } from "./session-list/session-list.component";


@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    sessionsRouting
  ],
  declarations: [
    SessionsComponent,
    DetailsComponent,
    MapComponent,
    SIDEDRAWER_DIRECTIVES
  ]
})
export class SessionsModule {}
