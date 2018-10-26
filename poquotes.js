//Use a namespace to protect the scope of function and variable names
var poq = {
	//Some variables global to the local namespace ("poq")
	root: "http://localhost:5984/",
	dbroot: "db/",
	max_quotes: 6,

	//Invoked when the HTML page is first loaded
	loadPage: function()
	{
		var six_latest = poq.root + "poquotes/_design/poquotes/_view/by_year?&limit="
			+ poq.max_quotes + "&descending=true&callback=?";
		$.getJSON(six_latest, poq.handleMainQuotes);
		$('#donewquote').click(function() {
			var db_link = poq.dbroot + "poquotes";
			var record = {
				"type": "quote",
				"author": $("#author").val(),
				"text": $("#text").val(),
				"work": {
					"title": $("#title").val(),
					"link": $("#link").val(),
					"year": parseInt($("#year").val())
				}
			};
			$.ajax({
				url : db_link,
				data : JSON.stringify(record),
				contentType : "application/json", 
				type : 'POST',
				processData : false,
				dataType : "json",
				success : function(resp) {
					alert("New document created: " + JSON.stringify(resp));
				}
			});
			return false;
		});
		//Set up the collapsible form for adding new quotes
		$('#popup').click(function(){
			$("#newquote").slideToggle();
		});
		//Start out with the create quote form collapsed
		$("#newquote").slideToggle();
	},

	//Invoked with the result of the AJAX call to load quote documents
	handleMainQuotes: function(json)
	{
		//Load up to six records, as available
		quote_count = Math.min(poq.max_quotes, json["total_rows"])
		for (var i=0; i<quote_count; i++) {
			var doc = json["rows"][i]["value"]
			var year = doc["work"]["year"].toString()
			var title = doc["work"]["title"].toString()
			var link = doc["work"]["link"].toString()

			//Create an HTML snippet from the fields of each quote document
			qblock = $("<div class='span4 featured-quote'></div>")
			  .append("<h2>" + doc["author"] + "</h2>")
			  .append("<p style='font-size: 80%; height: 8em;'>" + doc["text"] + "</p>")
			  .append("<p>" + year + "</p>")
			  .append("<p><a href='" + link + "'>" + title + "</a></p>")
			  .append("<p><a class='btn' href='#'>View details &raquo;</a></p>")
			//jQuery's eq selector to find the target div corresponding to the loop index
			$('div.featured-quote:eq(' + i.toString() + ')').replaceWith(qblock);
		}
	},
}

//Invoked once the main HTML DOM is ready
$(document).ready(function()
{
	poq.loadPage();
});
