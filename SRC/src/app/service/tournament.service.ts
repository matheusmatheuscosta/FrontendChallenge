import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {

  constructor() { }

  save(tournament: any){
    // Save tournament in local storage
    localStorage.setItem('valoran.tournament', JSON.stringify(tournament));
  }

  get(): any{
    // Search the tournament in local storage
    let local = localStorage.getItem('valoran.tournament');
    if(local){
      return JSON.parse(local)
    }
    // If it doesn't exist, it returns a tournament object
    return {
      teams: [],
      rounds: [],
      start: false
    }
  }
}
