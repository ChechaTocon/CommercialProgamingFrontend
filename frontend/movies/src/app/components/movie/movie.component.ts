import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs'
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Movie } from '../../models/movie.model'

const categoryQuery = gql`
query {
  allMovies {
  edges{
    node{
      id,
      poster,
      movieName,
      description,
      category{
        id,
        name,
        color,
        createdAt,
        updatedAt
      },
      createdAt,
      updatedAt
    }
    }
  }
  }
`;
@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {

  dataSource:any
  private querySubscription: Subscription | undefined;

  constructor(
    private apollo:Apollo
  ) {
         this.dataSource = []
  }

  ngOnInit(): void {
    this.querySubscription = this.apollo.watchQuery<any>({
      query: categoryQuery
    })
      .valueChanges
      .subscribe(( response:any ) => {
        this.dataSource = response.data.allMovies.edges;
        console.log(this.dataSource)
      });
  }

}
