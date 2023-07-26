$(document).ready(function(){
    auth.onAuthStateChanged((user) => {
        if (user) {
            //user is signed in
            var uid = user.uid;
            console.log(uid + " is already logged in");
            window.location.href="home.html";
        } else {
            //user is signed out or no user signed in
            console.log("No user is logged in");
            $("#goToSignup").on("click", function(){
                window.location.href="signup.html";
            });
        }
    })
})