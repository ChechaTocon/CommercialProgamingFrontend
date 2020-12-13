import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-review',
  templateUrl: './list-review.component.html',
  styleUrls: ['./list-review.component.css']
})
export class ListReviewComponent implements OnInit {
  public cargando:boolean = false

  constructor() { }

  ngOnInit(): void {
  }

  openDialog(id:number){
    console.log('myid:',id)
  }

}
