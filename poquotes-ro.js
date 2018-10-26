//Use a namespace to protect the scope of function and variable names
var poq = {
	//Some variables global to the local namespace ("poq")
	root: "http://localhost:5984/",
	max_quotes: 6,

	//Invoked to load the target divs with documents from CouchDB
	loadPage: function()
	{
		var six_latest = poq.root + "poquotes/_design/poquotes/_view/by_year?&limit="
			+ poq.max_quotes + "&descending=true&callback=?";
		$.getJSON(six_latest, poq.handleMainQuotes);
	},

	//Invoked with the result of the AJAX call to load quote documents
	handleMainQuotes: function(json)
	{
		//alert(Math.min(6, json["total_rows"]))
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
	}
}

//Invoked once the main HTML DOM is ready
$(document).ready(function()
{
	poq.loadPage();
});
