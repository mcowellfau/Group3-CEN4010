$(document).ready(function() {
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

          updateCaloriesProgressBar(totals.Calories);
  
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
  });
  
// Update the calories progress bar
function updateCaloriesProgressBar(calories) {
    var maxCalories = 2000; // Absolute max of the bar is 2000 calories
    var percentage = (calories / maxCalories) * 100;
    $('#caloriesBar').css('width', percentage + '%');
    $('#caloriesText').text(calories.toFixed(2) + '/' + maxCalories);

    if (calories >= maxCalories) {
        $('#caloriesBar').addClass('full');
      } else {
        $('#caloriesBar').removeClass('full');
    }
}