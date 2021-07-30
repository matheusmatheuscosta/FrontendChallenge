import { TeamsService } from './../service/teams.service';
import { Component, Input, OnInit } from '@angular/core';
import { TournamentService } from '../service/tournament.service';
@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {

  qtdBattlesInit : any[] = [2,4,8,16,32] // Sets the amount of initial battles in the tournament
  nameTeam: string = '' // Return the text box to a new team
  teams: any[] = []
  @Input() tournament: any; // Tournament object

  constructor(
    private teamsService: TeamsService,
    private tournamentService: TournamentService
  ) {}

  ngOnInit(): void {
    this.getTeams()
  }

  getTeams(){
    // Search the teams
    this.teams = this.teamsService.getTeams()
    this.tournament.teams = this.teams
  }

  insertTeam(){
    // Include new team and clear name text box
    this.teamsService.saveTeam({
      name: this.nameTeam
    })
    this.nameTeam = '';
    // Search the teams
    this.getTeams()
  }

  startTournament(){
    // shuffle the teams
    this.tournament.teams.sort(() => Math.random() > Math.random() ? 1 : -1)
    this.tournament.rounds = []
    // Create the first round
    this.tournament.rounds.push({
      order: 1,
      battles: []
    })

    // Create first round battles based on teams
    let orderBattle = 1
    for (let i in this.tournament.teams){
      let index = parseInt(i)
      if (index % 2 == 0){
        this.tournament.rounds[0].battles.push({
          team_1: this.tournament.teams[index],
          team_2: this.tournament.teams[index+1] ? this.tournament.teams[index+1] : null,
          order: orderBattle,
          winner: null
        })
        orderBattle++
      }
    }

    // Create tournament rounds and battles based on the first round
    let qtdRounds = (this.tournament.rounds[0].battles.length / 2) + 1
    for (var i = 1; i <= qtdRounds; i++) {
      let roundWinner = false
      let qtdBattles = this.tournament.rounds[i - 1].battles.length / 2
      if (qtdBattles < 1){ // Check if it's the last round
        qtdBattles = 1
        roundWinner = true
      }

      // Include round battles
      let battles = []
      for (var x = 1; x <= qtdBattles; x++) {
        battles.push({
          team_1: null,
          team_2: null,
          order: x,
          winner: null
        })
      }

      // Includes round
      this.tournament.rounds.push({
        order: i + 1,
        roundWinner: roundWinner,
        battles: battles
      })
    }

    this.tournament.start = true
    this.tournamentService.save(this.tournament)
  }
}
