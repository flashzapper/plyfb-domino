/**
 * Created by Gean on 3/1/2016.
 */

//var baseURL = "http://playserverjson.hol.es/ABC/public/api/";
var baseURL = "http://103.43.46.97/football0120/public/";

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

handlers.setVersions = function (args) {

    for (var key in args){
        log.debug("the key value are : " + key);
        if(args.hasOwnProperty(key)){
            var titleParams = {
                Key:key,
                Value:args[key]
            }

            var updateRequest = server.SetTitleData(titleParams);
            if(updateRequest.code!=200){
                return {messageError:updateRequest.code};
            }
        }
    }

    return {message:"return with successful push"};

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

handlers.initPlayerTicketAndPoint = function(){
    initializePlayerWorth(currentPlayerId);
}

function initializePlayerWorth(currentPlayerId){
    var paramsBet = {
        userId:currentPlayerId
    }

    var params = JSON.stringify(paramsBet);

    var returnValue = http.request(baseURL+"user/initializeUserWorth", "post", params, "application/json");

    if(returnValue!=""){
        //log.debug("the value are returned : "+returnValue);
        return returnValue;
    }
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

handlers.getUserPointAndTicket = function () {
    var parsePar = {
        userId:currentPlayerId
    }

    var params = JSON.stringify(parsePar);

    var returnValue = http.request(baseURL+"user/userWorth", "post",params, "application/json");
    if(returnValue!="") {
        log.debug("the value are returned : " + returnValue);
        return returnValue;
    }
}

handlers.addBet = function(args){
    var paramsBet = {
        matchId:args.matchId,
        userId:currentPlayerId,
        winner: args.winner,
        homeScore:args.homeScore,
        awayScore:args.awayScore,
        ticket:args.ticket
        }

    var params = JSON.stringify(paramsBet);

    var returnValue = http.request(baseURL+"bet/addBet", "post", params, "application/json");

    if(returnValue!=""){
        //log.debug("the value are returned : "+returnValue);
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