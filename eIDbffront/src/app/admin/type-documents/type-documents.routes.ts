import { Route } from "@angular/router";
import { Page404Component } from "../../authentication/page404/page404.component";
import { AllTypeDocumentsComponent } from "./all-type-documents/all-type-documents.component";

export const TYPE_DOCUMENTS_ROUTE: Route[] = [
  {
    path: "all-type-documents",
    component: AllTypeDocumentsComponent,
  },
  { path: "**", component: Page404Component },
];
