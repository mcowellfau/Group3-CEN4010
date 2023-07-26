$(document).ready(function(){
    var userPersInfo = {
        name: null,
        dob: null,
        bmr: null,
        sex: null,
        exp: null,
    };
    auth.onAuthStateChanged((user) => {
        if (user) {
            const userUID = user.uid;
            //get user info
            db.collection("user").doc(userUID).get().then((doc) => {
                if (doc.exists) {
                    console.log("User Data:", doc.data());
                    var userData = doc.data();
                    displayUserInfo(userData);
                    //Make edit profile fields default
                    defaultEditFields(userData);
                }
            })
            //If save changes is pressed, update w/ new values
            $("#editForm").on("submit", function(event){
                event.preventDefault();
                var name = $("#name").val();
                var dob = $("#dob").val();
                var bmr = $("#bmr").val();
                var sex = $("#sex").find(":selected").val();
                console.log(name, dob, bmr, sex);
                //Storing user info into userPersInfo
                userPersInfo.name = name;
                userPersInfo.dob = dob;
                userPersInfo.bmr = bmr;
                userPersInfo.sex = sex;
                userPersInfo.exp = 0;
                console.log("User Info:", userPersInfo);

                db.collection("user").doc(userUID).update({
                    name: userPersInfo.name,
                    dob: userPersInfo.dob,
                    bmr: userPersInfo.bmr,
                    sex: userPersInfo.sex,
                    exp: userPersInfo.exp,
                }).then(() => {
                    console.log("Successfully updated user info");
                    displayUserInfo(userPersInfo);
                    //Hide modal when done
                    $("#editProfileModal").modal("hide");
                }).catch((error) => {
                    console.log(error);
                });
            });
            //cancel button
            $("#cancelEdit").on("click", function() {
                var userDoc = db.collection("user").doc(userUID);
                userDoc.get().then((doc) => {
                    if (doc.exists) {
                        userData = doc.data();
                        defaultEditFields(userData);
                    }
                })
                //hide modal
                $("#editProfileModal").modal("hide");
            })
            
        }
    });

    function displayUserInfo(data) {
        newdob = new Date(data.dob.replaceAll("-", "\/"));
        $("#userDisplay>th").text(data.name + "'s Profile");
        $("#nameDisplay>td:first").text("Name:");
        $("#nameDisplay>td:last").text(data.name);
        $("#dobDisplay>td:first").text("Date of Birth:");
        $("#dobDisplay>td:last").text(newdob.toLocaleDateString());
        $("#bmrDisplay>td:first").text("BMR");
        $("#bmrDisplay>td:last").text(data.bmr);
        $("#sexDisplay>td:first").text("Sex:");
        $("#sexDisplay>td:last").text(data.sex);
    }
    function defaultEditFields(data) {
        $("#name").val(data.name);
        $("#dob").val(data.dob);
        $("#bmr").val(data.bmr);
        $("#sex").val(data.sex);
    }
})