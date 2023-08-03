$(document).ready(function(){
    var userPersInfo = {
        name: null,
        dob: null,
        bmr: null,
        sex: null,
        exp: null,
    };
    var passMatch = false;

    auth.onAuthStateChanged((user) => {
        if (user) {
            const userUID = user.uid;
            //get user info
            db.collection("user").doc(userUID).get().then((doc) => {
                if (doc.exists) {
                    console.log("User Data:", doc.data());
                    var userData = doc.data();
                    displayUserInfo(userData, user);
                    //Make edit profile fields default
                    defaultProfileEditFields(userData);
                    //Make edit account fields default
                    $("#email").val(user.email);
                    $("#password, .passField>input").val("");
                }
            })
            //If profile save changes is pressed, update w/ new values
            $("#editProfileForm").on("submit", function(event){
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
                    displayUserInfo(userPersInfo, user);
                    //Hide modal when done
                    $("#editProfileModal").modal("hide");
                }).catch((error) => {
                    console.log(error);
                });
            });
            //cancel profile edit button
            $("#cancelProfileEdit").on("click", function() {
                var userDoc = db.collection("user").doc(userUID);
                userDoc.get().then((doc) => {
                    if (doc.exists) {
                        userData = doc.data();
                        defaultProfileEditFields(userData);
                    }
                })
                //hide modal
                $("#editProfileModal").modal("hide");
            })
            //Show email or password edit fields
            $("#clickToEditPass").on("click", function(){
                $("#clickToEditPass").addClass("d-none");
                $("#clickToEditEmail").removeClass("d-none");
                $(".emailField").addClass("d-none");
                $(".emailField").removeAttr("required");
                $(".passField").removeClass("d-none");
                $(".passField").attr("required", "required");
            })
            $("#clickToEditEmail").on("click", function(){
                $("#clickToEditEmail").addClass("d-none");
                $("#clickToEditPass").removeClass("d-none");
                $(".passField").addClass("d-none");
                $(".passField").removeAttr("required");
                $(".emailField").removeClass("d-none");
                $(".emailField").attr("required", "required");
            })
            //Save account edit submit
            $("#editAccountForm").on("submit", function(event){
                event.preventDefault();
                var currPass = $("#password").val();
                const credential = firebase.auth.EmailAuthProvider.credential(user.email, currPass);
                //Two ways to submit: save new email, or save new password
                if($(".passField").hasClass("d-none")) {
                    //If password fields are hidden, save new email
                    var email = $("#email").val();
                    //Authenticate user with entered password
                    user.reauthenticateWithCredential(credential).then(() => {
                        user.updateEmail(email).then(() => {
                            console.log("User email updated successfully")
                            //display updated profile info, getting user doc and displaying
                            db.collection("user").doc(userUID).get().then((doc) => {
                                if (doc.exists) {
                                    displayUserInfo(doc.data(), user)
                                }
                            })
                            //Hide modal when done
                            $("#editAccountModal").modal("hide");
                        }).catch((error) => {
                            console.log(error);
                        })
                    }).catch((error) => {
                        console.log(error);
                    })
                } else {
                    //otherwise, password fields are unhidden so save new password
                    //Check if new password and confirm password fields match, if they do, continue
                    if(passMatch == true){
                        var newPass = $("#confirmNewPassword").val();
                        //reauthenticate with entered current password
                        user.reauthenticateWithCredential(credential).then(() => {
                            user.updatePassword(newPass).then(() => {
                                console.log("User password updated successfully");
                                //hide modal when done
                                $("#editAccountModal").modal("hide");
                            }).catch((error) =>{
                                console.log(error);
                            })
                        }).catch((error) => {
                            console.log(error);
                        })
                    }else{
                        console.log("password confirmation does not match");
                    }
                }
            })
            //Cancel account edit button
            $("#cancelAccountEdit").on("click", function(){
                $("#email").val(user.email);
                //hide modal, default input fields
                $("#editAccountModal").modal("hide");
                $("#password, .passField>input").val("");
            })
            //Check new and confirm password fields match
            $("#newPassword, #confirmNewPassword").on("keyup", function(){
                if($("#newPassword").val() == $("#confirmNewPassword").val()){
                    $("#warnMsg").text("");
                    passMatch = true;
                }else{
                    $("#warnMsg").text("Not Matching").css("color", "red");
                    passMatch = false;
                }
            })
        }
    });

    function displayUserInfo(data, user) {
        newdob = new Date(data.dob.replaceAll("-", "\/"));
        $("#userDisplay>th").text(data.name + "'s Profile");
        $("#nameDisplay>td:first").text("Name:");
        $("#nameDisplay>td:last").text(data.name);
        $("#emailDisplay>td:first").text("Email:");
        $("#emailDisplay>td:last").text(user.email);
        $("#dobDisplay>td:first").text("Date of Birth:");
        $("#dobDisplay>td:last").text(newdob.toLocaleDateString());
        $("#bmrDisplay>td:first").text("BMR");
        $("#bmrDisplay>td:last").text(data.bmr);
        $("#sexDisplay>td:first").text("Sex:");
        $("#sexDisplay>td:last").text(data.sex);
    }
    function defaultProfileEditFields(data) {
        $("#name").val(data.name);
        $("#dob").val(data.dob);
        $("#bmr").val(data.bmr);
        $("#sex").val(data.sex);
    }
})