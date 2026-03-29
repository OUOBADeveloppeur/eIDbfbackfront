import { Route } from "@angular/router";
import { AddHolidayComponent } from "./add-holiday/add-holiday.component";
import { EditHolidayComponent } from "./edit-holiday/edit-holiday.component";
import { Page404Component } from "../../authentication/page404/page404.component";
import { AllHolidayComponent } from "./all-autorites/all-holidays.component";
export const HOLIDAY_ROUTE: Route[] = [
  {
    path: "all-autorites",
    component: AllHolidayComponent,
  },
  {
    path: "add-holiday",
    component: AddHolidayComponent,
  },
  {
    path: "edit-holiday",
    component: EditHolidayComponent,
  },
  { path: "**", component: Page404Component },
];
