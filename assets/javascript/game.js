// VARIABLES
var db = firebase.firestore();
var dbUsers = db.collection("users"); // Database of all stored game records
var dbPlayers = db.collection("players"); // Database of two current player records
var dbChat = db.collection("chatlog"); // Database of chatlog

var wins = 0;
var losses = 0;
var draws = 0;

var userTitle = "Spectator";
var userName = "";
var userWeapon = "";
var opponentWeapon = "";

// FUNCTIONS
function writeUser() {
    dbUsers.doc(userName).set({
        wins: wins,
        draws: draws,
        losses: losses
    })
}

function writePlayer() {
    dbPlayers.doc(userTitle).set({
        userName: userName,
        userWeapon: userWeapon
    })
}

function battle() {
    dbPlayers.get().then(function(snap) {
        snap.forEach(function(doc) {
            console.log(doc.id, " => ", doc.data());
            // if () {

            // }
        })
    })
}

// LISTENERS

// changes to Player database to detect two filled-in userWeapon fields (which means a battle is possible)
dbPlayers.onSnapshot(function() {
    dbPlayers.where("userWeapon", ">", "").get().then(function(snap) {
        if(snap.size == 2) {
            battle();
        }
    })
})



// BUTTONS
$("#connectButton").on("click", function(event) {
    
    if (userName == "") {
        event.preventDefault();
        userName = $("#nameInput").val().trim();

        dbUsers.doc(userName).get().then(function(doc) {
            if (doc.exists) {
                wins = doc.data().wins;
                losses = doc.data().losses;
                draws = doc.data().draws;
            } else {
                writeUser();
            }

            // Only manual display update; after this, will be a listener event
            $("#wins").html(wins);
            $("#losses").html(losses);
            $("#draws").html(draws);
        }).catch(function(error) {
            console.log("Error getting document: ", error)
        })

        dbPlayers.get().then(function(snap) {
            if(snap.size < 2) {
                userTitle = "Player " + userName;
                writePlayer();
                $("#display").text("CHOOSE WEAPON");
                $("#hiddenRow1").removeClass("hidden");
                $("#stats").removeClass("hidden");
                $("#chat").removeClass("hidden");
                $("#userStateTitle").text(userTitle);
            } else {
                userTitle = "Spectator";
                $("#display").text("UNAVAILABLE");
            }
        })
    }
})

$(".weapon").on("click", function() {
    if (userWeapon === "" && userTitle != "Spectator") {
        userWeapon = $(this).data("value");
        $("#userWChoice").html("<i class='far fa-hand-" + userWeapon + "'></i>");
        $("#hiddenRow2").removeClass("hidden");
        writePlayer();
    }
})