$(document).ready(function () {
    var userPersInfo = {
        name: null,
        dob: null,
        bmr: null,
        sex: null,
        exp: null,
    };
    uif = $("#userInfoFields");
    epf = $("#emailPassFields");
    //Signup Buttons
    uif.on("submit", function(event){
        event.preventDefault();
        var name = $("#name").val();
        var dob = $("#dob").val();
        var bmr = $("#bmr").val();
        var sex = $("#sex").find(":selected").val();
        //Storing user info into userPersInfo
        userPersInfo.name = name;
        userPersInfo.dob = dob;
        userPersInfo.bmr = bmr;
        userPersInfo.sex = sex;
        userPersInfo.exp = 0;
        console.log("User Info:", userPersInfo);
        //revealing email and password fields, hiding info fields
        uif.addClass("d-none");
        epf.removeClass("d-none");
    })
    epf.on("submit", function(event){
        event.preventDefault();
        var email = $("#email").val();
        var password = $("#password").val();
        auth.createUserWithEmailAndPassword(email, password).then(cred => {
            //Creation success
            console.log(cred.user.email + " has signed up");
            //Adding information to database
            setUserInfo(cred.user.uid);
            //Redirect to home inside setUserInfo
        }).catch((error) => {
            console.log("Error code: " + error.code);
            alert("Error message: " + error.message);
        })
    })
    //Login button
    $("#loginFields").on("submit", function(event){
        event.preventDefault();
        var email = $("#email").val();
        var password = $("#password").val();
        auth.signInWithEmailAndPassword(email, password).then(cred => {
            //login success
            console.log(cred.user.email + " has logged in");
            //Redirect to home after login
            window.location.href="home.html";
        }).catch((error) => {
            console.log("Error code: " + error.code);
            alert("Error message: " + error.message);
        });
    })
    //Logout button
    $("#signout").on("click", function(){
        auth.signOut().then(() => {
            console.log("User successfully signed out");
            window.location.href="index.html";
        })
    })

    //other functions for login/signup
    function setUserInfo(userUID) {
        db.collection("user").doc(userUID).set({
            name: userPersInfo.name,
            dob: userPersInfo.dob,
            bmr: userPersInfo.bmr,
            sex: userPersInfo.sex,
            exp: userPersInfo.exp,
            lastFood: userPersInfo.lastFood,
        }).then(() => {
            console.log("Successfully set user info");
            window.location.href="home.html";
        }).catch((error) => {
            console.log(error);
        });
    }
})