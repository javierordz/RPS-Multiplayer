# RPS-Multiplayer
Unit 7 Assignment

(1) I made this using Firebase's Firestore, which while more flexible, was exceedingly more difficult
than the Realtime databse. In particular, the lack of "onDisconnect()" made restricting only players very hard.

If I'd had more time, I'd probably have tried to re-engineering everything into the Realtime or 
used an "online" Boolean to monitor connection status tied with a Cloud Function to detect changes
to "online" and delete the player document from "Players" on Firestore.
Right now, you have to manually delete the players for others to join.

(2) The chat functionality really would have benefitted from Realtime, as well. I could make it work
with Firestore, but it doesn't seem as smooth a solution.