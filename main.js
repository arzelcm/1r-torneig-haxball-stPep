const roomName = "Nom de la partida";

var room = HBInit({
	roomName: roomName,
	maxPlayers: 16,
	noPlayer: true // Remove host player (recommended!)
});
room.setDefaultStadium("Classic");
room.setScoreLimit(5);
room.setTimeLimit(0);

// If there are no admins left in the room give admin to one of the remaining players.
function updateAdmins() { 
  // Get all players
  var players = room.getPlayerList();
  if ( players.length == 0 ) return; // No players left, do nothing.
  if ( players.find((player) => player.admin) != null ) return; // There's an admin left so do nothing.
  room.setPlayerAdmin(players[0].id, true); // Give admin to the first non admin player in the list
}

room.onPlayerJoin = function(player) {
  updateAdmins();
  room.sendAnnouncement('Et donem la benvinguda al partit "' + roomName + '", ' + player.name + '. Molta sort!');
}

room.onPlayerLeave = function(player) {
  updateAdmins();
}

room.onTeamGoal = team => {
  room.sendAnnouncement('GOOOOOOOOOOL GOOOOL GOOOL GOL GOOOOL. Marca l\'equip ' + team. + '');
}