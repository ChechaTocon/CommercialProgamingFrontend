import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Category } from '../../../models/category.model'
import gql from 'graphql-tag';
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css']
})
export class CreateCategoryComponent implements OnInit {
  loading: boolean = true
  color: any
  name: string | undefined
  fontColor: any = 'white'
  idCategory: any
  category: Category
  title: string = ''
  buttonName: string = ''
  private querySubscription: Subscription | any;
  //ColorPicker 
  disabled: boolean = false
  touchUi: boolean = false
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private apollo: Apollo,
  ) {
    this.category = new Category()
  }


  clickButton() {
    console.log(this.color)
    //this.category.color = this.color.hex
    let sendCategory
    if (this.idCategory == 0) {
      sendCategory = gql(`
        mutation {
          createCategory(input: {
            name: "`+ this.name + `",
            color:"#`+ this.color.hex + `"
          }) {
            ok
            category {
              id
              name
              color
            }
          }
        } 
        `);
    } else {
      sendCategory = gql(`  
        mutation {
          updateCategory(id:`+ this.idCategory + `,input: {
            name: "`+ this.name + `",
            color:"#`+ this.color.hex + `"
          }) {
            ok
            category {
              id
              name
              color
            }
          }
        }    
        `);
    }
    console.log(sendCategory)
    this.apollo.mutate({
      mutation: sendCategory
    }).subscribe(() => {
      this._router.navigate(['/category'])
    });
  }

  onChangeColor() {
    if (Number(this.color.hex[0]) <= 7)
      this.fontColor = 'white'
    else
      this.fontColor = 'black'
  }



  ngOnInit(): void {
    this._route.paramMap.subscribe(params => {
      this.idCategory = Number(params.get('id'))
    });
    if (this.idCategory == 0) {
      this.title = "Crear categoría"
      this.buttonName = "Agregar"
      this.category.name = ""
      this.color = ''
      this.loading = false
    }
    else {
      this.title = "Modificar categoría"
      this.buttonName = "Modificar"
      const getCategory = gql(`
        query {
          category(id:`+ this.idCategory + `) {
            id
            name
            color
            createdAt
          }
        }
      `);
      this.querySubscription = this.apollo.watchQuery<any>({
        query: getCategory
      })
        .valueChanges
        .subscribe(({ data }) => {
          this.category = data.category;
          this.color = this.category.color
          this.name = this.category.name
          this.loading = false
        });
    }
  }

}
