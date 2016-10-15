import { ModuleWithProviders }  from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { SessionsComponent } from "./sessions.component";
import { DetailsComponent } from "../details.component";
import { MapComponent } from "../map.component";

const sessionsRoutes: Routes = [
  {
    path: "sessions/:id",
    component: SessionsComponent
  },
  {
    path: "details/:id",
    component: DetailsComponent
  },
  {
    path: "map/:id",
    component: MapComponent
  }
];
export const sessionsRouting: ModuleWithProviders = RouterModule.forChild(sessionsRoutes);