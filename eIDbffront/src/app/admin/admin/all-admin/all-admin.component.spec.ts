import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { AllAdminComponent } from './all-admin.component';

describe("AllAdminComponent", () => {
  let component: AllAdminComponent;
  let fixture: ComponentFixture<AllAdminComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [AllAdminComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AllAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});