var searchTerm; // the term that is searched
var myCity; // name of the city
var myCityScore; // teleport score of the city


/*========== Drawing the City Score ==========*/
var tau = 2 * Math.PI;

var arc = d3.arc()
	.innerRadius(170)
	.outerRadius(220)
	.startAngle(0);

var svg1 = d3.select(".CSArc"),
	CSwidth = +svg1.attr("width"),
	CSheight = +svg1.attr("height"),
	g = svg1.append("g").attr("transform", "translate(" + CSwidth/2 + "," + CSheight/2 + ")");

var background = g.append("path")
	.datum({endAngle: tau})
	.style("fill", "#FFFFFF")
	.attr("d", arc);

var foreground = g.append("path")
	.datum({endAngle: 0 * tau})
	.style("fill", "#EFB509")
	.attr("d", arc)
	.attr("d", arc.cornerRadius(30));

var totalScore = svg1.append("text")
   	.attr("id", "totalScore")
   	.attr("x", CSwidth/2)
   	.attr("y", CSheight/2)
   	.attr("text-anchor", "middle")
   	.style("font-family", "'Dosis', sans-serif")
   	.style("fill", "white")
   	.style("font-size", "38px");
// Displaying the name of the city on top of the city score
svg1.append("path")
	.attr("id", "circular")
	.attr("d", "M 110,360 A 200,200 0 0,1 610,360")
	.style("fill", "none")
	.style("stroke", "none");

var theCityName = svg1.append("text")
	.append("textPath")
	.attr("xlink:href", "#circular")
	.style("fill", "#FF4447")
	.style("font-size", "50px")
	.style("text-anchor", "middle")
	.attr("startOffset", "50%")
   	.style("font-weight", "700");

// draw Scores of the city
function drawCityScore(cityScore) {
	foreground.transition()
		.duration(750)
		.attrTween("d", arcTween(cityScore/100 * tau));

	theCityName.text(myCity);
	totalScore.text(myCityScore);
	console.log("Page 1: draw circle - DONE");
}


// Tween the Arc!!!
function arcTween(newAngle) {
	return function(d) {
		var interpolate = d3.interpolate(d.endAngle, newAngle);
		return function(t) {
			d.endAngle = interpolate(t);
			return arc(d);
		};
	};
}
/*============================================*/


/*========== Drawing the breakdown scores ==========*/
var margin = {top:40, right: 20, bottom: 30, left: 40},
	BSwidth = 960 - margin.left - margin.right,
	BSheight = 500 - margin.top - margin.bottom;

var formatInt = d3.format(".0f");

var x = d3.scaleBand()
	.range([0, BSwidth])
	.round(true)
	.padding(0.1);

var y = d3.scaleLinear()
	.range([BSheight, 0]);

var xAxis = d3.axisBottom(x);

var yAxis = d3.axisLeft(y)
	.tickFormat(formatInt);

var tip = d3.tip()
	.attr("class", 'd3-tip')
	.offset([-10, 0])
	.html(function(d) {
		return "<strong>&nbsp;Score</strong> <br> <span style='color:#EFB509'>" + Math.round((d.score_out_of_10 + 0.00001) * 100) / 100 + "</span>";
	});

var svg2 = d3.select(".BSChart")
	.attr("width", BSwidth + margin.left + margin.right)
	.attr("height", BSheight + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg2.call(tip);


function drawBreakdownScores(scores) {
	$('#page2 p').html(myCity);

	x.domain(scores.map(function(d) { return d.name; }));
	y.domain([0, 10]);

	svg2.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + BSheight + ")")
		.call(xAxis)
		.selectAll(".tick text")
		.call(wrap, x.bandwidth());

	svg2.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", "0.71em")
		.style("text-anchor", "end")
		.text("Score");

  	var bars = svg2.selectAll("rect")
    	.data(scores, function(d) { return d.name; });

  // update 
  	bars.transition()
		.duration(500)
		.attr("x", function(d) { return x(d.name); })
		.attr("width", x.bandwidth())
		.attr("y", function(d) { return y(Math.round((d.score_out_of_10 + 0.00001) * 100) / 100); })
		.attr("height", function(d) { return BSheight - y(Math.round((d.score_out_of_10 + 0.00001) * 100) / 100); });

  // enter
  	bars.enter()
		.append("rect")
		.attr("class", "bar")
		.attr("width", x.bandwidth())
		.attr("x", 0)
		.attr("x", function(d) { return x(d.name); })
		.attr("y", y(0))
		.attr("height", 0)
		.style("opacity", 0)
		.on("mouseover", tip.show)
		.on("mouseout", tip.hide)
		.transition()
		.duration(500)
		.attr("y", function(d) { return y(Math.round((d.score_out_of_10 + 0.00001) * 100) / 100); })
		.attr("height", function(d) { return BSheight - y(Math.round((d.score_out_of_10 + 0.00001) * 100) / 100); })
		.style("opacity", 1);

  // exit
  	bars.exit()
		.transition()
		.duration(500)
		.style("opacity", 0)
		.remove();

	console.log("Page 2: draw bar chart - DONE");
}


// wrap the text when the x axis label is too long
function wrap(text, width) {
	text.each(function() {
		var text = d3.select(this),
			words = text.text().split(/\s+/).reverse(),
			word,
			line = [],
			lineNumber = 0,
			lineHeight = 1.1, //ems
			y = text.attr("y"),
			dy = parseFloat(text.attr("dy")),
			tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
		while (word = words.pop()) {
			line.push(word);
			tspan.text(line.join(" "));
			if (tspan.node().getComputedTextLength() > width) {
				line.pop();
				tspan.text(line.join(" "));
				line = [word];
				tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
			}
		}
	});
}
/*==================================================*/


/*========== DISPLAY TOP SCORES FROM SEARCHED CITIES ==========*/
function displayScores() {
	var i;
	$.ajax({
		url: '/api/top/scores',
		type: 'GET',
		dataType: 'json',
		error: function(data) {
			// console.log(data);
			alert("Oops...try refreshing.");
		},
		success: function(data) {
			console.log("Getting DB data");
			// console.log(data.length); // returns already sorted and filtered array of objects

			if (data.length < 5) {
				for (i = 0; i < data.length; i++) {
					$("#score" + i).html(data[i].city + ": " + data[i].score);
				}
			}
			else {
				for (i = 0; i < 5; i++) {
					$("#score" + i).html(data[i].city + ": " + data[i].score);
				}
			}
/*			$("#score1").html(data[0].city + ": " + data[0].score);
			$("#score2").html(data[1].city + ": " + data[1].score);
			$("#score3").html(data[2].city + ": " + data[2].score);
			$("#score4").html(data[3].city + ": " + data[3].score);
			$("#score5").html(data[4].city + ": " + data[4].score);*/

			d3.select('#page3')
				.selectAll('.svg-circle')
				.remove();
			drawCircle(300, -120, 200, data[0]);
			drawCircle(250, -80, 175, data[1]);
			drawCircle(200, -40, 150, data[2]);
			drawCircle(150, 0, 125, data[3]);
			drawCircle(100, 40, 100, data[4]);
		}
	});
	console.log("Page 3: display top searches - DONE");
}


function circlePath(δr_min,δr_max, θ0_min,θ0_max, δθ_min,δθ_max) {
	var c = 0.551915024494,
		β = Math.atan(c),
		d = Math.sqrt(c*c+1*1),
		r = 1,
		θ = (θ0_min + Math.random() * (θ0_max - θ0_min) * Math.PI/180),
		path = 'M';

	path += [r * Math.sin(θ), r * Math.cos(θ)];
	path += ' C' + [d * r * Math.sin(θ + β), d * r * Math.cos(θ + β)];

	for (var i = 0; i < 4; i++) {
		θ += Math.PI/2 * (1 + δθ_min + Math.random() * (δθ_max - δθ_min));
		r *= (1 + δr_min + Math.random() * (δr_max - δr_min));
		path += ' ' + (i?'S':'') + [d * r * Math.sin(θ - β), d * r * Math.cos(θ - β)];
		path += ' ' + [r * Math.sin(θ), r * Math.cos(θ)];
	}

	return path;
}


function circleXform(λ_min,λ_max, θ_min,θ_max) {
	var θ = (θ_min + Math.random() * (θ_max - θ_min));
	return 'rotate(' + θ + ')'
		+ 'scale(1, ' + (λ_min + Math.random() * (λ_max-λ_min)) + ')'
		+ 'rotate(' + (-θ) + ')';
}


function drawCircle(r, cx, cy, topScoreCity) {
	// draw new circles
	var currentCircle = d3.select("#page3")
		.append("svg")
		.classed("svg-circle", true)
		.attr("width", r)
		.attr("height", r)
		.attr("viewBox", "-1.5 -1.5 3 3")
		.style("position", "relative")
		.style("left", cx + 'px')
		.style("top", cy + 'px');
	currentCircle.append("text")
		.attr("x", 0)
		.attr("y", 0)
		.attr("text-anchor", "middle")
		.style("font-size", "0.5px")
		.style("fill", "#5C868D")
		.text(topScoreCity.city);
	currentCircle.append("text")
		.attr("x", 0)
		.attr("y", 0.5)
		.attr("text-anchor", "middle")
		.style("font-size", "0.5px")
		.style("fill", "#99BFAA")
		.text(topScoreCity.score);
/*	currentCircle.append("circle")
		.classed("reference", true)
		.attr("r", 1);*/
	currentCircle.append("path")
		.classed("pencil", true)
		.attr("d", function() { return circlePath(-0.05,0.05, 40,240, 0,0.1); })
		.attr("transform", function() { return circleXform(0.9,1.1, 0,0); })
		.style("stroke", "#5C3D46");
}
/*==============================================================*/


// Get the scores of the city
function getScores(cityTerm) {
	$.ajax({
		url: "/api/" + cityTerm,
		type: "GET",
		dataType: "json",
		error: function(err) {
			console.log("Uh oh, can't get Teleport data...");
			console.log(err);
		},
		success: function(d) {
			console.log("Whoopee!!! Getting Teleport data!");
			console.log(d);
			var search_results = d._embedded['city:search-results'][0];
			if (search_results === undefined || search_results.length === 0) {
				reset();
			}
			else {
				var city_item = d._embedded['city:search-results'][0]._embedded['city:item'];
				if (city_item.hasOwnProperty('_embedded')) {
					var scores = city_item._embedded['city:urban_area']._embedded['ua:scores'].categories;
					var summary = city_item._embedded['city:urban_area']._embedded['ua:scores'].summary;
					var cityScore = city_item._embedded['city:urban_area']._embedded['ua:scores'].teleport_city_score;
					myCity = city_item.name;
					myCityScore = Math.round((cityScore + 0.00001) * 100) / 100;
					// console.log(scores);

					svg2.selectAll("rect")
						.on("mouseover", tip.show)
						.on("mouseout", tip.hide);

					// draw the city score
					drawCityScore(myCityScore);
					// draw the breakdown scores
					drawBreakdownScores(scores);

					$("#page4 p").html(summary);

					var saveCity = {
						city: myCity,
						score: myCityScore,
						breakdown_scores: scores,
						summary: summary,
						count: 1
					};
					// save the overall score
					checkScore(saveCity);
				}
				else {
					reset();
				}
			}
		}
	});
}


function checkScore(city) {
	var searchCity = city.city;
	$.ajax({
		url: "/api",
		type: "GET",
		dataType: "json",
		error: function(data) {
			console.log(data);
			alert("Unable to get saved data. Try refreshing.");
		},
		success: function(data) {
			console.log("Yay! Getting saved data!!!");
			var foundCity = ($.grep(data, function(e) { return e.city === searchCity; }));
			if (foundCity.length === 0) {
				saveScore(city);
			}
			else {
				console.log("Updating the city.");
				var newCount = Number(foundCity[0].count);
				newCount++;
				foundCity[0].count = newCount;
				saveScore(foundCity[0]);
			}
		}
	});
}


function saveScore(city) {
	$.ajax({
		url: "/save",
		type: "POST",
		contentType: "application/json",
		data: JSON.stringify(city),
		error: function(resp) {
			console.log("Oh no...error with POST.");
			console.log(resp);
		},
		success: function(resp) {
			console.log("Success with POST!!!");
			console.log(resp);
			displayScores();
		}
	});
}


// reset the pages when faulty input
function reset() {
	// reset City Score page
	theCityName.text('Oops, "' + searchTerm + '" has no scores!');
	totalScore.text("0.0");

	foreground.transition()
		.duration(750)
		.attrTween("d", arcTween(0));

	// reset Breakdown Score page
	$('#page2 p').html('"' + searchTerm +'" has a perfect score!!!');
	svg2.selectAll("rect")
		.attr("x", function(d) { return x(d.name); })
		.attr("y", y(9))
		.attr("height", BSheight - y(9))
		.on("mouseover", function() {
			$('#page2 p').html("Just Kidding, we don't have " + searchTerm + "'s scores.");
		});

	$('#page4 p').html("");
}


// when "enter" key is pressed, fade out landing page
$('.input').keypress(function(event) {
	// console.log(event);
	// console.log(event.which);
	// check if enter was pressed
	if (event.which == 13) {
    	// console.log("Enter was pressed!");

    	$('html, body').animate({
	        scrollTop: $("#page1").offset().top
	    }, 600);

    	var inputValue;
    	if ($('#input-field').is(':focus')) {
    		inputValue = $('#input-field').val();
			// console.log(inputValue);
    	}
    	else {
    		inputValue = $('#main-input').val();
    		// console.log(inputValue);
    	}


		// capitalize first letter of each word in inputValue
		searchTerm = inputValue.replace(/\w\S*/g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});

		var encodedValue = encodeURIComponent(inputValue);
		getScores(encodedValue);

		$(".input").val(""); // clearing input-field
		$(".input").blur(); // get focus off input-field
	}
});


// set cursor to input-field when page loads
$(document).ready(function() {
	$('#input-field').focus();

	$(window).scroll(function() {
		if ($(this).scrollTop() >= $(window).height()) {
			$('.nav-bar').fadeIn(500);
		}
		else {
			$('.nav-bar').fadeOut(500);
		}
	});

	var contentSections = $('.page'),
		navigationItems = $('#cd-vertical-nav a');

	updateNavigation();
	$(window).on('scroll', function() {
		updateNavigation();
	});

	//smooth scroll to the section
	navigationItems.on('click', function(event) {
        event.preventDefault();
        smoothScroll($(this.hash));
    });
    //smooth scroll to second section
    $('.cd-scroll-down').on('click', function(event) {
        event.preventDefault();
        smoothScroll($(this.hash));
    });

	function updateNavigation() {
		contentSections.each(function() {
			var activeSection = $('#cd-vertical-nav a[href="#'+$(this).attr('id')+'"]').data('number');
			if (($(this).offset().top - $(window).height()/2 < $(window).scrollTop()) &&
				($(this).offset().top + $(this).height() - $(window).height()/2 > $(window).scrollTop())) {
				navigationItems.eq(activeSection).addClass('is-selected');
			}
			else {
				navigationItems.eq(activeSection).removeClass('is-selected');
			}
		});
	}

	function smoothScroll(target) {
        $('body,html').animate({ 'scrollTop':target.offset().top }, 600);
	}
});