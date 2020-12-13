import { Component, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { Subscription } from 'rxjs'
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Category } from '../../models/category.model'

const categoryQuery = gql`
  query {
    category {
      id
      name
      color
      createdAt
    }
  }
`;

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {
  dataSource: Category[] = []
  private querySubscription: Subscription | undefined;
  displayedColumns: string[] = ['name', 'options'];

  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    this.querySubscription = this.apollo.watchQuery<any>({
      query: categoryQuery
    })
      .valueChanges
      .subscribe(({ data }) => {
        this.dataSource = data.category;
      });
  }

}
