const MALVA = [0xE357FF];
const TARONJA = [0xFF662E];
const INDI = [0x2A2EAD];
const RUBI = [0xC71835];

const roomName = "Vermell  vs. Blau";
var lastPlayerOnKickingBall = "";
var goals = [];
const RED_TEAM = 1;
const BLUE_TEAM = 2;
var teams = {
  [RED_TEAM]: "Vermell",
  [BLUE_TEAM]: "Blau"
}

var room = HBInit({
	roomName: roomName,
	maxPlayers: 10,
	noPlayer: true
});

room.setCustomStadium(stadium);
room.setScoreLimit(5);
room.setTimeLimit(0);
//room.setTeamColors(RED_TEAM, 60, 0xFFFFFF, MALVA);
//room.setTeamColors(BLUE_TEAM, 60, 0xFFFFFF, RUBI);

function updateAdmins() {
  var players = room.getPlayerList();
  if ( players.length == 0 ) return; // No players left, do nothing.
  if ( players.find((player) => player.admin) != null ) return; // There's an admin left so do nothing.
  room.setPlayerAdmin(players[0].id, true); // Give admin to the first non admin player in the list
}

room.onPlayerJoin = function(player) {
  updateAdmins();
  room.sendAnnouncement('Et donem la benvinguda al partit "' + roomName + '", ' + player.name + '. Molta sort!', null, 0x00FF00, "bold", 0);
}

room.onGameStart = function(byPlayer) {
  //Inicialitzem variables
  goals = [];
  lastPlayerOnKickingBall = "";
  room.sendAnnouncement("COMENÇA EL PARTIT " + roomName +"!", null, 0x00FF00, "bold", 0);
}

room.onTeamVictory = function(scores) {
  let winner = (scores.red > scores.blue)? teams[RED_TEAM] : teams[BLUE_TEAM];
  room.sendAnnouncement("🏆VICTÒRIA DE L'EQUIP " +  winner + "!!!", null, 0x00FF00, "bold", 0);
}

room.onTeamGoal = team => {
  var own;
  if (lastPlayerOnKickingBall.team == team) {
    own = false;
    room.sendAnnouncement('⚽️GOOOOOOOOOOL GOOOOL GOOOL GOL GOOOOL de ' + lastPlayerOnKickingBall.name + ' per l\'equip ' + teams[team] + '!!!', null, 0x00FF00, "bold", 0);
  } else {
    own = true;
    room.sendAnnouncement('⚽️GOOOOOOOOOOOOOOOOOOOOOOL de ' + lastPlayerOnKickingBall.name + ' en pròpia porteria i fa que pugi el marcador per l\'equip ' + teams[team] + '!!!', null, 0x00FF00, "bold", 0);
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

room.onPlayerBallKick = player => {
  lastPlayerOnKickingBall = player;
  var random = Math.floor(Math.random() * 30) + 1;
  if (random == 17) {
    room.sendAnnouncement(player.name + ' ho prova però no se\'n surt.', null, 0x00FF00, "bold", 0);
  };
}

function updateMarker() {
  var scores = room.getScores();
  var blueGoals = scores.blue;
  var redGoals = scores.red;
  var redScorers = getScorers(RED_TEAM);
  var blueScorers = getScorers(BLUE_TEAM);
  room.sendAnnouncement(`${teams[RED_TEAM]}: ${redGoals} ${((redGoals > 0)? "("+redScorers+")" : "")}\n${teams[BLUE_TEAM]}: ${blueGoals} ${((blueGoals > 0)? "("+blueScorers+")" : "")}`, null, 0x00FF00, "bold", 0);
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
	if(message.match(/#/g) != null){
    easterEgg = message.split("#");
    switch(easterEgg[1]){
      case "!":
		    room.setPlayerAvatar(player.id, "🤬");
        break;
      case "lililii":
        room.setPlayerAvatar(player.id, "🤩");
        break;
      case "i de tooot":
        room.setPlayerAvatar(player.id, "🦦");
        break;
      case "cocotero":
        room.setPlayerAvatar(player.id, "🥥");
        break;
      case "malvades":
        room.setPlayerAvatar(player.id, "💜");
        break;
      case "indius":
        room.setPlayerAvatar(player.id, "💙");
        break;
      case "rubinaires":
        room.setPlayerAvatar(player.id, "❤️");
        break;
      case "taronja":
        room.setPlayerAvatar(player.id, "🧡");
        break;              
      default:
        return;
    }
		return false;
	}
}
