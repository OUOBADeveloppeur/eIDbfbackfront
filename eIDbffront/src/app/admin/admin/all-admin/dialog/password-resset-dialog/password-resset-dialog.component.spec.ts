import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordRessetDialogComponent } from './password-resset-dialog.component';

describe('PasswordRessetDialogComponent', () => {
  let component: PasswordRessetDialogComponent;
  let fixture: ComponentFixture<PasswordRessetDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordRessetDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordRessetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
