$(document).ready( function() {
	$('.unanswered-getter').submit( function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val();
		getUnanswered(tags);
	});
	$('.inspiration-getter').submit( function(event){
		//zero out results
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags2 = $(this).find("input[name='answerers']").val();
		getInspiration(tags2);
		// console.log(tags2)
	})
});

// this function takes the question object returned by StackOverflow 
// and creates new result to be appended to DOM
var showQuestion = function(question) {
	
	// clone our result template code
	var result = $('.templates .question').clone();
	
	// Set the question properties in result
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link);
	questionElem.text(question.title);

	// set the date asked property in result
	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date);
	asked.text(date.toString());

	// set the #views for question property in result
	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	// set some properties related to asker
	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
													question.owner.display_name +
												'</a>' +
							'</p>' +
 							'<p>Reputation: ' + question.owner.reputation + '</p>'
	);

	return result;
};

// this function takes the question object returned by StackOverflow 
// and creates new result to be appended to DOM
var showInspiration = function(inspiration) {
	
	// clone our result template code
	var result = $('.templates .answerer').clone();
	
	// Set the question properties in result
	var questionElem = result.find('.userID a');
	questionElem.attr('href', inspiration.user.link);
	questionElem.text(inspiration.user.display_name);
	// console.log(inspiration.post_count);
	// console.log(inspiration.user.display_name)

	// set the date asked property in result
	var reputation = result.find('.reputation');
	reputation.text(inspiration.user.reputation);

	// set the #views for question property in result
	var postcount = result.find('.postcount');
	postcount.text(inspiration.post_count);

	// set some properties related to asker
	var score = result.find('.score');
	score.text(inspiration.score)
	// asker.html('<p>Name: <a target="_blank" href=http://stackoverflow.com/users/' + inspiration.user_id + ' >' +
													// inspiration.display_name +
												// '</a>' +
							// '</p>' +
 							// '<p>Reputation: ' + inspiration.reputation + '</p>'
	// );

	return result;
};

// // showInspiration code
// // this function takes the user object returned by StackOverflow 
// // and creates new result to be appended to DOM
// var showInspiration = function() {	
// 	//clone our result template
// 	var result = $('.templates .question').clone();
// 	// Set the question properties in result
// 	var questionElem = result.find('.question-text a');
// 	questionElem.attr('href', question.link);
// 	questionElem.text(question.title);
// }

// this function takes the results object from StackOverflow
// and creates info about search results to be appended to DOM
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query;
	return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getUnanswered = function(tags) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request = {tagged: tags,
								site: 'stackoverflow',
								order: 'desc',
								sort: 'creation'};
	
	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		dataType: "jsonp",
		type: "GET",
		})
	.done(function(result){
		var searchResults = showSearchResults(request.tagged, result.items.length);

		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) {
			var question = showQuestion(item);
			$('.results').append(question);
	// console.log(item)
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};

var getInspiration = function(tags2) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request2 = {tagged: tags2,
								site: 'stackoverflow',
								order: 'desc',
								sort: 'creation'};
	
	var result2 = $.ajax({
		url: "http://api.stackexchange.com/2.2/tags/"+ tags2 + "/top-answerers/all_time",
		data: request2,
		dataType: "jsonp",
		type: "GET",
		})
	.done(function(result2){
		console.log(JSON.stringify(result2.items[0].post_count))
		var searchResults = showSearchResults(request2.tagged, result2.items.length);
		console.log(result2.items);
		$('.search-results').html(searchResults);

		$.each(result2.items, function(i, item) {
			var inspiration = showInspiration(item);
			$('.results').append(inspiration);
	// console.log(item);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};



