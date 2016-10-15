import { ModuleWithProviders }  from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { SessionsComponent } from "./sessions.component";
import { SessionDetailsComponent } from "./session-details/session-details.component";
import { SessionMapComponent } from "./session-map/session-map.component";

const sessionsRoutes: Routes = [
  {
    path: "sessions/:id",
    component: SessionsComponent
  },
  {
    path: "session-details/:id",
    component: SessionDetailsComponent
  },
  {
    path: "session-map/:id",
    component: SessionMapComponent
  }
];
export const sessionsRouting: ModuleWithProviders = RouterModule.forChild(sessionsRoutes);