$(function() {
  //write your code here

  class Car {
    position = "";

    constructor(name, div) {
      this.name = name;
      this.raceTime = 0;
      this.obj = div;
    }

    setTime() {
      this.raceTime = Math.floor(Math.random() * 5000) + 1000;
    }

    currentResults() {
	  let tableName = "#" + this.name + "table tbody";
	  
      let results = `<tr><td>Finished in: <span class="${this.name}">${this.position}</span> place with a time of: <span
			class="${this.name}">${this.raceTime}</span> miliseconds!</td></tr>`;

	  $(tableName).prepend(results); // dodavanje na novite redovi na pocetok od tabelata
    }
  }

  // Initializing variables************************************************

  var car1 = new Car("car1", $("#car1"));
  var car2 = new Car("car2", $("#car2"));
  var timer = 3;
  var intervalID;
  var prevTimeResults = "";
  var windowSize;
  var min, max, rowID=0;
  //Initializing variables end ********************************************
  
  $("#reset").attr("disabled", true); // setting Start Over button disabled at the beginning

  //---------------------------------------------------------

  // pri loadiranje na stranata, da proveri vo lokal storage dali postojat imalo prethodna trka i dokolku imalo da ja popolni tabelata za prethodni rezultati i da ja prikaze vo zadadeniot DIV na stranata!!!

  if (localStorage.getItem("previousRace")) {
		prevTimeResults = `<h3 class="text-center">Results from the previous time you played this game:</h3>
			<table width='100%'>
				<tbody>
					<tr>
						<td>
							<span class="car1">Car1</span> finished in <span class="car1">${localStorage.getItem("car1position")}</span> place, with a time of: <span class="car1">${localStorage.getItem("car1time")}</span> miliseconds!
						</td>
					</tr>
					<tr>
						<td>
							<span class="car2">Car2</span> finished in <span class="car2">${localStorage.getItem("car2position")}</span> place, with a time of: <span class="car2">${localStorage.getItem("car2time")}</span> miliseconds!
						</td>
					</tr>
				</tbody>
			</table>`;
  } else {
    prevTimeResults = "";
  }
  $("#prevTimeResults").html(prevTimeResults);

  //---------------------------------------------------------

  // $('#overlay').hide();

  // get current window size
  // let windowSize=$(window).width();
  // console.log(windowSize); //1600

  function countdown() {
	
    $(".counter").text(timer);
    if (timer == 0) {
      $(".counter").text("GO!");
      clearInterval(intervalID);
      // return;
      setTimeout(function() {
        $("#overlay").css("display", "none");
        $(".counter").text("");
        timer = 3;
      }, 1000);
    }
    console.log(timer);
    timer--;
  } // countdown function END



  function startCars() {

    //---------------------------------------------------------
    car1.obj.animate({ left: `${windowSize}` }, car1.raceTime);
    setTimeout(function() {
      localStorage.setItem("car1time", car1.raceTime);
      localStorage.setItem("car1position", car1.position);
      car1.currentResults();
    }, car1.raceTime);
    //---------------------------------------------------------


    //---------------------------------------------------------
    car2.obj.animate({ left: `${windowSize}` }, car2.raceTime);
    setTimeout(function() {
      localStorage.setItem("car2time", car2.raceTime);
      localStorage.setItem("car2position", car2.position);
      car2.currentResults();
    }, car2.raceTime);
    localStorage.setItem("previousRace", true);
    //---------------------------------------------------------

    // enable na kopcinjata otkako poslednata kola ke ja pomine linijata
    setTimeout(function() {
      $(".btn").attr("disabled", false);
      // console.log('Sega se vkluceni');
    }, max);

	// prikazuvanje na znameto otkako prvata kola ke ja pomine linijata
    setTimeout(() => {
      $("#overlay").css("display", "flex");
      $(".flag").fadeIn();
    }, min);
  } // startCars function END



  $("#go").click(function() {
    // tuka if da proveri, ako left ne e 0, da ne pocnuva pak
    if (car1.obj.css("left") == "0px" && car2.obj.css("left") == "0px") {

      // isklucivanje na kopcinjata stom zapocne odbrojuvanjeto
      $(".btn").attr("disabled", true);
      $("#overlay").css("display", "flex");

      // setiranje na raceTime
      car1.setTime();
      car2.setTime();
	  windowSize = parseInt($(window).width() - car1.obj.width());
      if (car1.raceTime > car2.raceTime) {
        car1.position = "second";
        car2.position = "first";
        min = car2.raceTime;
        max = car1.raceTime;
      } else if (car1.raceTime < car2.raceTime) {
        car1.position = "first";
        car2.position = "second";
        min = car1.raceTime;
        max = car2.raceTime;
      } else {
        car1.position = "draw";
		car2.position = "draw";
		min=max=car1.raceTime;
      }

      intervalID = setInterval(countdown, 1000);

	  setTimeout(startCars, 5000);
    }
  }); // $("#go").click(function(){}) function END

  $("#reset").on("click", function() {
    car1.obj.css("left", "0px");
    car2.obj.css("left", "0px");
    $("#overlay").css("display", "none");
    $(".flag").hide();
  }); // $("#reset").click(function(){}) function END
});
