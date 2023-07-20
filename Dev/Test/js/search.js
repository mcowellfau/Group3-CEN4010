let maxCalories, exp;

$(document).ready(function() {
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
          maxCalories = doc.data().bmr;
          exp = doc.data().exp;
          initCaloriesProgressBar(exp, maxCalories);
          $('#loginFields').addClass('d-none');
          $('.member').removeClass('d-none'); // Show member-only links
          $('#logButton').click(function() {
            var currentCalories = parseFloat($('#caloriesText').text().split('/')[0]);
            var caloriesToAdd = currentCalories; // Modify this if you want to log a different value
            // Update the user's 'exp' field in Firestore by adding the new calories
            db.collection("user").doc(userUID).update({
              exp: exp + caloriesToAdd
            })
            .then(function() {
              exp += caloriesToAdd;
              updateCaloriesProgressBar(exp);
              console.log('Calories logged successfully!');
              // You can add any additional actions here, such as displaying a success message to the user
            })
            .catch(function(error) {
              console.error('Error logging calories: ', error);
              // You can handle errors here, such as displaying an error message to the user
            });
          });
        } else {
          $('#loginFields').removeClass('d-none');
          $('.member').addClass('d-none'); // Hide member-only links
        }
      })
    }
  });

  $('#searchForm').submit(function(event) {
      event.preventDefault();
      var searchTerm = $('#searchInput').val();
      $.ajax({
        url: 'https://trackapi.nutritionix.com/v2/natural/nutrients',
        type: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-app-id': '829b344f',
          'x-app-key': 'fc998f3f193cf70fcf5964765bfe50e8',
        },
        data: JSON.stringify({
          query: searchTerm,
        }),
        success: function(response) {
          // Clear previous search results
          $('#searchResults').empty();
  
          // Create a table for food items
          var foodTable = $('<table>').addClass('searchTable');
  
          // Create and append table headers
          var headers = ['Food', 'Serving Size', 'Calories', 'Protein', 'Carbs', 'Fat', 'Image'];
          var headerRow = $('<tr>');
          headers.forEach(function(header) {
            headerRow.append($('<th>').text(header));
          });
          foodTable.append(headerRow);
  
          // Calculate the totals for each column
          var totals = {
            Calories: 0,
            Protein: 0,
            Carbs: 0,
            Fat: 0,
          };
  
          // Iterate through each food item and create table rows
          response.foods.forEach(function(food) {
            var row = $('<tr>');
            row.append($('<td>').text(food.food_name));
            row.append($('<td>').text(food.serving_qty + ' ' + food.serving_unit));
            row.append($('<td>').text(food.nf_calories));
            row.append($('<td>').text(food.nf_protein));
            row.append($('<td>').text(food.nf_total_carbohydrate));
            row.append($('<td>').text(food.nf_total_fat));
  
            // Create an image cell
            var imageCell = $('<td>');
            var foodImage = food.photo.thumb;
            var $image = $('<img>').attr('src', foodImage);
            imageCell.append($image);
            row.append(imageCell);
            foodTable.append(row);
            // Update the totals
            totals.Calories += food.nf_calories;
            totals.Protein += food.nf_protein;
            totals.Carbs += food.nf_total_carbohydrate;
            totals.Fat += food.nf_total_fat;
          });

          updateCaloriesProgressBar(totals.Calories + exp);
          // Round the total values to two decimals
          totals.Calories = totals.Calories.toFixed(2);
          totals.Protein = totals.Protein.toFixed(2);
          totals.Carbs = totals.Carbs.toFixed(2);
          totals.Fat = totals.Fat.toFixed(2);
          // Create a separate table for the totals
          var totalsTable = $('<table>').addClass('totalsTable');
          // Create and append table headers for totals
          var totalsHeaders = ['', 'Calories', 'Protein', 'Carbs', 'Fat'];
          var totalsHeaderRow = $('<tr>');
          totalsHeaders.forEach(function(header) {
            totalsHeaderRow.append($('<th>').text(header));
          });
          totalsTable.append(totalsHeaderRow);
          // Create the totals row
          var totalsRow = $('<tr>');
          totalsRow.append($('<td>').html('<strong>Totals:</strong>'));
          totalsRow.append($('<td>').text(totals.Calories));
          totalsRow.append($('<td>').text(totals.Protein));
          totalsRow.append($('<td>').text(totals.Carbs));
          totalsRow.append($('<td>').text(totals.Fat));
          totalsTable.append(totalsRow);
          // Append the food table to the search results div
          $('#searchResults').append(foodTable);
          // Append the totals table to the search results div
          $('#searchResults').append(totalsTable);
        },
        error: function(xhr, status, error) {
          console.error('Error:', error);
          alert('Food not found!');
        },
      });
    });
    $('#clearButton').click(function() {
      clearCaloriesBar();
    });

    $('#resetEXP').click(function() {
      resetEXP();
    });

    $('#exerciseForm').submit(function(event) {
      event.preventDefault();
      var searchTerm = $('#exerciseInput').val();
      $.ajax({
        url: 'https://trackapi.nutritionix.com/v2/natural/exercise',
        type: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-app-id': '829b344f',
          'x-app-key': 'fc998f3f193cf70fcf5964765bfe50e8',
        },
        data: JSON.stringify({
          query: searchTerm,
        }),
        success: function(exerciseResponse) {
          // Clear previous search results
          $('#exerciseResults').empty();
  
          // Create a table for exercise items
          var exerciseTable = $('<table>').addClass('searchTable');
          // Create and append table headers
          var exerciseHeaders = ['Exercise', 'Duration (min)', 'Calories Burned'];
          var exerciseHeaderRow = $('<tr>');
          exerciseHeaders.forEach(function(header) {
            exerciseHeaderRow.append($('<th>').text(header));
          });
          exerciseTable.append(exerciseHeaderRow);
          // Calculate the total burned calories
          var totalBurnedCalories = 0;
          // Iterate through each exercise item and create table rows
          exerciseResponse.exercises.forEach(function(exercise) {
            var row = $('<tr>');
            row.append($('<td>').text(exercise.name));
            row.append($('<td>').text(exercise.duration_min));
            row.append($('<td>').text(exercise.nf_calories));
            exerciseTable.append(row);
            // Update the total burned calories
            totalBurnedCalories += exercise.nf_calories;
          });
          // Subtract the burned calories from the total
          var currentCalories = parseFloat($('#caloriesText').text().split('/')[0]);
          var remainingCalories = currentCalories - totalBurnedCalories;
          // Append the exercise table to the search results div
          $('#exerciseResults').append(exerciseTable);
        },
        error: function(xhr, status, error) {
          console.error('Error:', error);
          alert('Exercise not found!');
        },
      });
    });
    
  });

function initCaloriesProgressBar(exp, maxCalories) {
  var minCalories = 0;
  var deficitPercentage = 0;
  if (exp < minCalories) {
    deficitPercentage = Math.abs(exp / maxCalories) * 100;
    $('#caloriesBar').addClass('deficit');
  } 
  else {
    $('#caloriesBar').removeClass('deficit');
  }
  if (exp > maxCalories) {
    deficitPercentage = Math.abs(calories / maxCalories) * 100;
    $('#caloriesBar').addClass('full');
  } 
  else {
    $('#caloriesBar').removeClass('full');
  }
  // Calculate the remaining calories percentage
  var remainingPercentage = Math.max(0, (exp - minCalories) / maxCalories) * 100;
  // Update the main progress bar width
  $('#caloriesBar').css('width', remainingPercentage + '%');
  // Update the deficit bar width
  $('#deficitBar').css('width', deficitPercentage + '%');
  // Update the calories text
  $('#caloriesText').text(exp.toFixed(2) + '/' + maxCalories);
}
  // Update the calories progress bar
function updateCaloriesProgressBar(calories) {
  var minCalories = 0;
  // Calculate the deficit percentage
  var deficitPercentage = 0;
  if (calories + exp < minCalories) {
    deficitPercentage = Math.abs(calories / maxCalories) * 100;
    $('#caloriesBar').addClass('deficit');
  } 
  else {
    $('#caloriesBar').removeClass('deficit');
  }
  if (calories + exp > maxCalories) {
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

function clearCaloriesBar() {
  updateCaloriesProgressBar(exp);
  clearTables();
  clearSearchBars();
}

function resetEXP() {
  exp = 0;
  const user = auth.currentUser;
  if (user) {
    const userUID = user.uid;
    db.collection("user").doc(userUID).update({
      exp: 0
    })
    .then(function() {
      // After updating the 'exp' field in Firestore, update the calories progress bar and clear the tables and search bars
      updateCaloriesProgressBar(0);
      clearTables();
      clearSearchBars();
      console.log('EXP reset successfully!');
    })
    .catch(function(error) {
      console.error('Error resetting EXP: ', error);
    });
  }
}

function clearTables() {
  $('#searchResults').empty();
  $('#exerciseResults').empty();
}

function clearSearchBars() {
  $('#searchInput').val('');
  $('#exerciseInput').val('');
}
