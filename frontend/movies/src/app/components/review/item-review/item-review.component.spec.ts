import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemReviewComponent } from './item-review.component';

describe('ItemReviewComponent', () => {
  let component: ItemReviewComponent;
  let fixture: ComponentFixture<ItemReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemReviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
