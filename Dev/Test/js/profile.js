$(document).ready(function(){
    auth.onAuthStateChanged((user) => {
        if (user) {
            const userUID = user.uid;
            //get user info
            db.collection("user").doc(userUID).get().then((doc) => {
                if (doc.exists) {
                    console.log("User Data:", doc.data());
                    var name = doc.data().name;
                    var dob = doc.data().dob;
                    var sex = doc.data().sex;
                    dob = new Date(dob.replaceAll("-", "\/"));
                    $("#userDisplay").html("<td>" + name + "'s Profile</td>");
                    $("#nameDisplay").html("<td>Name:</td>" + "<td>" + name + "</td>");
                    $("#dobDisplay").html("<td>Date of Birth:</td>" + "<td>" + dob.toLocaleDateString() + "</td>");
                    $("#sexDisplay").html("<td>Sex:</td>" + "<td>" + sex + "</td>");
                }
            })
        }
    });

})