import { flatten } from "@angular/compiler";
import { Component, DoCheck } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements DoCheck {
  title = 'movies';
  loggedButtons=false;  
  isAdmin=false;

  constructor(
    private _router: Router
  ){
    
  }

  
  ngDoCheck() {    
    let identity:any
    identity = localStorage.getItem('userLogged')       
    if(identity===null){
      this.loggedButtons=false
    }else{
      this.loggedButtons=true
      identity=JSON.parse(identity)
      console.log(identity)      
      if(identity.isStaff){
        console.log("es admin el perro")
        this.isAdmin=true
      }else{
        this.isAdmin=false
        console.log("no es admin wacala")        
      }
    }
  }

  logOut(){
    localStorage.removeItem('userLogged')
    localStorage.removeItem('token')
    this._router.navigate(['/login'])
  }
}


