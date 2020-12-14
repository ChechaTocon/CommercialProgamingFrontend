import { Route } from '@angular/compiler/src/core';
import { Component, OnInit, DoCheck } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { from } from 'rxjs';
import { Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { User } from 'src/app/models/user.model';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';

const USER_REGISTER = gql`
  mutation CreateUser(
    $username: String!
    $password: String!
    $firstName: String!
    $lastName: String!
  ) {
    createUser(
      username: $username
      password: $password
      firstName: $firstName
      lastName: $lastName
    ) {
      user {
        id
        username
        lastName
      }
    }
  }
`;

const USER_LOGIN = gql`
  mutation TokenAuth($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
    }
  }
`;

const GET_USER_DATA = gql`
  query {
    me {
      id
      username
      lastName
      email
      isStaff
    }
  }
`;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, DoCheck {
  public cargando: boolean | undefined;
  public isValid: boolean | undefined;
  public status: string | undefined;
  public identity: string | undefined;
  public user: User = new User();
  public token: string | undefined;
  public firstFormGroup: FormGroup | undefined;
  private querySubscription: Subscription | undefined;

  constructor(
    private _userService: UserService,
    private apollo: Apollo,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.cargando = false;
    this.isValid = false;
    this.user.name = '';
    this.user.username = '';
    this.user.surname = '';
    this.user.password = '';
  }

  ngOnInit(): void {}

  ngDoCheck() {    
    if (
      this.user.name != '' &&
      this.user.surname != '' &&
      this.user.password != '' &&
      this.user.username != ''
    ) {
      this.isValid = true;
    } else {
      this.isValid = false;
    }
  }

  Register() {
    this.cargando = true;
    console.log(this.user);

    this.cargando = true;
    this.apollo
      .mutate({
        mutation: USER_REGISTER,
        variables: {
          username: this.user.username,
          password: this.user.password,
          firstName: this.user.name,
          lastName: this.user.surname,
        },
      })
      .subscribe(
        (response: any) => {
          console.log('got data', response);        
          this.LogIn(this.user);
        },
        (error) => {
          console.log('there was an error sending the query', error);
          this.cargando = false;
          this.status = 'error';
        }
      );
  }

  LogIn(newUser: any) {
    this.cargando = true;
    this.apollo
      .mutate({
        mutation: USER_LOGIN,
        variables: {
          username: newUser.username,
          password: newUser.password,
        },
      })
      .subscribe(
        (response: any) => {
          console.log('got data', response);
          let token = response.data.tokenAuth.token;
          localStorage.setItem('token', token);
          this.getUserData(token);
        },
        (error) => {
          console.log('there was an error sending the query', error);
          this.cargando = false;
          this.status = 'error';
        }
      );
  }

  getUserData(_token: string) {
    this.querySubscription = this.apollo
      .watchQuery<any>({
        query: GET_USER_DATA,
      })
      .valueChanges.subscribe(
        (response: any) => {
          console.log(response);
          var user = response.data.me;
          localStorage.setItem('userLogged', JSON.stringify(user));
          this.cargando = false;
          this.status = 'success';
          this._router.navigate(['/movies']);
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
