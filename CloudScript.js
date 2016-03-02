/**
 * Created by Gean on 3/1/2016.
 */

var baseURL = "http://playserverjson.hol.es/ABC/public/api/";

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

handlers.addPointsToUser=function(args){

    var userPointRequest = server.GetUserReadOnlyData({
        PlayFabId: args.playerId,
        Keys:["playerPoint"]
    });

    var userPoint = 0;
    if(userPointRequest.Data["playerPoint"]!=null){
        userPoint = userPointRequest.Data["playerPoint"].Value;
    };

    log.debug("The user point is :"+userPoint);

    var totalPoint = parseInt(userPoint)+parseInt(args.point);

    log.debug("The total point is :"+totalPoint);

    var updatePlayerWorth = {
        PlayFabId : args.playerId,
        Data: {
            playerPoint: totalPoint
        },
        Permission: "Public"
    }

    var updateRequest = server.UpdateUserReadOnlyData(updatePlayerWorth);
    if(updateRequest.code!=200){
        return {messageError:updateRequest.code};
    }
    else{
        return {messageSuccess:"Data have been saved"};
    }
}

handlers.initPlayerTicketAndPoint = function(args){
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

handlers.getMatchList = function (args) {

    var parsePar = {
        playfabId: args.playfabId,
        date: args.date
    }

    //var params = "playfabId="+args.playfabId+"&date="+args.date;
    var params = JSON.stringify(parsePar);

    var returnValue = http.request(baseURL+"getMatchList", "post",params, "application/json");
    if(returnValue!="") {
        log.debug("the value are returned : " + returnValue);
        return returnValue;
    }
}

handlers.addBet = function(args){
    var params = "matchId="+args.matchId+"&playfabId="+args.playfabId+"&winner="+args.winner+"&score="+args.score+"&ticket="+args.ticket;

    var returnValue = http.request(baseURL+"addBet", "post", params);

    if(returnValue!=""){
        log.debug("the value are returned : "+returnValue);
        return returnValue;
    }
}

handlers.executeCustom = function(args){
    var params = "matchId="+"1100";
    log.debug(params);
    var returnValue = http.request(baseURL+"testPost", "post",params);
    if(returnValue!="") {
        log.debug("the value are returned : " + returnValue);
        return returnValue;
    }
}