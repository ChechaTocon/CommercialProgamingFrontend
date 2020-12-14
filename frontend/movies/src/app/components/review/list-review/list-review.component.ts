import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs'
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { AddReviewComponent } from '../add-review/add-review.component'
import { MatDialog } from "@angular/material/dialog";
import { Review, User, CreateReview, Dialog } from '../../../models/review.model'
import { Movie } from '../../../models/movie.model'

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
        pk       
        movieName
        description
        poster
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
  $movie: Int,
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

const categoryQuery = gql`
query {
  allMovies {
  edges{
    node{
      id,
      pk,
      poster,
      movieName,
      description,     
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
  dataSourceActual: Review[] = []
  public querySubscription: Subscription | undefined;

  public baseDialog:Dialog | undefined

  public ratingSelected:number = 0
  public commentAdd:string = ''
  public reviewSelected:number = 0

  public editing:number = 0
  public loading:boolean = true
  public currentMovie:number = 0
  public userId:number | undefined

  public descriptionMovie:string = ''
  public posterMovie:string = ''
  public movieNameMovie:string = ''

  //public querySubscription: QueryRef<any> | undefined;

  constructor(
    private apollo: Apollo,
    private _route:ActivatedRoute,
    private _router:Router,    
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this._route.paramMap.subscribe(params => {
      let theid:any
      theid = params.get('id')?.toString();
      this.currentMovie = parseInt(theid)

      let datuser:any
      datuser = localStorage.getItem("userLogged");
      datuser = JSON.parse(datuser)
      if(datuser != null){
        this.userId = datuser.id
      }
      
      this.getMovieData()
      this.reloadData()

    });    
  }

  getMovieData(){
    this.querySubscription = this.apollo.watchQuery<any>({
      query: categoryQuery,
      fetchPolicy: 'network-only'
    })
      .valueChanges
      .subscribe((response: any) => {
        let mymovies:Movie[]
        mymovies = response.data.allMovies.edges;
        
        mymovies.map( j => {                
          if(j.node.pk == this.currentMovie){
            this.movieNameMovie = j.node.movieName
            this.posterMovie = j.node.poster
            this.descriptionMovie = j.node.description
          }
        })              
      });
  }

  reloadData(){
    this.querySubscription = this.apollo.watchQuery<any>({
      query: getReview,
      fetchPolicy: 'network-only'
    })
      .valueChanges
      .subscribe(({ data }) => {
        this.dataSource = []
        this.dataSourceActual = []
        this.dataSource = data.reviews;          

        this.dataSource.map( j => {
          let movieid:any
          movieid = j.movie?.pk          
          if(movieid == this.currentMovie){
            let mydata:any
            mydata = j            
            this.dataSourceActual = [...this.dataSourceActual, mydata]
          }
        })     
        
        console.log('refresh all:',this.dataSource)
        console.log('refresh filter:',this.dataSourceActual)

        this.loading = false
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
        
        this.reloadData()      
  
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
                movie: `+ this.currentMovie +`,
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
                    
          this.reloadData()
    
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

  removeReview() {          
      const reviewToDelete = gql(`
          mutation deleteReview {
            deleteReview(id: `+ this.reviewSelected +`){
              ok
            }
          }
        `);

        this.apollo.mutate({
          mutation: reviewToDelete
        }).subscribe((data) => {          
                              
          this.reloadData()
    
          this.editing = 0
          this.ratingSelected = 0
          this.commentAdd = ''
          this.reviewSelected = 0
        });      
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

      this.dataSourceActual.map( j => {
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
      this.removeReview()      
    }
  }

  cancelEdit(){
    this.editing = 0
    this.commentAdd = ''
    this.ratingSelected = 0    
  }

}
