import { Route } from '@angular/compiler/src/core';
import { Component, OnInit, DoCheck } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { from } from 'rxjs';
import { Subscription } from 'rxjs'
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { User } from 'src/app/models/user.model';
import { UserService} from '../../services/user.service'
import { ActivatedRoute, Router } from '@angular/router';



const USER_LOGIN = gql`
  mutation TokenAuth($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password ) {
      token
    }
  }
`;

const GET_USER_DATA= gql`
query{
  me{
    id
    username,
    lastName,
    email,
    isStaff
  }
}
`;

interface tokenAuth  {
  token: string
}


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  
  public cargando: boolean | undefined;
  public status: string | undefined;
  public identity: string | undefined;
  public user: User = new User();
  public token:string | undefined;
  public firstFormGroup: FormGroup | undefined;
  private querySubscription: Subscription | undefined

  constructor(
    private _userService: UserService,
    private apollo: Apollo,
    private _route: ActivatedRoute,    
    private _router: Router,
  ) {
    this.user = new User();    
    this.cargando=false
  }

  ngOnInit(): void {}

  LogIn() {
    this.cargando=true;
    this.apollo.mutate({
      mutation: USER_LOGIN,
      variables: {
        username: this.user.username,
        password: this.user.password
      }
    }).subscribe((response:any) => {      
      console.log('got data', response);
      let token=response.data.tokenAuth.token;
      localStorage.setItem("token", token);
      this.getUserData(token)      

    },(error) => {
      console.log('there was an error sending the query', error);
      this.cargando=false
      this.status="error"
      
    });
  
  }

  getUserData(_token: string){
    this.querySubscription = this.apollo.watchQuery<any>({
      query: GET_USER_DATA
    })
      .valueChanges
      .subscribe(( response:any ) => {
        console.log(response)
        var user=response.data.me
        localStorage.setItem("userLogged", JSON.stringify(user));
        this.cargando=false                
        this.status="success"
        this._router.navigate(["/movies"]);   
      },(error)=>{
        console.log(error)
        
      });
  }
}
