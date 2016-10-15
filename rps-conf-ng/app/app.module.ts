import { NativeScriptModule } from "nativescript-angular/platform";
import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";


import { routes } from "./app.routing";
import { AppComponent } from "./app.component";
import { setStatusBarColors } from "./shared";

import { SessionsService } from './services/sessions.service';
import { DrawerService } from './services/drawer.service';
import { SessionsModule } from "./sessions/sessions.module";

setStatusBarColors();

@NgModule({
  providers: [
    SessionsService,
    DrawerService
  ],
  imports: [
    NativeScriptModule,
    NativeScriptRouterModule,
    NativeScriptRouterModule.forRoot(routes),
    SessionsModule,
  ],
  declarations: [
      AppComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
