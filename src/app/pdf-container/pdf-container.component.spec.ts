import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfContainerComponent } from './pdf-container.component';

describe('PdfContainerComponent', () => {
  let component: PdfContainerComponent;
  let fixture: ComponentFixture<PdfContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
