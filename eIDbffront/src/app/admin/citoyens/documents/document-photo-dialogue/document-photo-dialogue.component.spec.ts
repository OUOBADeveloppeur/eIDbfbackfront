import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentPhotoDialogueComponent } from './document-photo-dialogue.component';

describe('DocumentPhotoDialogueComponent', () => {
  let component: DocumentPhotoDialogueComponent;
  let fixture: ComponentFixture<DocumentPhotoDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentPhotoDialogueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentPhotoDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
