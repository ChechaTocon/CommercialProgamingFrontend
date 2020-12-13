import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedMovieComponent } from './created-movie.component';

describe('CreatedMovieComponent', () => {
  let component: CreatedMovieComponent;
  let fixture: ComponentFixture<CreatedMovieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatedMovieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatedMovieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
