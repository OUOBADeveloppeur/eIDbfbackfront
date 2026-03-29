import { Route } from "@angular/router";
import { Page404Component } from "app/authentication/page404/page404.component";
import { ApiComponent } from "./api.component";

export const API_ROUTE: Route[] = [
  {
    path: "all-api",
    component: ApiComponent,
  }
  ,
  { path: "**", component: Page404Component },
];