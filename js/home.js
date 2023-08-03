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
            var maxCalories = doc.data().bmr;
            console.log("Last food is ", lastFood);
            maxCalText = parseFloat($('#caloriesText').text().split('/')[0]);
            $('#caloriesText').text(exp.toFixed(2) + '/' + maxCalories);
            if(lastFood.food_name != null) {
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

            //location.reload();  
            // Append the food table to the #lastFood div
            $('#lastFood').append(foodTable);
            updateCaloriesProgressBar(exp);
          }
        }

          function updateCaloriesProgressBar(calories) {
            var minCalories = 0;
            // Calculate the deficit percentage
            var deficitPercentage = 0;
            if (calories < minCalories) {
              deficitPercentage = Math.abs((calories - minCalories) / maxCalories) * 100;
              $('#caloriesBar').addClass('deficit');
            } 
            else {
              $('#caloriesBar').removeClass('deficit');
            }
            if (calories > maxCalories) {
              deficitPercentage = Math.abs(calories / maxCalories) * 100;
              $('#caloriesBar').addClass('full');
            } 
            else {
              $('#caloriesBar').removeClass('full');
            }
            // Calculate the remaining calories percentage
            var remainingPercentage = Math.max(0, (calories - minCalories) / maxCalories) * 100;
            // Update the main progress bar width
            $('#caloriesBar').css('width', remainingPercentage + '%');
            // Update the deficit bar width
            $('#deficitBar').css('width', deficitPercentage + '%');
            // Update the calories text
            $('#caloriesText').text(calories.toFixed(2) + '/' + maxCalories);
          }
        });
      }
    });
  });
  