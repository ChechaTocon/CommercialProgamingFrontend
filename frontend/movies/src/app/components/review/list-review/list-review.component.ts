import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs'
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { AddReviewComponent } from '../add-review/add-review.component'
import { MatDialog } from "@angular/material/dialog";
import { Review, User, Movie, CreateReview, Dialog } from '../../../models/review.model'

const getReview = gql`
  query {
    reviews {
      id
      comment
      ranking
      createdAt
      updatedAt
      movie{
        id
        movieName
      }
      user{
        id
        username
      }
    }
  }
`;


const createReview = gql`
mutation createReview(
  $comment: String,
  $ranking: Int,
  $movie: String,
  $user: Int,
) {

  createReview(input: {
    comment: $comment,
    ranking: $ranking,
    movie: $movie,
    user: $user,
  }) {
    ok
    review {
      id
      comment
      ranking
      createdAt
      updatedAt
      movie {
        id
        movieName
      }
      user{
        id
        username
      }
    }
  }

}
`;

@Component({
  selector: 'app-list-review',
  templateUrl: './list-review.component.html',
  styleUrls: ['./list-review.component.css']
})
export class ListReviewComponent implements OnInit {
  public cargando:boolean = false
  dataSource: Review[] = [new Review()]  
  private querySubscription: Subscription | undefined;

  public baseDialog:Dialog | undefined

  public userId:number | undefined

  constructor(
    private apollo: Apollo,
    private _route:ActivatedRoute,
    private _router:Router,    
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.querySubscription = this.apollo.watchQuery<any>({
      query: getReview
    })
      .valueChanges
      .subscribe(({ data }) => {
        this.dataSource = data.reviews;
        console.log(this.dataSource)
        let datuser:any
        datuser = localStorage.getItem("userLogged");
        datuser = JSON.parse(datuser)
        this.userId = datuser.id
        console.log('data user:',  datuser)
      });
  }

  newReview() {
    this.apollo.mutate({
      mutation: createReview,
      variables: {
        comment: 'Es entretenida solo la primera vez, pero no tanto como para verla otra vez',
        ranking: 4,
        movie: 'TW92aWVOb2RlOjE=',
        user: this.userId,
      }
    }).subscribe(data => { 
      let created:any
      created = data
      let mynewreview:Review
      mynewreview = created.data.createReview.review
      console.log('Se creo la review!', mynewreview);      
      this.dataSource = [...this.dataSource, mynewreview] 
    });
  }  

}
