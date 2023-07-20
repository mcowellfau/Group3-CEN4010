$(document).ready(function(){
    auth.onAuthStateChanged((user) => {
        if (user) {
            //user is logged in
            //Changing link in logo to home page instead of front page
            $("[href='index.html']").prop("href", "home.html");
            console.log(user.email + " is logged in")
            $("#logoutBtn").removeClass("d-none");
            $(".member").removeClass("d-none");
            console.log("Login Fields hidden");
        } else {
            //no user is logged in or user signed out
            console.log("no user is logged in")
            $("#loginFields").removeClass("d-none");
            console.log("member links hidden");
        }
    });
})