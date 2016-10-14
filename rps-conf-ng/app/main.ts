// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { NgModule  } from "@angular/core";
import { Location }                 from '@angular/common';
// nativescript
// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { NativeScriptModule, platformNativeScriptDynamic } from 'nativescript-angular/platform';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { NativeScriptRouterModule, RouterExtensions } from 'nativescript-angular/router';
import { SIDEDRAWER_DIRECTIVES } from "nativescript-telerik-ui/sidedrawer/angular";

// app
import {AppComponent} from './app.component';
import {HomeComponent} from './home.component';
import {StartComponent} from './start.component';
import {SomeOtherComponent} from './some-other.component';
import { DetailsComponent } from './details.component';
import { MapComponent } from './map.component';
import { SessionsService } from './services/sessions.service';
import { DrawerService } from './drawer.service';
// import other components, etc.
import {routes} from './app.routes';

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    NativeScriptRouterModule,
    NativeScriptRouterModule.forRoot(routes)
  ],
  declarations: [
    SIDEDRAWER_DIRECTIVES,
    AppComponent,
    HomeComponent,
    StartComponent,
    SomeOtherComponent,
    DetailsComponent,
    MapComponent
  ],
  bootstrap: [AppComponent],
  providers: [SessionsService, DrawerService,RouterExtensions]
})
export class AppModule { }

platformNativeScriptDynamic().bootstrapModule(AppModule);