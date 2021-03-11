import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap, take, exhaustMap } from 'rxjs/operators';

import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { AuthService } from '../auth/auth.service';
import { Ingredient } from './ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private shoppingService: ShoppingListService,

    private authService: AuthService
  ) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put(
        "https://recipe-book-f0604-default-rtdb.firebaseio.com/recipes.json",
        recipes
      )
      .subscribe(response => {
        console.log(response);
      });
  }

  fetchRecipes() {
    return this.http
      .get<Recipe[]>(
        "https://recipe-book-f0604-default-rtdb.firebaseio.com/recipes.json"
      )
      .pipe(
        map(recipes => {
          return recipes.map(recipe => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : []
            };
          });
        }),
        tap(recipes => {
          this.recipeService.setRecipes(recipes);
        })
      );
  }

  storedIngredients() {
    
   
    const ingredient = this.shoppingService.getIngredients();
    this.http
      .put(
        "https://recipe-book-f0604-default-rtdb.firebaseio.com/ingredient.json",
        ingredient
      )
      .subscribe((response) => {
        console.log(response);
      });
  }

  fetchIngredients() {
    
    return this.http.get<Ingredient[]>(
      "https://recipe-book-f0604-default-rtdb.firebaseio.com/ingredient.json")
      .pipe(
        map(ingredients => ingredients 
          ? ingredients.map(ingredients => ({...ingredients })) 
          : []
        ),
        tap(ingredients => this.shoppingService.setIngredients(ingredients))
     );
  
        }
}
