// var hover = document.getElementById("hover");
// var click = document.getElementById("click");
// var double_click = document.getElementById("double_click");

// hover.addEventListener("mouseover", function () {
// 	hover.innerText = "currently you are hovering over";
// 	hover.style.color = "#ff0000";
// });

// hover.addEventListener("mouseout", function () {
// 	hover.innerText = "hover over me";
// 	hover.style.color = "#000000";
// });

// click.addEventListener("click", function () {
// 	click.innerText = "You clicked me";
// 	click.style.color = "#00ff00";
// });
// double_click.addEventListener("dblclick", function () {
// 	double_click.innerText = "You double clicked me";
// 	double_click.style.color = "#00ffff";
// });

// var column = document.querySelectorAll("td");
// var button = document.querySelector("#bt");

// function clear_cell() {
// 	for (i = 0; i < column.length; ++i) {
// 		column[i].textContent = "";
// 	}
// }

// column.forEach(function (cell) {
// 	cell.addEventListener("click", function () {
// 		cell.innerText = "X";
// 		cell.style.color = "#00ff00";
// 	});
// 	cell.addEventListener("dblclick", function () {
// 		cell.innerText = "O";
// 		cell.style.color = "#0000ff";
// 	});
// });

// button.addEventListener("click", clear_cell);

// $("li").click(function () {
// 	console.log("any li was clicked");
// 	$(this).text("I was changed");
// });
// $("li").on("mouseenter", function () {
// 	$(this).text("mouse clicked");
// 	$(this).css("color", "magenta");
// });

// $("input").keypress(function (event) {
// 	$("li").eq(2).toggleClass("turnblue");
// 	console.log(event);
// 	if (event.which === 13) {
// 		$("li").eq(3).toggleClass("turnblue");
// 	}
// });

// $("button").click(function () {
// 	console.log("button was clicked");
// });

// $("button").on("click", function () {
// 	$("body").fadeOut(3000);
// });

$("li").click(function () {
	console.log("any li was clicked");
	$(this).text("I was changed");
});

var tdArray = $("tr");

var rows = [];

var col1 = [],
	col2 = [],
	col3 = [],
	col4 = [],
	col5 = [],
	col6 = [];
for (i = 0; i < tdArray.length; i++) {
	var trElement = $(tdArray[i]).find("td");

	// rows.push(trElement);
	col1.push(trElement[0]);
	col2.push(trElement[1]);
	col3.push(trElement[2]);
	col4.push(trElement[3]);
	col5.push(trElement[4]);
	col6.push(trElement[5]);
}

var column_position = [5, 5, 5, 5, 5, 5];
column_list = [col1, col2, col3, col4, col5, col6];

if ($("h2").text() == "Player 1's turn 'X'") {
	$("h2").css("color", "blueviolet");
}
for (let j = 0; j < tdArray.length; j++) {
	$(column_list[j][0]).click(function () {
		coin_text = "";
		console.log("any first element clicked");
		if ($("h2").text() == "Player 1's turn 'X'") {
			$("h2").text("Player 2's turn 'Y'");
			coin_text = "X";
			$("h2").css("color", "orange");
			$(column_list[j][column_position[j]]).addClass("turnblue");
		} else {
			$("h2").text("Player 1's turn 'X'");
			coin_text = "Y";
			$("h2").css("color", "blueviolet");
			$(column_list[j][column_position[j]]).addClass("turnorange");
		}
		$(column_list[j][column_position[j]]).text(coin_text);
		column_position[j] -= 1;
		for (l = 0; l < 6; l++) {
			if (
				$(column_list[0])
					.eq(5 - l)
					.text() ===
					$(column_list[1])
						.eq(5 - l)
						.text() &&
				$(column_list[1])
					.eq(5 - l)
					.text() ===
					$(column_list[2])
						.eq(5 - l)
						.text() &&
				$(column_list[2])
					.eq(5 - l)
					.text() ===
					$(column_list[3])
						.eq(5 - l)
						.text()
			) {
				if (
					$(column_list[0])
						.eq([5 - l])
						.text() != "O"
				) {
					location.reload(true);
					alert(
						$(column_list[0])
							.eq([5 - l])
							.text() + "wins"
					);
				}
			}
			if (
				$(column_list[1])
					.eq(5 - l)
					.text() ===
					$(column_list[2])
						.eq(5 - l)
						.text() &&
				$(column_list[2])
					.eq(5 - l)
					.text() ===
					$(column_list[3])
						.eq(5 - l)
						.text() &&
				$(column_list[3])
					.eq(5 - l)
					.text() ===
					$(column_list[4])
						.eq(5 - l)
						.text()
			) {
				if (
					$(column_list[1])
						.eq([5 - l])
						.text() != "O"
				) {
					location.reload(true);
					alert(
						$(column_list[1])
							.eq([5 - l])
							.text() + "wins"
					);
				}
			}
			if (
				$(column_list[2])
					.eq(5 - l)
					.text() ===
					$(column_list[3])
						.eq(5 - l)
						.text() &&
				$(column_list[3])
					.eq(5 - l)
					.text() ===
					$(column_list[4])
						.eq(5 - l)
						.text() &&
				$(column_list[4])
					.eq(5 - l)
					.text() ===
					$(column_list[5])
						.eq(5 - l)
						.text()
			) {
				if (
					$(column_list[2])
						.eq([5 - l])
						.text() != "O"
				) {
					location.reload(true);
					alert(
						$(column_list[2])
							.eq([5 - l])
							.text() + "wins"
					);
				}
			}
		}
		// "li".eq(2).toggleClass("turnblue");
	});
}

// for (const tdarray_row of tdArray) {
// 	for (let element_index = 0; element_index <= 3; element_index++) {
// 		el_1 = tdarray_row[element_index];
// 		el_2 = tdarray_row[element_index + 1];
// 		el_3 = tdarray_row[element_index + 2];
// 		el_4 = tdarray_row[element_index + 3];
// 		if (el_1 === el_2 && el_2 === el_3 && el_3 === el_4) {
// 			console.log(el_1 + "wins");
// 		}
// 	}
// }
