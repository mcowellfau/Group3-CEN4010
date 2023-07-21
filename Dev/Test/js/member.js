$(document).ready(function(){
    auth.onAuthStateChanged((user) => {
        if (user) {
            //user is logged in
            console.log(user.email + " is logged in");
            var userUID = user.uid;
            $("[href='index.html']").prop("href", "home.html");
            $("#logoutBtn").removeClass("d-none");
            $(".member").removeClass("d-none");
            console.log("Login Fields hidden");
            db.collection("user").doc(userUID).get().then((doc) => {
                if (doc.exists) {
                    console.log("User Data:", doc.data());
                    var name = doc.data().name;
                    $("#username>span").text("Hi " + name + "!");
                }
            })
            
        } else {
            //no user is logged in or user signed out
            $("[href='search.html']").prop("href", "search_nonmember");
            console.log("no user is logged in")
            $("#loginFields").removeClass("d-none");
            console.log("member links hidden");
        }
    });
})