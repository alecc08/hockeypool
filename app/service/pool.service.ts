import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class PoolService {
  constructor(private http:AuthHttp) {

  }

  saveTeamName(poolId, teamId, teamName) {
    this.http.put('/api/pool/' + poolId + '/poolAccount/' + teamId, {teamName: teamName}).map(res => res.json())
      .subscribe(response => {
        console.log("Change team name success=" + response.success);
      });
  }

  isOwner(id, team) {
    
  }
}
