// VARIABLES
var db = firebase.firestore();
var dbUsers = db.collection("users"); // Database of all stored Users' game records
var dbPlayers = db.collection("players"); // Database of two CURRENT player choices
var dbChat = db.collection("chatlog"); // Database of chatlog

var wins = 0;
var losses = 0;
var draws = 0;

var userTitle = "Spectator";
var userName = "";
var userWeapon = "";
var opponentWeapon = "";
var playerArray= [];

// FUNCTIONS
function writeUser() {
    dbUsers.doc(userName).set({
        wins: wins,
        draws: draws,
        losses: losses
    });
};

function writePlayer() {
    dbPlayers.doc(userTitle).set({
        userName: userName,
        userWeapon: userWeapon
    });
};

function battle() {
    dbPlayers.get().then(function(snapshot) {
        snapshot.forEach(function(snap) {
            playerArray.push(snap.data().userWeapon);
        });

        playerArray.splice(playerArray.indexOf(userWeapon), 1);
        opponentWeapon = playerArray.toString();
        console.log(opponentWeapon);
        $("#oppWChoice").html("<i class='far fa-hand-" + opponentWeapon + "'></i>");

        if (userWeapon == opponentWeapon) {
            draws++;
            $("#display").text("...draw...");
        } else if (userWeapon == "rock" && opponentWeapon == "scissors" ||
                    userWeapon == "paper" && opponentWeapon == "rock" ||
                    userWeapon == "scissors" && opponentWeapon == "paper" ) {
            wins++;
            $("#display").text("VICTORY!");
        } else {
            losses++;
            $("#display").text("Deafeat.");
        }

        writeUser();
        
        dbPlayers.doc("Player " + userName).update({
            userWeapon: firebase.firestore.FieldValue.delete()
        }).then(function() {
            setTimeout(function() { 
                $("#userWChoice").html(""); 
                $("#oppWChoice").html(""); 
                $("#display").text("CHOOSE WEAPON"); 
                userWeapon = "";
                opponentWeapon = [];
                playerArray = [];
            }, 3000);
        });
    })
}

// LISTENERS
// changes to Player database to detect two filled-in userWeapon fields (which means a battle is possible)
dbPlayers.onSnapshot(function() {
    dbPlayers.where("userWeapon", ">", "").get().then(function(snapshot) {
        if (snapshot.size > 1) {
            snapshot.forEach(function(snap) {
                playerArray.push(snap.data().userWeapon);
            });

            playerArray.splice(playerArray.indexOf(userWeapon), 1);
            opponentWeapon = playerArray.toString();

            if (opponentWeapon != "") { 
                $("#oppWChoice").html("<i class='far fa-hand-" + opponentWeapon + "'></i>"); 
            }

            opponentWeapon = [];
            playerArray = [];
        }

        if(snapshot.size == 2) { 
            battle(); 
        }
    });
})

// changes to User record reflected in #statsCard
dbUsers.onSnapshot(function(snap) {
    $("#wins").html(wins);
    $("#losses").html(losses);
    $("#draws").html(draws);
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
});

$(".weapon").on("click", function() {
    if (userWeapon === "" && userTitle != "Spectator") {
        userWeapon = $(this).data("value");
        $("#userWChoice").html("<i class='far fa-hand-" + userWeapon + "'></i>");
        $("#hiddenRow2").removeClass("hidden");
        writePlayer();
    };
});