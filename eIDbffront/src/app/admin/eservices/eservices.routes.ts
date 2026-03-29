import { Route } from "@angular/router";
import { Page404Component } from "../../authentication/page404/page404.component";
import { EserviceComponent } from "./all-eservices/all-eservices.component";
export const ESERVICES_ROUTE: Route[] = [
  {
    path: "all-eservices",
    component: EserviceComponent,
  },
 
  { path: "**", component: Page404Component },
];
