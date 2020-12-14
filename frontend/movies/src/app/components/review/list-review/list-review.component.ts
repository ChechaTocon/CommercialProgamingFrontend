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

const updateReview = gql`
mutation updateReview(
  $comment: String,
  $ranking: Int,
  $movie: Int,
  $user: Int,
  $reviewid: Int,
) {

  updateReview(id: $reviewid, input: {
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

  public ratingSelected:number = 0
  public commentAdd:string = ''
  public reviewSelected:number = 0

  public editing:number = 0
  public loading:boolean = true
  public currentMovie:string = 'TW92aWVOb2RlOjE='
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
      });
  }

  newReview() {
    console.log('el comentario', this.commentAdd)
    if(this.commentAdd.length > 1){
      this.apollo.mutate({
        mutation: createReview,
        variables: {
          comment: this.commentAdd,
          ranking: this.ratingSelected,
          movie: this.currentMovie,
          user: this.userId,
        }
      }).subscribe(data => { 
        let created:any
        created = data
        let mynewreview:Review
        mynewreview = created.data.createReview.review
            
        this.dataSource = [...this.dataSource, mynewreview]
  
        this.editing = 0
        this.ratingSelected = 0
        this.commentAdd = ''
      });
    }
    else{
      console.log('No puede dejar en blanco create')
    }    
  }
  
  modifyReview() {
    console.log('el comentario', this.commentAdd)
  
    if(this.commentAdd.length > 1){
      const reviewToUpdate = gql(`
            mutation updateReview {
              updateReview(id: `+ this.reviewSelected +`, input: {
                comment: "`+ this.commentAdd +`",
                ranking: `+ this.ratingSelected +`,
                movie: "`+ this.currentMovie +`",
                user: `+ this.userId +`,
              }) {
                ok
                review {
                  id
                  comment
                  ranking
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
        `);

        this.apollo.mutate({
          mutation: reviewToUpdate
        }).subscribe((data) => {          
          let created:any
          created = data
          let mynewreview:Review
          mynewreview = created.data.updateReview.review
          console.log('review updated madafaka:',created)
    
          this.editing = 0
          this.ratingSelected = 0
          this.commentAdd = ''
          this.reviewSelected = 0
        });
    }
    else{
      console.log('No puede dejar en blanco edit')
    }  
  }

  addRating(){
    if(this.ratingSelected < 5){
      this.ratingSelected = this.ratingSelected + 1
    }
  }

  removeRating(){
    if(this.ratingSelected > 0){
      this.ratingSelected = this.ratingSelected - 1
    }
  }

  editReview(id:Event){
    const myid = id    
    if(myid){
      this.reviewSelected = parseInt(myid.toString())
      this.editing = 1

      this.dataSource.map( j => {
        if(j.id?.toString() == this.reviewSelected.toString()){          
          this.commentAdd = j.comment
          this.ratingSelected = j.ranking          
        }
      })
      console.log('editing:', this.reviewSelected)
    }
  }

  deleteReview(id:Event){
    const myid = id
    if(myid){
      this.reviewSelected = parseInt(myid.toString())
      console.log('deleting:', this.reviewSelected)
    }
  }

  cancelEdit(){
    this.editing = 0
    this.commentAdd = ''
    this.ratingSelected = 0    
  }

}
