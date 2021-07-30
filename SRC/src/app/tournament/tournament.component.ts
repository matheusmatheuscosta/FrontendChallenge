import { Component, Input, OnInit } from '@angular/core';
import { TournamentService } from '../service/tournament.service';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.css']
})
export class TournamentComponent implements OnInit {

  @Input() _tournament: any;

  constructor(
    private tournamentService: TournamentService
  ) { }

  ngOnInit(): void {
    this._tournament = this.tournamentService.get()
  }

  // Search the next battle index
  getNextBattleIndex(round:any, battle:any){
    let nextIndex = -1 // starts with -1 to become index 0 in the first cycle
    for (let i in round.battles){
      if (parseInt(i) % 2 == 0){
        nextIndex++
      }
      if (round.battles[i] == battle){
        break
      }
    }
    return nextIndex
  }

  setWinner(round:any, battle:any, winner:any){
    battle.winner = winner

    let nextRound = this._tournament.rounds.filter((x: any) => x.order == round.order + 1)[0]

    // Save the corresponding teams from the battle
    let team_1: any = null
    let team_2: any = null
    let indexBattle = round.battles.indexOf(battle) // Search index of current battle
    if (indexBattle % 2 == 0){ // Check if the opponent is above or below, if it is even, it is below
      team_1 = this.getWinner(round, battle)
      team_2 = this.getWinner(round, round.battles[indexBattle + 1])
    } else {
      team_1 = this.getWinner(round, round.battles[indexBattle - 1])
      team_2 = this.getWinner(round, battle)
    }

    // Save the corresponding teams from the next battle
    let nextBattleIndex = this.getNextBattleIndex(round, battle)
    nextRound.battles[nextBattleIndex].team_1 = team_1
    nextRound.battles[nextBattleIndex].team_2 = team_2
    nextRound.battles[nextBattleIndex].winner = null

    this.tournamentService.save(this._tournament)
  }

  // Check if the team is the winner
  isWinner(round:any, battle:any, team:any){
    if(!team){ // If the team is null
      return false
    }
    if(round?.roundWinner){ // If it's the last round
      return true
    }
    return this.getWinner(round, battle)?.uuid == team?.uuid
  }

  // Search for the winner of the battle
  getWinner(round:any, battle:any){
    if (!battle || !battle.team_1 || !battle.team_2) return null;
    return battle[battle.winner]
  }

  // Cancel tournament
  cancelTournament(){
    this._tournament.teams = []
    this._tournament.start = false
    this.tournamentService.save(this._tournament)
  }

  // Array sorting helper function by order attribute
  sortOrder(a:any, b:any) {
    if (a.order < b.order)
       return -1;
    if (a.order > b.order)
      return 1;
    return 0;
  }
}
