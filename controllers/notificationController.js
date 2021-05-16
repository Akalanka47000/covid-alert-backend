
const User = require("../models/User");

var admin = require("firebase-admin");

var serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

exports.sendNotification = async (req, res) => {
  
    const { latitude,longitude } = req.body;
  
    // Validate details
    if (!latitude || !longitude) {
      return res.status(400).json({
        message: "Please provide a latitude and a longitude",
      });
    }

    const users=await User.find();

    for(let i=0;i<users.length;i++){
      let distance=getDistance(latitude,longitude,users[i].location.latitude,users[i].location.longitude);
      console.log(distance);
      if(distance<1){
        var registrationToken = users[i].firebaseToken;
        var payload = {
          notification: {
            title: "Patient Detected in your Vicinity",
            body: parseInt(distance*1000,10)+"m from your current location"
          }
        };
        var options = {
          priority: "normal",
          timeToLive: 60 * 60
        };
        admin.messaging().sendToDevice(registrationToken, payload, options)
        .then(function(response) {
          console.log("Successfully sent message:", response);
        })
        .catch(function(error) {
          console.log("Error sending message:", error);
        });
      }
    }
    
    return res.status(200).json({
          message: `Sucessfully notified`,
    });
  };


  function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }
  
  function getDistance(lat1, lon1, lat2, lon2) {
    var earthRadiusKm = 6371;
  
    var dLat = degreesToRadians(lat2-lat1);
    var dLon = degreesToRadians(lon2-lon1);
  
    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);
  
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return earthRadiusKm * c;
  }