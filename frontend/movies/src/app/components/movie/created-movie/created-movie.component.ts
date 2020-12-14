import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs'
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Category } from '../../../models/category.model'
import { Router, ActivatedRoute, Params } from "@angular/router";

const categoryQuery = gql`
  query {
    categories {
      id
      name
      color
      createdAt
    }
  }
`;
const createMovie = gql`
      mutation createMovie($poster: String!, $movieName: String!, $description:String!, $category:Int!)
      {
      createMovie(poster: $poster, movieName: $movieName, description: $description, category: $category)
      {
      movie{
      poster,
      movieName,
      description
      }
      }
      }`;




const movieQuery = gql`
query {
  allMovies {
  edges{
    node{
      id,
      pk,
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
  selector: 'app-created-movie',
  templateUrl: './created-movie.component.html',
  styleUrls: ['./created-movie.component.css']
})
export class CreatedMovieComponent implements OnInit {
  public nombre: string
  public descripcion: string
  public poster: string
  public categoria: string
  public idactualizar: string
  dataSource: any
  validarForm: FormGroup;
  nombreFormControl = new FormControl()
  descripcionFormControl = new FormControl()
  posterFormControl = new FormControl()
  categoriaFormControl = new FormControl()

  private querySubscription: Subscription | undefined;
  listCategory = new Array<Category>();
  selectCategory: string
  constructor(private apollo: Apollo, private formBuilder: FormBuilder,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.selectCategory = '',
      this.validarForm = this.formBuilder.group({
        nombre: this.nombreFormControl,
        descripcion: this.descripcionFormControl,
        poster: this.posterFormControl,
        categoria: this.categoriaFormControl
      }),
      this.nombre = ''
    this.descripcion = ''
    this.poster = ''
    this.categoria = ''
    this.dataSource = []
    this.idactualizar = ''
  }
  crear() {
    if (this.idactualizar === '0') {
      this.apollo
        .mutate({
          mutation: createMovie,
          variables: {
            movieName: this.nombreFormControl.value,
            description: this.descripcionFormControl.value,
            poster: this.posterFormControl.value,
            category: this.categoriaFormControl.value
          }
        })
        .subscribe(() => {
          this._router.navigate(['/movies'])
          window.open('/movies','_self')
        }
        );
    }
    else {
      const updateMovie = gql(`
      mutation updateMovie
      {
      updateMovie(id:"`+ this.idactualizar + `", poster:"` + this.posterFormControl.value + `" , movieName:"` + this.nombreFormControl.value + `" , description: "` + this.descripcionFormControl.value + `", category:  "` + this.categoriaFormControl.value + `" )
      {
        movie{
          id,
          poster,
          movieName,
          description,
          category{
            id,
            name,
            color
          }
        }
      }
    }
  `);
      this.apollo
        .mutate({
          mutation: updateMovie,
          variables: {
            id: this.nombreFormControl.value,
            description: this.descripcionFormControl.value,
            poster: this.posterFormControl.value,
            category: this.categoriaFormControl.value
          }
        })
        .subscribe(() => {
          this._router.navigate(['/movies'])
          window.open('/movies','_self')
        }
        );
    }




  }

  getMovie(id: string) {
    console.log(id)
    this.idactualizar = id
    this.querySubscription = this.apollo.watchQuery<any>({
      query: movieQuery
    })
      .valueChanges
      .subscribe((response) => {
        this.dataSource = response.data.allMovies.edges;
        this.dataSource.map((d: any) => {
          console.log(d)
          if (d.node.pk == id) {
            this.nombreFormControl.setValue(d.node.movieName)
            this.descripcionFormControl.setValue(d.node.description)
            this.posterFormControl.setValue(d.node.poster)
            this.categoriaFormControl.setValue(d.node.category.id)
            this.idactualizar = d.node.pk
          }
        })
      });
  }

  ngOnInit(): void {
    this._route.paramMap.subscribe((params) => {
      const id = params.get("id")!;
      this.getMovie(id)
    })


    this.querySubscription = this.apollo.watchQuery<any>({
      query: categoryQuery
    })
      .valueChanges
      .subscribe(({ data }) => {
        console.log(data.categories)
        this.listCategory = data.categories
      });




  }
}
