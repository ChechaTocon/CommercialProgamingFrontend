import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Review, User, Movie, CreateReview } from '../../../models/review.model'

@Component({
  selector: 'app-item-review',
  templateUrl: './item-review.component.html',
  styleUrls: ['./item-review.component.css']
})
export class ItemReviewComponent implements OnInit {  
  @Input() dataFromParent:Review = new Review() 
  @Output() datoToParentEdit:EventEmitter<any> =  new EventEmitter()
  @Output() datoToParentDelete:EventEmitter<any> =  new EventEmitter()

  public arrayRatingGiven:Array<number> = [1,2,3,4,5]
  public arrayRatingNone:Array<number> = [1,2,3,4,5]

  constructor() {        
  }

  ngOnInit(): void {
  }

  myRating(stars:number = 1){
    this.arrayRatingGiven.length = stars
    return this.arrayRatingGiven
  }

  myNoneRating(stars:number = 1){   
    let nonestars =  5 - stars
    this.arrayRatingNone.length = nonestars
    return this.arrayRatingNone
  }

  delete(id:any){
    this.datoToParentDelete.emit(id)
  }

  edit(id:any){
    this.datoToParentEdit.emit(id)
  }

}
