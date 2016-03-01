/**
 * Created by Gean on 2/13/2016.
 */

///////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Welcome to your first Cloud Script revision.
// The examples here provide a quick introduction to using Cloud Script and some
// ideas about how you might use it in your game.
//
// There are two approaches for invoking Cloud Script: calling handler functions directly
// from the game client using the "RunCloudScript" API, or triggering Photon Webhooks associated with
// room events. Both approaches are demonstrated in this file. You can use one or the other, or both.
//
// Feel free to use this as a starting point for your game server logic, or to replace it altogether.
// If you have any questions or need advice on where to begin,
// check out the resources at https://playfab.com/cloud-script or check our forums at
// https://support.playfab.com. For issues which are confidential (involving sensitive intellectual
// property, for example), please contact our Developer Success team directly at devrel@playfab.com.
//
// - The PlayFab Team
//
///////////////////////////////////////////////////////////////////////////////////////////////////////


// This is a Cloud Script handler function. It runs in the PlayFab cloud and
// has full access to the PlayFab Game Server API
// (https://api.playfab.com/Documentation/Server). You can invoke the function
// from your game client by calling the "RunCloudScript" API
// (https://api.playfab.com/Documentation/Client/method/RunCloudScript) and
// specifying "helloWorld" for the "ActionId" field.
handlers.helloWorld = function (args) {

    // "currentPlayerId" is initialized to the PlayFab ID of the player logged-in on the game client.
    // Cloud Script handles authenticating the player automatically.
    var message = "Hello " + currentPlayerId + "!";

    // You can use the "log" object to write out debugging statements. The "log" object has
    // three functions corresponding to logging level: debug, info, and error.
    log.info(message);

    // Whatever value you return from a CloudScript handler function is passed back
    // to the game client. It is set in the "Results" property of the object returned by the
    // RunCloudScript API. Any log statments generated by the handler function are also included
    // in the "ActionLog" field of the RunCloudScript result, so you can use them to assist in
    // debugging and error handling.
    return { messageValue: message };
}

//////////////////////////////////////////////////////////////
//-- this is the custom made for the needs of OneTwo apps --//
//////////////////////////////////////////////////////////////

// This function is used for updating client info that is read-only
handlers.updatePlayerInfo = function(args){

    var firstname = args.firstname;
    var lastname = args.lastname;
    var city = args.city;
    var gender = args.gender;
    var phonenumber = args.phonenumber;

    server.UpdateUserReadOnlyData({
        PlayFabId: currentPlayerId,
        Data:{
            firstname: firstname,
            lastname: lastname,
            city: city,
            gender: gender,
            phonenumber: phonenumber
        },
        Permission:'Public'
    });

    log.debug("Set User info for player " + currentPlayerId + " to first name" + firstname);

    initializePlayerWorth(currentPlayerId);
}

function initializePlayerWorth(currentPlayerIds){

    var keys = {
       Keys: ['weeklyTicket']
    }
    var playerTicketRequest = server.GetTitleData(keys);

    log.debug(playerTicketRequest);

    var playerTicket = playerTicketRequest.Data["weeklyTicket"];

    var updatePlayerWorth = {
        PlayFabId : currentPlayerIds,
        Data: {
            playerTicket: playerTicket,
            playerPoint: 0
            },
        Permission: "Public"
    }

    server.UpdateUserReadOnlyData(updatePlayerWorth);

    log.debug("Set user worth at initial creation");
}

handlers.addPointsToUser=function(args){

   var userPointRequest = server.GetUserReadOnlyData({
        PlayFabId: args.playerId,
        Keys:["playerPoint"]
    });

    var userPoint = 0;
    if(userPointRequest.Data["playerPoint"]!=null){
        log.debug(userPointRequest.Data["playerPoint"].Value);
        //userPoint = JSON.parse(userPointRequest.Data["playerPoint"]);
    };

    //log.debug("The user point is :"+userPoint);
    //
    //var totalPoint = parseInt(userPoint)+parseInt(args.point);
    //
    //log.debug("The total point is :"+totalPoint);
    //
    //var updatePlayerWorth = {
    //    PlayFabId : args.playerId,
    //    Data: {
    //        playerPoint: totalPoint
    //    },
    //    Permission: "Public"
    //}
    //
    //var updateRequest = server.UpdateUserReadOnlyData(updatePlayerWorth);
    //if(updateRequest.code!=200){
    //    return {messageError:updateRequest.code};
    //}
    //else{
    //    return {messageSuccess:"Data have been saved"};
    //}
}

handlers.initPlayerTicketAndPoint = function(args){
    initializePlayerWorth(currentPlayerId);
}

handlers.giveTicketToAllPlayer = function(args){
    var isReplace = args.isreplace;

    var ticketRequest = {
        Keys: ["weeklyTicket"]
    }

    var ticketData = server.GetTitleData(ticketRequest).Data["weeklyTicket"];
}

handlers.addMatch = function (args){
    var matchInfo = {
        matchid: args.matchId,
        home: args.home,
        away: args.away,
        time: args.times,
        stadion: args.stadion,
        tayangdi: args.tayangDi,
        status: args.status
    };

    var titleKeys = {
        Keys: ["matchData"]
    }

    var matchTitleData = server.GetTitleData(titleKeys);

    log.debug(matchTitleData);
    var matchData = matchTitleData.Data["matchData"];
    log.debug(matchData);
    if(matchData!=null){
        matchData = JSON.parse(matchData);
    }else{
        matchData = new Array();
    }
    matchData.push(matchInfo);
    log.debug(matchData);

    matchData = JSON.stringify(matchData);

    var titleData ={
        Key: "matchData",
        Value:matchData
    }

    server.SetTitleData(titleData);
    log.debug("The server pushed a new match data to the match list");
}

handlers.removeMatch = function(args){
    matchid = args.matchId;

    var titleKeys ={
        Keys:["matchData"]
    }

    var deletedMatch = null;

    var matchTitleData = server.GetTitleData(titleKeys).Data["matchData"];
    for(var match in  matchTitleData){
        if(match.matchid == matchid){
            deletedMatch = match;
            break;
        }
    }

    matchTitleData.remove
}

handlers.addBet = function(args){

    var matchKey = {
        Keys:["matchData"]
    }

    var isExistMatch = false;

    var matchDataRequest = server.GetTitleData(matchKey);
    var matchData = matchDataRequest.Data["matchData"];
    //log.debug(" Match data : "+JSON.parse(matchData));
    matchData = JSON.parse(matchData);
    for(var match in matchData){
        //log.debug(" the match : "+matchData[match]+" ");
        //log.debug(matchData[match].matchid+" compared to "+ args.matchId);
        if(matchData[match].matchid == args.matchId){
            isExistMatch= true;
        }
    }
    //
    if(isExistMatch){

        betData = server.GetUserReadOnlyData({
            PlayFabId: currentPlayerId,
            Keys:["bet"]
        });

        log.debug(betData.Data);

        if(betData.Data["bet"]){
            log.debug("Bet data NOT is empty");

            betData = betData.Data["bet"]["Value"];
            betData = JSON.parse(betData);
            log.debug(betData);

            betData.push({
                matchid: args.matchId,
                winner: args.winner,
                score: args.score,
                ticket: args.ticket
            });
        }else{
            log.debug("Bet data IS empty");
            betData = [];
            betData.push({
                matchid: args.matchId,
                winner: args.winner,
                score: args.score,
                ticket: args.ticket
            });
        }
        betData = JSON.stringify(betData);
        log.debug("This is the bet data : "+betData);
        var updateBetData = {
            PlayFabId: currentPlayerId,
            Data:{
                bet:betData
            },
            Permission:'Public'
        }
        var updateRequest = server.UpdateUserReadOnlyData(updateBetData);
        if(updateRequest.code!=200){
            return {messageError: "Saving data error"};
        }
        else{
            log.debug("server added the bet info for the selected match with match id : "+args.matchId);
        }
    }
}

handlers.getJSON = function(args){
    var baseURL = "http://playserverjson.hol.es/public/api/getJSON/";

    var returnValue = http.request(baseURL+args.url, "GET");
    if(returnValue!="") {
        log.debug("the value are returned : " + returnValue);
        return returnValue;
    }
}

// This is a function that the game client would call whenever a player completes
// a level. It updates a setting in the player's data that only game server
// code can write - it is read-only on the client - and it updates a player
// statistic that can be used for leaderboards.
//
// A funtion like this could be extended to perform validation on the
// level completion data to detect cheating. It could also do things like
// award the player items from the game catalog based on their performance.
handlers.completedLevel = function (args) {

    // "args" is set to the value of the "Params" field of the object passed in to
    // RunCloudScript from the client.  It contains whatever properties you want to pass
    // into your Cloud Script function. In this case it contains information about
    // the level a player has completed.
    var level = args.levelName;
    var monstersKilled = args.monstersKilled;

    // The "server" object has functions for each PlayFab server API
    // (https://api.playfab.com/Documentation/Server). It is automatically
    // authenticated as your title and handles all communication with
    // the PlayFab API, so you don't have to write the code to make web requests.
    var updateUserDataResult = server.UpdateUserInternalData({
        PlayFabId: currentPlayerId,
        Data: {
            lastLevelCompleted: level
        }
    });

    log.debug("Set lastLevelCompleted for player " + currentPlayerId + " to " + level);

    server.UpdateUserStatistics({
        PlayFabId: currentPlayerId,
        UserStatistics: {
            level_monster_kills: monstersKilled
        }
    });

    log.debug("Updated level_monster_kills stat for player " + currentPlayerId + " to " + monstersKilled);
}


// In addition to the Cloud Script handlers, you can define your own functions and call them from your handlers.
// This makes it possible to share code between multiple handlers and to improve code organization.
handlers.updatePlayerMove = function (args) {
    var validMove = processPlayerMove(args);
    return { validMove: validMove };
}

//////////////////////////////////////////////////////////////////////////
// -- This is the end of custom script for the Application of OneTwo -- //
//////////////////////////////////////////////////////////////////////////


// This is a helper function that verifies that the player's move wasn't made
// too quickly following their previous move, according to the rules of the game.
// If the move is valid, then it updates the player's statistics and profile data.
// This function is called from the "UpdatePlayerMove" handler above and also is
// triggered by the "RoomEventRaised" Photon room event in the Webhook handler
// below. For this example, the script defines the cooldown period (playerMoveCooldownInSeconds)
// as 15 seconds. A recommended approach for values like this would be to create them in Title
// Data, so that they can be queries in the script with a call to
// https://api.playfab.com/Documentation/Server/method/GetTitleData. This would allow you to
// make adjustments to these values over time, without having to edit, test, and roll out an
// updated script.
function processPlayerMove(playerMove) {
    var now = Date.now();
    var playerMoveCooldownInSeconds = 15;

    var playerData = server.GetUserInternalData({
        PlayFabId: currentPlayerId,
        Keys: ["last_move_timestamp"]
    });

    var lastMoveTimestampSetting = playerData.Data["last_move_timestamp"];

    if (lastMoveTimestampSetting) {
        var lastMoveTime = Date.parse(lastMoveTimestampSetting.Value);
        var timeSinceLastMoveInSeconds = (now - lastMoveTime) / 1000;
        log.debug("lastMoveTime: " + lastMoveTime + " now: " + now + " timeSinceLastMoveInSeconds: " + timeSinceLastMoveInSeconds);

        if (timeSinceLastMoveInSeconds < playerMoveCooldownInSeconds) {
            log.error("Invalid move - time since last move: " + timeSinceLastMoveInSeconds + "s less than minimum of " + playerMoveCooldownInSeconds + "s.")
            return false;
        }
    }

    var playerStats = server.GetUserStatistics({
        PlayFabId: currentPlayerId
    }).UserStatistics;

    if (playerStats.movesMade)
        playerStats.movesMade += 1;
    else
        playerStats.movesMade = 1;

    server.UpdateUserStatistics({
        PlayFabId: currentPlayerId,
        UserStatistics: playerStats
    });

    server.UpdateUserInternalData({
        PlayFabId: currentPlayerId,
        Data: {
            last_move_timestamp: new Date(now).toUTCString()
        }
    });

    return true;
}

// Photon Webhooks Integration
//
// The following functions are examples of Photon Cloud Webhook handlers.
// When you enable Photon integration in the Game Manager, your Photon applications
// are automatically configured to authenticate players using their PlayFab accounts
// and to fire events that trigger your CloudScript Webhook handlers, if defined.
// This makes it easier than ever to incorporate server logic into your game.
//
//  For more information, see https://playfab.com/using-photon-playfab

// Triggered automatically when a Photon room is first created
handlers.RoomCreated = function (args) {
    log.debug("Room Created - Game: " + args.GameId + " MaxPlayers: " + args.CreateOptions.MaxPlayers);
}

// Triggered automatically when a player joins a Photon room
handlers.RoomJoined = function (args) {
    log.debug("Room Joined - Game: " + args.GameId + " PlayFabId: " + args.UserId);
}

// Triggered automatically when a player leaves a Photon room
handlers.RoomLeft = function (args) {
    log.debug("Room Left - Game: " + args.GameId + " PlayFabId: " + args.UserId);
}

// Triggered automatically when a Photon room closes
// Note: currentPlayerId is undefined in this function
handlers.RoomClosed = function (args) {
    log.debug("Room Closed - Game: " + args.GameId);
}

// Triggered automatically when a Photon room game property is updated.
// Note: currentPlayerId is undefined in this function
handlers.RoomPropertyUpdated = function (args) {
    log.debug("Room Property Updated - Game: " + args.GameId);
}

// Triggered by calling "OpRaiseEvent" on the Photon client. The "args.Data" property is
// set to the value of the "customEventContent" HashTable parameter, so you can use
// it to pass in arbitrary data.
handlers.RoomEventRaised = function (args) {
    var eventData = args.Data;
    log.debug("Event Raised - Game: " + args.GameId + " Event Type: " + eventData.eventType);

    switch (eventData.eventType) {
        case "playerMove":
            processPlayerMove(eventData);
            break;

        default:
            break;
    }
}
