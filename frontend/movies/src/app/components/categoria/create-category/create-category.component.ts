import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Category } from '../../../models/category.model'

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css']
})
export class CreateCategoryComponent implements OnInit {
  name: string = ''
  color: any
  idCategory: any
  category: Category | undefined
  title: string = ''

  //ColorPicker 
  disabled: boolean = false
  touchUi: boolean = false

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private apollo: Apollo,
  ) { }

  ngOnInit(): void {
    this._route.paramMap.subscribe(params => {
      this.idCategory = Number(params.get('id'))
      console.log(this.idCategory)
    });
    if (this.idCategory == 0) {
      this.title = "Crear categoría"
    }
    else {
      this.title = "Modificar categoría"
    }
  }

}
