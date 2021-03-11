import { Component, ComponentFactoryResolver, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { AlertComponent } from "../shared/alert/alert.component";
import { DataStorageService } from "../shared/data-storage.service";


import { AuthService, AuthResponseData } from "./auth.service";

@Component({
    selector:'auth-component',
    templateUrl:'./auth.component.html',
    styleUrls: ['./auth.component.css']

})


export class AuthComponent {
    isLoginMode = true ;
    isloading = false;
    error: string = null;
    //@ViewChild(PlaceholderDirective, {static:false}) alertHost:PlaceholderDirective
    
    private closeSub: Subscription;

    constructor(
        private authService: AuthService, 
        private router:Router,
        private DataShareService: DataStorageService,
        private componentFactoryResolver:ComponentFactoryResolver){}


        image :string ="src\assets\image\joseph-gonzalez-fdlZBWIP0aM-unsplash.jpg"

        

    onSwitchMode(){
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form :NgForm){

        if(!form.valid){
            return;
        }
        const email = form.value.email
        const password = form.value.password
        let authObs:Observable<AuthResponseData>

        this.isloading = true;

        if (this.isLoginMode){

           authObs= this.authService.login(email, password);
        }else {

           authObs = this.authService.signup(email, password)

        }

        authObs.subscribe(  resData=>{
            console.log(resData);
            this.isloading =false;
            this.router.navigate(['/recipes'])
            this.DataShareService.fetchIngredients().subscribe();
            this.DataShareService.fetchRecipes().subscribe();

        }, 
        errorMessage=>{ 
            console.log(errorMessage)
            this.error = errorMessage;
            // this.showErrorAlert( errorMessage);
            this.isloading =false;
        })
  
      
        
        form.reset();
    }

onHandleError(){
    this.error = null;
}


private showErrorAlert(message :string){
//   const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);

//   const hostViewContainerRef = this.alertHost.viewContainerRef;
//   hostViewContainerRef.clear();

//   const componentRef =  hostViewContainerRef.createComponent(alertCmpFactory);

//   componentRef.instance.message = message;
//   this.closeSub= componentRef.instance.close.subscribe(()=>{

//     this.closeSub.unsubscribe();
//     hostViewContainerRef.clear();

//   })
  
}


}