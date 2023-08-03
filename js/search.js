//Global variables for tracking additional calories, experience/cals.
let maxCalories, exp, currentCalories, totalBurnedCalories, newTotal, globalCals = 0;
//Global flag for whether data is logged, used for reset.
let isLogged = false;

//Global struct for logging most recent food
let loggedFood = {
    food_name: null,
    serving_qty: null,
    serving_unit: null,
    nf_calories: null,
    nf_protein: null,
    nf_total_carbohydrate: null,
    nf_total_fat: null,
    photo: null
  };

//The following the AJAX request to the API.
$('#searchForm').submit(function(event) {
  event.preventDefault();
  var searchTerm = $('#searchInput').val();
  $.ajax({
    url: 'https://trackapi.nutritionix.com/v2/natural/nutrients',
    type: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-app-id': 'fa05f1e2',
      'x-app-key': '11c5ca881ed9dde7c9647dda9d61d436',
    },
    data: JSON.stringify({
      query: searchTerm,
    }),
    success: function(response) {

      // TEST    --- successfully found search result
      //             showing log button for user to log food
      console.log("Food Search Found!");
      $("#logButton").removeClass("d-none");

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

      // Assuming the logged food data is available in the 'response' object, update the loggedFood.
      loggedFood = {
        food_name: response.foods[0].food_name,
        serving_qty: response.foods[0].serving_qty,
        serving_unit: response.foods[0].serving_unit,
        nf_calories: response.foods[0].nf_calories,
        nf_protein: response.foods[0].nf_protein,
        nf_total_carbohydrate: response.foods[0].nf_total_carbohydrate,
        nf_total_fat: response.foods[0].nf_total_fat,
        photo: response.foods[0].photo.thumb
      };

      // Iterate through each food item and create table rows w/ data from API
      response.foods.forEach(function(food) {
        var row = $('<tr>');
        row.append($('<td>').text(food.food_name));
        row.append($('<td>').text(food.serving_qty + ' ' + food.serving_unit));
        row.append($('<td>').text(food.nf_calories));
        row.append($('<td>').text(food.nf_protein));
        row.append($('<td>').text(food.nf_total_carbohydrate));
        row.append($('<td>').text(food.nf_total_fat));

        // Create an image cell in table for the food photo thumbnail
        var imageCell = $('<td>');
        var foodImage = food.photo.thumb;
        var $image = $('<img>').attr('src', foodImage);
        imageCell.append($image);
        row.append(imageCell);
        foodTable.append(row);
        // Update the totals based on retrieved data
        totals.Calories += food.nf_calories;
        totals.Protein += food.nf_protein;
        totals.Carbs += food.nf_total_carbohydrate;
        totals.Fat += food.nf_total_fat;
      });
      //console.clear();
      console.log("totals.calories:", totals.Calories);
      console.log("exp:", exp);
      newTotal = totals.Calories + exp;
      globalCals = totals.Calories;
      console.log("newTotal:", newTotal);
      updateCaloriesProgressBar(newTotal); //Reflect the new value in the exp bar
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
      alert('Food not found!'); //Error handling if food not found. Maybe a modal in final prod?
    },
  });
});

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
          initCaloriesProgressBar(exp, maxCalories);
          //TEST   $('#loginFields').addClass('d-none');
          //TEST   $('.member').removeClass('d-none'); // Show member-only links
          $('#logButton').click(function() {
            //calculate and log current calories
            currentCalories = parseFloat($('#caloriesText').text().split('/')[0]);
            console.log('current cals is ', currentCalories);
            console.log('exp is before update ',exp);
            exp += currentCalories;
            // Update the user's 'exp' field in Firestore by adding the new calories
            db.collection("user").doc(userUID).update({
              exp: currentCalories,
              lastFood: loggedFood,
            })
            .then(function() {
              // TEST    --- Seeing cals to add before added
              
              console.log("CALS TO ADD BEFORE ADDED AND CLEARED:", currentCalories);              
              console.log('exp is now ', exp);
              updateCaloriesProgressBar(currentCalories);
              console.log('Calories logged successfully!');
              //currentCalories = 0;
              console.log('Current Calories is now: ', currentCalories);
              console.log('Last food is ', loggedFood);
              $("#logButton").addClass("d-none");
              isLogged = true;
              // Might want to add a success message to the user?
            })
            .catch(function(error) {
              console.error('Error logging calories: ', error);
              // Do we need additional error handling or modals?
            });
          });
        } else {
          $('#loginFields').removeClass('d-none');
          $('.member').addClass('d-none'); // Hide member-only links
        }
      })
    }
  });
    $('#clearButton').click(function() {
      clearCaloriesBar();
      //TEST -- hide log button once search is cleared
      //        so user can't log a food that's been cleared
      $("#logButton").addClass("d-none")
    });

    $('#resetEXP').click(function() {
      resetEXP(); //Call reset function on reset press
    });
    //The following is a call for exercise results.
    $('#exerciseForm').submit(function(event) {
      event.preventDefault();
      var searchTerm = $('#exerciseInput').val();
      $.ajax({
        url: 'https://trackapi.nutritionix.com/v2/natural/exercise',
        type: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-app-id': 'fa05f1e2',
          'x-app-key': '11c5ca881ed9dde7c9647dda9d61d436',
        },
        data: JSON.stringify({
          query: searchTerm,
        }),
        success: function(exerciseResponse) {
          // Clear previous search results
          $('#exerciseResults').empty();
          console.log("Exercise Search Found!");
          $("#logButton").removeClass("d-none");
          
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
          totalBurnedCalories = 0;
          // Iterate through each exercise item and create table rows
          exerciseResponse.exercises.forEach(function(exercise) {
            var row = $('<tr>');
            row.append($('<td>').text(exercise.name));
            row.append($('<td>').text(exercise.duration_min));
            row.append($('<td>').text(exercise.nf_calories));
            exerciseTable.append(row);
            // Update the total burned calories
            totalBurnedCalories += exercise.nf_calories;
            console.log('calories is: ', totalBurnedCalories)
          });
          // Subtract the burned calories from the total
           currentCalories = parseFloat($('#caloriesText').text().split('/')[0]);
           remainingCalories = currentCalories - totalBurnedCalories;
           updateCaloriesProgressBar(remainingCalories); //Update the exp bar with the burned cals
          // Append the exercise table to the search results div
          $('#exerciseResults').append(exerciseTable);
        },
        error: function(xhr, status, error) {
          console.error('Error:', error);
          alert('Exercise not found!'); //Error handling in case of exercise input issue
        },
      });
    });

  });

  //The following function initializes the exp bar w/ the user's BMR and current exp
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
    deficitPercentage = Math.abs(exp / maxCalories) * 100;
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

//Reload the page on whether or not food/exercise logged, and log or clear based on press.
function clearCaloriesBar() {
  if(!isLogged){
    clearTables();
    clearSearchBars();
    newTotal -= globalCals;
    console.log ('newTotal is now, ', newTotal);
    console.log('Assuming true initially, isLogged is currently: ', isLogged);
  } else {
    clearTables();
    clearSearchBars();
    console.log('Assuming false initially, isLogged is currently: ', isLogged);
  }
  isLogged = false;
  location.reload();    
}

//wipe exp from firestore and replace with 0.
function resetEXP() {
  exp = 0;
  const user = auth.currentUser;
  if (user) {
    const userUID = user.uid;
    db.collection("user").doc(userUID).update({
      exp: 0,
      lastFood: null
    })
    .then(function() {
      // After updating the 'exp' field in Firestore, update the exp bar to 0 and clear the tables and search bars
      updateCaloriesProgressBar(0);
      clearTables();
      clearSearchBars();
      console.log('EXP reset successfully!');
      console.log('Last food reset to NULL!');
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