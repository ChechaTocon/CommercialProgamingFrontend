import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs'
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Movie } from '../../models/movie.model'
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Category } from '../../models/category.model'
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
const categoriesQuery = gql`
 query {
  categories {
    id
    name
    color
    createdAt
  }
}
`;
@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {
  loading: boolean = true
  dataSource: Movie[] = []
  dataSourceTemp: Movie[] = []
  categories: Category[] = []
  private querySubscription: Subscription | undefined;

  constructor(
    private apollo: Apollo,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.dataSource = []
  }

  catogoryFilter(categoryId: number | undefined) {
    if (categoryId == 0)
      this.dataSource = this.dataSourceTemp
    else {
      this.dataSource = this.dataSourceTemp.filter(x => {
        if (x.node.category.id == categoryId) {
          return x
        }
        else {
          return
        }
      })
    }

  }

  agregar() {
    this._router.navigate(['movies/create/0'])
  }
  actualizar(id: number) {
    //la ruta de resena
    this._router.navigate(['movies/create/' + id])
  }
  ngOnInit(): void {
    this.querySubscription = this.apollo.watchQuery<any>({
      query: categoryQuery
    })
      .valueChanges
      .subscribe((response: any) => {
        this.dataSource = response.data.allMovies.edges;
        this.dataSourceTemp = this.dataSource
        console.log(this.dataSource)
      });

    this.querySubscription = this.apollo.watchQuery<any>({
      query: categoriesQuery
    })
      .valueChanges
      .subscribe(({ data }) => {
        this.categories = data.categories;
        this.loading = false
      });
  }

}
