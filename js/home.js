$(document).ready(function() {
    //checking if user is authenticated w/ firebase
    auth.onAuthStateChanged((user) => {
      if (user) {
        const userUID = user.uid;
        //get user info
        db.collection("user").doc(userUID).get().then((doc) => {
          if (doc.exists) {
            console.log("User Data:", doc.data());
            maxCalories = doc.data().bmr;
            exp = doc.data().exp; //retrieve exp val
            var lastFood = doc.data().lastFood;
            console.log("Last food is ", lastFood);
            
            // Create and append the food table inside the promise callback
            var foodTable = $('<table>').addClass('searchTable');
            var headers = ['Food', 'Serving Size', 'Calories', 'Protein', 'Carbs', 'Fat', 'Image'];
            var headerRow = $('<tr>');
            headers.forEach(function(header) {
              headerRow.append($('<th>').text(header));
            });
            foodTable.append(headerRow);
  
            // Create a single row for the table with the lastFood data
            var row = $('<tr>');
            row.append($('<td>').text(lastFood.food_name));
            row.append($('<td>').text(lastFood.serving_qty + " " + lastFood.serving_unit));
            row.append($('<td>').text(lastFood.nf_calories));
            row.append($('<td>').text(lastFood.nf_protein));
            row.append($('<td>').text(lastFood.nf_total_carbohydrate));
            row.append($('<td>').text(lastFood.nf_total_fat));
            row.append($('<td>').append($('<img>').attr('src', lastFood.photo)));
            foodTable.append(row);
  
            // Append the food table to the #lastFood div
            $('#lastFood').append(foodTable);
          }
        });
      }
    });
  });
  