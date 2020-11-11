const roomName = "Nom de la partida";
var lastPlayerOnKickingBall = "error";
var goals = [];
const RED_TEAM = 1;
const BLUE_TEAM = 2;

var room = HBInit({
	roomName: roomName,
	maxPlayers: 10,
	noPlayer: true
});

room.setCustomStadium(stadium);
room.setScoreLimit(5);
room.setTimeLimit(0);


function updateAdmins() {
  var players = room.getPlayerList();
  if ( players.length == 0 ) return; // No players left, do nothing.
  if ( players.find((player) => player.admin) != null ) return; // There's an admin left so do nothing.
  room.setPlayerAdmin(players[0].id, true); // Give admin to the first non admin player in the list
}

room.onPlayerJoin = function(player) {
  room.sendAnnouncement('Et donem la benvinguda al partit "' + roomName + '", ' + player.name + '. Molta sort!');
}

room.onTeamGoal = team => {
  var own;
  if (lastPlayerOnKickingBall.team == team) {
    own = false;
    room.sendAnnouncement('GOOOOOOOOOOL GOOOOL GOOOL GOL GOOOOL de ' + lastPlayerOnKickingBall.name + ' per l\'equip ' + getTeam(team) + '!!!');
  } else {
    own = true;
    room.sendAnnouncement('GOOOOOOOOOOOOOOOOOOOOOOL de ' + lastPlayerOnKickingBall.name + ' en pròpia porteria i fa que pugi el marcador per l\'equip ' + getTeam(team) + '!!!');
  }

  goals.push({
    player: lastPlayerOnKickingBall,
    own: own,
    team: team
  });

  setTimeout(() => {
    updateMarker();
  }, 1000);
}

function getTeam(team) {
  var equip;
  switch (team) {
    case BLUE_TEAM:
      equip = 'Blau';
      break;
    default:
      equip = 'Vermell';
      break;
  }
  return equip;
}

room.onPlayerBallKick = player => {
  lastPlayerOnKickingBall = player;
  var random = Math.floor(Math.random() * 30) + 1;
  if (random == 17) {
    room.sendAnnouncement(player.name + ' ho prova però no se\'n surt.');
  };
}

function updateMarker() {
  var scores = room.getScores();
  var blueGoals = scores.blue;
  var redGoals = scores.red;
  var redScorers = getScorers(RED_TEAM);
  var blueScorers = getScorers(BLUE_TEAM);
  room.sendAnnouncement(`Vermells: ${redGoals} (${redScorers})\nBlaus: ${blueGoals} (${blueScorers})`);
}

function getScorers(team) {
  var output = "";
  var goalsCounter = 0;

  goals.forEach((goal, index) => {
    if (goal.team == team) {
      var goalString = goal.player.name;

      if (goal.own) goalString += ' pp';

      output += goalsCounter == 0 ? goalString : (', ' + goalString);
      goalsCounter++;
    }
  });
  return output;
}

room.onPlayerChat = function(player, message) {
	if(message.match(/#!/g) != null){
		room.setPlayerAvatar(player.id, "🤬");
		//setTimeout(() => { room.setPlayerAvatar(player.id, player.id); }, 1000);
		return false;
	}
	if (message.match(/lililii/g) != null) {
		room.setPlayerAvatar(player.id, "🤩");
		//setTimeout(() => { room.setPlayerAvatar(player.id, player.id); }, 1000);
		return false;
	}
}
