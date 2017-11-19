var dropbox_token = 'ADD_TOKEN';
var dropbox_key = 'ADD_KEY';
// Used to upload data to Dropbox at the end.

var normalpause = 500;
// Used to add a delay between trials

var audioSprite = $("#sound_player")[0];
// Used to play the MP3

var timeafterClick = 1000;
// Used to set the delay after a click, before screen changes.

var handler;
// Used by the audio player.

var results = ["subject_id",
	"trial_number",
	"trial_id",
	"target_sentence",
	"foil_sentence",
	"target_side",
	"foil_side",
	"trial_type",
	"presentation_order",
	"date_stamp",
	"time_stamp",
	"side_chosen",
	"accuracy",
	'rt',
	'times_played',
	"date_of_birth",
	"ethnicity",
	"native_lang",
	"other_langs",
	"parental_occ",
	"dev_info",
	"birth_order",
	"num_siblings",
	"gender\n"].join(seperator = [","]);
	// This is used to create the header of the CSV file. Final item must have a linebreak \n on the end,
	// as it is an array joined into a string. Did it this way as it makes it easier to see what is in the
	// header.

var data = {

	rt: 0,
		//
	subject_id: "",
		//given at beginning of experiment
	trial_number: 0,
		// Number of trial in terms of presentation
	trial_id: 0,
		// ID of trial in the JSON file
	target_side: "",
		// L or R
	foil_side: "",
		// L or R
	trial_type: "",
		// Training, critical, or something else
	presentation_order: 0,
		// 0 = L to R
		// 1 = R to L
	date_stamp: getCurrentDate(),
		//the date of the experiment
	time_stamp: getCurrentTime(),
		//the time that the trial was completed at 
	accuracy: 0,
		// 0 = choice did not match target
		// 1 = choice matched target
	ethnicity: "",
	native_lang: "",
	other_langs: "",
	parental_occ: "",
	dev_info: "",
	birth_order: "",
	num_siblings: "",
	date_of_birth: "",
	gender: "",
}

// This will hold the data for the trial. This is updated for each trial and then appended to the results variable
// at the end of that trial.

function randomString() {
	length = 25;
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}
// Function to create a random string. Used to make unique IDs for participants.

function fill_field() { 
    var txt=document.getElementById("subject_id").value; 
    document.getElementById("subject_id").value = randomString();; 
    }

// Function called when clicking on "Generate" button on data input screen at start. Auto-fills the subject ID field with random ID.

function preload_images(trials) {

	image_uris = new Array();

	for (var i of trials) {
		image_uris.push(i['clear_speaker_pic']);
		image_uris.push(i['a_speaker_pic']);
		image_uris.push(i['b_speaker_pic'])
	}

	image_uris = $.uniqueSort(image_uris);

	preload_images = new Array();

	for (uri in image_uris) {
		preload_images.push(new Image());
	}

	for (i = 0; i<image_uris.length; i++) {
		preload_images[i].src = image_uris[i];
	}
}

preload_images(trials);
// Preloads all the images

function getCurrentDate() {
	var currentDate = new Date();
	var day = currentDate.getDate();
	var month = currentDate.getMonth() + 1;
	var year = currentDate.getFullYear();
	return (month + "/" + day + "/" + year);
}

function getCurrentTime() {
	var currentTime = new Date();
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();

	if (minutes < 10) minutes = "0" + minutes;
	return (hours + ":" + minutes);
}

function showSlide(id) {
  $(".slide").hide(); //jquery - all elements with class of slide - hide
  $("#"+id).show(); //jquery - element with given id - show
}
// Used to show a particular HTML slide. First it hides ALL slides (i.e. all HTML elements with the slide
// class) and then it shows the particular slide which has the given ID.

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
// Used to shuffle trial order, in place. So no idea why it returns the array...

function playPrompt(start, length) {
	audioSprite.removeEventListener('timeupdate', handler);
	audioSprite.currentTime = start;
	//console.log('audio currentTime:', audioSprite.currentTime);
	audioSprite.play();

	handler = function() {
		//console.log('this.currentTime:', this.currentTime);
		//console.log('start+length+0.2:', start+length+0.2);
	    if (this.currentTime >= start + length + 0.2) {
	        this.pause();
	    }
	};
	audioSprite.addEventListener('timeupdate', handler, false);
}
// This plays the sound for a word. Args are start point of the sound in the MP3 and how long the sound is.
// Adds 0.2 padding for iPad being weird.

function processOneRow() {
	var dataforRound = data.subject_id + ","
	+ data.trial_number + ","
	+ data.trial_id + ","
	+ data.target_sentence + ","
	+ data.foil_sentence + ","
	+ data.target_side + ","
	+ data.foil_side + ","
	+ data.trial_type + ","
	+ data.presentation_order + ","
	+ data.date_stamp + ","
	+ data.time_stamp + ","
	+ data.side_chosen + ","
	+ data.accuracy + ","
	+ data.rt + ","
	+ data.play_counter + ","
	+ data.date_of_birth + ","
	+ data.ethnicity + ","
 	+ data.native_lang + ","
 	+ data.other_langs + ","
 	+ data.parental_occ + ","
 	+ data.dev_info + ","
 	+ data.birth_order + ","
 	+ data.num_siblings + ","
 	+ data.gender + "\n";

	results += dataforRound;
}
// This adds a row to the results var, which is eventually pushed to Dropbox as a CSV.
// Done over several lines just to make it a little easier to read and edit.
// Order needs to match the order of the "results" var above, otherwise the columns won't
// match the header in the CSV.

function createDot(dotx, doty, i) {

	var dot = document.createElement("img");

	dot.setAttribute("class", "dot");

	dot.id = "dot_" + i;

	dot.src = "images/dots/dot_" + i + ".png";
	

	var x = Math.floor(Math.random()*750);
	var y = Math.floor(Math.random()*540);

	var invalid = "true";

	//make sure dots do not overlap
	while (true) {
		invalid = "true";
		for (j = 0; j < dotx.length ; j++) {
			if (Math.abs(dotx[j] - x) + Math.abs(doty[j] - y) < 250) {
				var invalid = "false";
				break; 
			}
		}
		if (invalid === "true") {
			dotx.push(x);
			doty.push(y);
			break;	
		}
		x = Math.floor(Math.random()*400);
		y = Math.floor(Math.random()*400);
	}

	dot.setAttribute("style","position:absolute;left:"+x+"px;top:"+y+"px;");
	training.appendChild(dot);
}
// This adds a dot to the screen. Called during training.

function do_training(dotgame) {
	var allDots = ["dot_1", "dot_2", "dot_3", "dot_4", "dot_5", 
					"dot_6", "dot_7", "dot_8", 
					"dot_9", "dot_10"];
	
	xcounter = 0;
	var dotCount = 5;

	//preload sound
	if (dotgame === 0) {
		audioSprite.play();
		audioSprite.pause();
		audioSprite.currentTime = 0;
	}
	// I don't think I need to do that because I used HTML5 to do it...

	var dotx = [];
	var doty = [];

	if (dotgame === 0) {
		for (i = 0; i < 5; i++) {
			createDot(dotx, doty, i+1);
		}
	} else {
		for (i = 5; i < 10; i++) {
			createDot(dotx, doty, i+1);
		}
	}
	showSlide("training");

	$('.dot').bind('click touchstart', function(event) {
		var dotID = $(event.currentTarget).attr('id');

		//only count towards completion clicks on dots that have not yet been clicked
		if (allDots.indexOf(dotID) === -1) {
			return;
		}
		allDots.splice(allDots.indexOf(dotID), 1);
		document.getElementById(dotID).src = "images/dots/x.png";
		
		xcounter++
		
		if (xcounter === dotCount) {
			setTimeout(function () {
				$("#training").hide();
				if (dotgame === 0) {		
					//hide old x marks before game begins again
					var dotID;
					for (i = 1; i <= dotCount; i++) {
						dotID = "dot_" + i;
						training.removeChild(document.getElementById(dotID));
					}
					do_training();
					dotgame++; 
				} else {
					//document.body.style.background = "black";
					setTimeout(function() {
						showSlide("confirm");
						//data.next();
					}, normalpause*2);
				}
			}, normalpause*2);
		}
	});	   
}
// Does several things:
// Update data variable with subject data from welcome screen.
// Display the dots and plays the dot game.
// When done, shows the "confirm" slide that has a "Begin!" button
// to start running the trials.

function confirm() {

	data.birth_order = document.getElementById("birth_order").value;
	data.num_siblings = document.getElementById("num_siblings").value;

	data.ethnicity = document.getElementById("ethnicity").value.replace(/,/g, " ");
	data.native_lang = document.getElementById("native_lang").value.replace(/,/g, " ");
	data.other_langs = document.getElementById("other_langs").value.replace(/,/g, " ");
	data.parental_occ = document.getElementById("parental_occ").value.replace(/,/g, " ");
	data.dev_info = document.getElementById("dev_info").value.replace(/,/g, " ");

	data.subject_id = document.getElementById("subject_id").value;

	data.date_of_birth = document.getElementById("date_of_birth").value;
	if (document.getElementById("gender").checked === true) {
		data.gender = 'male';
	}
	if (document.getElementById("gender").checked === false) {
		data.gender = 'female';
	}

	document.body.style.background = "white";
	$("#confirm").hide();
	setTimeout(function () {
		run_all_trials();
	}, normalpause);
}
// Called when clicking on "Begin!" after the dot game

function end() {
	setTimeout(function () {
		$("#stage").fadeOut();
	}, normalpause);

	$('#finished').append($('<p style="font-size:35px">' + data.subject_id + '</p>'));

	showSlide("finished");
	document.body.style.background = "black";
	// upload_to_dropbox();
}
// Called when all trials are done. Uploads to Dropbox.

function upload_to_dropbox() {
	var client = new Dropbox.Client({ key: dropbox_key, token: dropbox_token});

	client.authenticate();

	client.writeFile(data.subject_id + '_data.csv', results, function(error) {
		if (error) {
			console.log('dropbox error:', error);
		} else {
			console.log('File written to dropbox')
		}
	});
}
// Uploads CSV to Dropbox

function play_one_item(img_id, sound_start, sound_length) {
		playPrompt(sound_start, sound_length);
		$(img_id).effect("shake", {'direction':'left', 'distance':20, 'times':5}, 2000);		
}

function set_up_pseudo_counterbalance() {
	var num_training = training_trials.length;
	var num_trials = trials.length;

	sides_to_use = new Array();

	order_to_play = new Array();

	// They will be global vars.

	// Hope that number of real trials is even...

	for (var i = 0; i<num_trials/2; i++) {
		sides_to_use.push("left");
		sides_to_use.push("right");
		order_to_play.push(0);
		order_to_play.push(1);
	}
	// Adds 50% R, 50% L.

	shuffle(sides_to_use);
	shuffle(order_to_play);

	for (var i=0; i<num_training/2; i++) {
		sides_to_use.splice(0,0,"left");
		sides_to_use.splice(0,0,"right");
		order_to_play.splice(0,0, 0);
		order_to_play.splice(0,0, 1);
	}
	// Insert L/R for training at the beginning.
}

function set_up_trial_list() {

	shuffle(trials);
	// Shuffles the array of critical trials
	
	for (var item of training_trials) {
		trials.splice(0,0,item);
	}
	// Add the training trials to main list of trials 
	// Makes sure that the training trials always happen first. They won't be shuffled in with the
	// others but they will be in backwards order to what they are in the .json file,
	// though that should not matter.

	// We later iterate through the trials array and apply a function to using forEach()
	// This function will deal with the trial.
}

function run_all_trials() {

	set_up_pseudo_counterbalance();
	set_up_trial_list();

	counter = 1;
	play_counter = 0;
	number_of_trials = trials.length;

	current_trial = trials[0];

	var sound_played = false;

	$("#clear_speaker_img").attr("src", current_trial["clear_speaker_pic"]);
	$("#left").attr("src", current_trial["a_speaker_pic"]);
	$("#right").attr("src", current_trial["b_speaker_pic"]);
	// First trial will be a training one so can have fixed position for stims. Randomised later.	

	var pause_between = 1000;
	// pause between each sound being played

	var total_sound_length = (current_trial['clear_sound_length'] + current_trial['foil_sound_length'] + current_trial['target_sound_length']) * 1000;
	// length of the entire sounds clips being played, used to determine when to turn back on clicking
	total_sound_length += pause_between * 2;
	// Increase it by the pauses otherwise clicking is turned back on too early.

	var clickDisabled = false;

	presentation_order = order_to_play[0];
	// Used for the first training trial then changed at random again
	// for each new trial
	// 0 = L to R
	// 1 = R to L

	target_side = sides_to_use[0];
	// Determine which side the target will be on for this trial

	$("#stage").fadeIn();

	start_time = -1;

	// Click speaker to start...
	$('#clear_speaker_img').on('click touchstart', function(event) {
		if (clickDisabled) return ;

		clickDisabled = true;

		sound_played = true;

		play_counter++;

		setTimeout(function()
			{clickDisabled = false},
			total_sound_length);

		play_one_item('#clear_speaker_img', current_trial['clear_sound_start'], current_trial['clear_sound_length']);

		if (presentation_order === 0 & target_side === 'left') {
			setTimeout(function()
				{play_one_item('#left', current_trial['target_sound_start'], current_trial['target_sound_length']);},
				current_trial['clear_sound_length']*1000 + pause_between
				);
			setTimeout(function()
				{play_one_item('#right', current_trial['foil_sound_start'], current_trial['foil_sound_length']);},
				current_trial['clear_sound_length']*1000 + pause_between + current_trial['target_sound_length']*1000 + pause_between
				);
		} 

		if (presentation_order === 1 & target_side === 'left') {
			setTimeout(function()
				{play_one_item('#right', current_trial['foil_sound_start'], current_trial['foil_sound_length']);},
				current_trial['clear_sound_length']*1000 + pause_between
				);
			setTimeout(function()
				{play_one_item('#left', current_trial['target_sound_start'], current_trial['target_sound_length']);},
				current_trial['clear_sound_length']*1000 + pause_between + current_trial['foil_sound_length']*1000 + pause_between
				);
		}

		if (presentation_order === 0 & target_side === 'right') {
			setTimeout(function()
				{play_one_item('#left', current_trial['foil_sound_start'], current_trial['foil_sound_length']);},
				current_trial['clear_sound_length']*1000 + pause_between
				);
			setTimeout(function()
				{play_one_item('#right', current_trial['target_sound_start'], current_trial['target_sound_length']);},
				current_trial['clear_sound_length']*1000 + pause_between + current_trial['foil_sound_length']*1000 + pause_between
				);
		} 

		if (presentation_order === 1 & target_side === 'right') {
			setTimeout(function()
				{play_one_item('#right', current_trial['target_sound_start'], current_trial['target_sound_length']);},
				current_trial['clear_sound_length']*1000 + pause_between
				);
			setTimeout(function()
				{play_one_item('#left', current_trial['foil_sound_start'], current_trial['foil_sound_length']);},
				current_trial['clear_sound_length']*1000 + pause_between + current_trial['target_sound_length']*1000 + pause_between
				);
		}

	start_time = (new Date()).getTime();
	// console.log("start time is:", start_time);

	});



	//If a student/robot is clicked, then record data and move on.
	$('.choice').on('click touchstart', function(event){
		if (sound_played === false) {
			console.log('sound not played yet');
			return;
		}
		if (clickDisabled === false) {
			clickDisabled = true;
			sound_played = false;
			
			var response = $(this).attr('id');

			$(this).effect('bounce', {'times':6, 'distance':200}, 1000);
			
			if (response === target_side) {
				data.accuracy = 1;
			} else {
				data.accuracy = 0;
			}

			data.rt = (new Date()).getTime() - start_time - total_sound_length;

			if (start_time === -1) {
				data.rt = -1;
			}

			// console.log('rt:', data.rt)
			data.trial_number = counter;
			data.trial_id = current_trial['trial_id'];
			data.target_side = target_side;
			data.trial_type = current_trial['trial_type'];
			data.play_counter = play_counter;
			data.target_sentence = current_trial['target_sentence'];
			data.foil_sentence = current_trial['foil_sentence'];
			
			if (target_side === 'left') {
				data.foil_side = 'right'
			} else {
				data.foil_side = 'left'
			}

			data.presentation_order = presentation_order;
			data.side_chosen = response;

			processOneRow();
			upload_to_dropbox();

			data.rt = -1;
			start_time = -1;

			//put all the data saving stuff here...


			trials.splice(0, 1);
			order_to_play.splice(0, 1);
			sides_to_use.splice(0, 1);
			counter++;
			play_counter = 0;
			//pop off the trial we just did and update trial counter.
			//same for the order/side

			setTimeout(function() {
				$("#stage").fadeOut();

				if (counter === number_of_trials + 1) {
					end();
					return;
				}
				
				setTimeout(function(){

						current_trial = trials[0];
						// Get new trial
						presentation_order = order_to_play[0];
						target_side = sides_to_use[0];
						// console.log('play order', presentation_order);
						// console.log('target side', target_side);
						// Update randomisation vars

						$("#clear_speaker_img").attr("src", current_trial["clear_speaker_pic"]);
						$("#left").attr("src", current_trial["a_speaker_pic"]);
						$("#right").attr("src", current_trial["b_speaker_pic"]);

						$("#stage").fadeIn();
						clickDisabled = false
				},
					normalpause);
			},
				timeafterClick);
		} else {
			console.log('clicking disabled on choice images');
		}
	});
}

showSlide("new_subject");

// Called upon page load to start the whole thing off by showing the intro screen to add a new subject.
