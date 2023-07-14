$(document).ready(function(){
    var userPersInfo = {
        name: null,
        dob: null,
        sex: null,
    };
    supOpt = $(".signupOpt");
    logOpt = $(".loginOpt");
    uif = $("#userInfoFields");
    epf = $("#emailPassFields");
    uif.hide();
    $("#profileInfo").hide();
    supOpt.hide();

    //Swap to sign up option
    //user will fill out their personal information first
    $(".stSignup").click(function(){
        supOpt.show();
        logOpt.hide();
        epf.hide();
        uif.show();
        //Reset input
        $("input").val("");
        $("select").val("");
    });
    //Swap to login option
    $(".stLogin").click(function(){
        logOpt.show();
        supOpt.hide();
        epf.show();
        uif.hide();
        //Reset input
        $("input").val("");
        $("select").val("");
    });

    //For signup and login and signout buttons
    //signup button
    $("#signup").click(function(){
        //getting email and password entered
        email = $("#email").val();
        password = $("#password").val();
        auth.createUserWithEmailAndPassword(email, password).then(cred => {
            //creation success
            console.log(cred.user.email + " has signed up");
            epf.hide();
            auth.signInWithEmailAndPassword(email, password).then(cred => {
                //login success
                console.log(cred.user.email + " has logged in");
                setUserInfo(cred.user.uid);
                welcomeUserProfile(cred.user.uid);
            });
        }).catch((error) => {
            switch (error.code) {
                case 'auth/email-already-in-use':
                  alert(`Email address ${this.state.email} already in use.`);
                  break;
                case 'auth/invalid-email':
                  alert(`Email address ${this.state.email} is invalid.`);
                  break;
                case 'auth/operation-not-allowed':
                  alert(`Error during sign up.`);
                  break;
                case 'auth/weak-password':
                  alert('Password is not strong enough. Add additional characters including special characters and numbers.');
                  break;
                case 'auth/wrong-password':
                  alert("Password incorrect. Please re-enter password.");
                  break;
                default:
                  alert(error.message);
                  break;
              }
        });
    });
    //login button
    $("#login").click(function(){
        //getting email and password entered
        email = $("#email").val();
        password = $("#password").val();
        auth.signInWithEmailAndPassword(email, password).then(cred => {
            //login success
            console.log(cred.user.email + " has logged in");
            epf.hide();
            welcomeUserProfile(cred.user.uid);
            //Reset input
            $("input").val("");
            $("select").val("");
        }).catch((error) => {
            console.log("Error code: " + error.code);
            alert("Error message: " + error.message);
        });
    });

    //for taking user info
    uif.submit(function(event){
        event.preventDefault();
        var name = $("#name").val();
        var dob = $("#dob").val();
        var sex = $("#sex").find(":selected").val();
        //Storing user info
        userPersInfo.name = name;
        userPersInfo.dob = dob;
        userPersInfo.sex = sex;
        uif.hide();
        epf.show();
        console.log("user info:", userPersInfo);
    });
    $("#signout").click(function(){
        auth.signOut().then(() => {
            console.log("User successfully signed out");
            $("#userDisplay").html("");
            $("#nameDisplay").html("");
            $("#dobDisplay").html("");
            $("#sexDisplay").html("");
            supOpt.hide();
            logOpt.show();
            epf.show()
            $("#profileInfo").hide()
        }).catch((error) => {
            console.log(error);
        });
    });

    function setUserInfo(userUID) {
        db.collection("user").doc(userUID).set({
            name: userPersInfo.name,
            dob: userPersInfo.dob,
            sex: userPersInfo.sex,
        }).then(() => {
            console.log("Successfully set user info");
        }).catch((error) => {
            console.log(error);
        });
    }
    function welcomeUserProfile(userUID){
        $("#profileInfo").show();
        db.collection("user").doc(userUID).get().then((doc) => {
            if (doc.exists) {
                console.log("user data:", doc.data());
                alert("Welcome " + doc.data().name + "!");
                displayUserInfo(doc.data());
            }
        });
    }
    function displayUserInfo(data) {
        console.log("user data:", data);
        userDOB = new Date(data.dob.replaceAll("-", "\/"));
        $("#userDisplay").html("<td>" + data.name + "'s Profile</td>");
        $("#nameDisplay").html("<td>Name:</td>" + "<td>" + data.name + "</td>");
        $("#dobDisplay").html("<td>Date of Birth:</td>" + "<td>" + userDOB.toLocaleDateString() + "</td>");
        $("#sexDisplay").html("<td>Sex:</td>" + "<td>" + data.sex + "</td>");
    }
});

const home = document.getElementById('homeButton');
home.addEventListener('click', function() {
  window.location.href = 'index.html'
});