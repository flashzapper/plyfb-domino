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
        if(args.hasOwnProperty(key)){
            var titleParams = {
                Key:key,
                Value:args[key]
            }

            server.SetTitleData(titleParams);
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

// added args params for the new method calls,
// so its initialize not only the worth but also the user to get username
handlers.initPlayerTicketAndPoint = function(args){
    var name = args.username;
    initializePlayerWorth(currentPlayerId, name);
}

function initializePlayerWorth(currentPlayerId, username){
    var paramsBet = {
        userId:currentPlayerId,
        userName: username
    }

    var params = JSON.stringify(paramsBet);

    var returnValue = http.request(baseURL+"user/initializeUserWorth", "post", params, "application/json");

    if(returnValue!=""){
        //log.debug("the value are returned : "+returnValue);
        return returnValue;
    }
}

// END CHANGES for initPlayerTicketAndPoint

// this function is no longer called, because client app is getting the list from CSV if
// different version are present
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

// get all user's bet regardless of anything
handlers.getBetOfUser = function () {
    var getUrl = baseURL+"bet/get/"+currentPlayerId;
    var returnValue = http.request(getUrl);
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

    // The calls to addBet origin is blocked, its gonna be reverted back to addBet once the function is updated
    //var returnValue = http.request(baseURL+"bet/addBet", "post", params, "application/json");
    var returnValue = http.request(baseURL+"bet/finalAddBet", "post", params, "application/json");

    if(returnValue!=""){
        //log.debug("the value are returned : "+returnValue);
        return returnValue;
    }
}


// Added new handlers for canceling and deleteing bet
handlers.cancelBet = function (args) {
    var paramsBet = {
        userId:currentPlayerId,
        matchId: args.matchId
    }

    var params = JSON.stringify(paramsBet);

    var returnValue = http.request(baseURL+"bet/cancelBet", "put", params, "application/json");

    if(returnValue!=""){
        //log.debug("the value are returned : "+returnValue);
        return returnValue;
    }
}

handlers.deleteBet = function (args) {
    var paramsBet = {
        userId:currentPlayerId,
        matchId: args.matchId
    }

    var params = JSON.stringify(paramsBet);

    var returnValue = http.request(baseURL+"bet/deleteBet", "delete", params, "application/json");

    if(returnValue!=""){
        //log.debug("the value are returned : "+returnValue);
        return returnValue;
    }
}

// END OF NEW HANDLERS OF BET

// this is just an example of how to call the outer server API
handlers.executeCustom = function(args){
    var params = "matchId="+"1100";
    log.debug(params);
    var returnValue = http.request(baseURL+"testPost", "post",params);
    if(returnValue!="") {
        log.debug("the value are returned : " + returnValue);
        return returnValue;
    }
}

// PROTOTYPE OF GROUP CALL <- create other group call based on this


// set base url untuk semua pemanggilan request
var groupURL = "http://103.43.46.97/onetwo/index.php/app/get/?model=group"

// untuk bikin function calls, depannya harus pake "handlers", soalnya object yang di executed nya handlers
handlers.getAllGroup = function () {

    // how to get response : http.request (URL, METHOD optional, PARAMS optional, ACTION-TYPE optional )
    // URL = harus ada, isinya url yang dituju
    // METHOD = "GET" / "POST" / "PUT" / "DELETE" , kalo ga diisi, langsung otomatis ke detect sebagai GET
    // PARAMS = JSON yang udah di encode, ini di isi kalo method BUKAN GET dan ada parameter
    // ACTION-TYPE = harus di isi sama "application/json" kalo servernya cuma nerima JSON.

    // Untuk yang all group contohnya pake GET, ditampung di returnValue hasilnya
    var returnValue = http.request(groupURL)

    // Kalo isi return valuenya ada, berarti ga error
    if(returnValue != ""){
        // kasih returnValue nya ke caller / client
        return returnValue
    }

    //kalo misal ga ada isinya, berarti error
    //kasih return error state aja disini
}


// INI UNTUK CONTOH POST NYA
// args itu parameter yang di lempar dari client, isinya object JSON
handlers.createGroup = function(args){

    // BIKIN OBJECT REQUEST JSON NYA
    // INI PERCONTOHAN SAJA, SAYA GA TAU REAL PARAMS NYA APA
    var paramsGroup = {
        userId:args.userId, // group captain
        dateCreated: args.createdDate // date when group is created
    }

    // DISINI, OBJECTNYA ENCODE DULU BIAR JADI JSONString, SOALNYA PARAMS NYA CUMA BISA MASUK JSONString
    var params = JSON.stringify(paramsGroup);

    // PANGGIL REQUESTNYA PAKE POST, ISI PARAMS NYA, SET ACTION-TYPE NYA
    var returnValue = http.request("http://103.43.46.97/onetwo/index.php/app/group/create", "POST", params, "application/json");

    // GET RETURN VALUE NYA, RETURN
    if(returnValue!=""){
        //log.debug("the value are returned : "+returnValue);
        return returnValue;
    }

    // ATAU KALAU KOSONG, TULIS RETURN NYA ERROR

}
