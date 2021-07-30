import { Injectable } from '@angular/core';
import {v4 as uuidv4} from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  constructor() { }

  saveTeam(team: any){
    // Create a uuid if it doesn't exist
    if (!team.uuid){
      team.uuid = uuidv4();
    }
    // Search the current teams and include the new team
    let teams = this.getTeams()
    teams.push(team)
    // Save teams in local storage
    localStorage.setItem('valoran.teams', JSON.stringify(teams));
  }

  getTeams(): any[]{
    // Search the team in local storage
    let teams_local = localStorage.getItem('valoran.teams');
    if(teams_local){
      return JSON.parse(teams_local).filter((x: any) => x.uuid)
    }
    return []
  }
}
