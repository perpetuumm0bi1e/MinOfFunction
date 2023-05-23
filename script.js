function onEntry(entry) {
	entry.forEach((change) => {
		if (change.isIntersecting) {
			change.target.classList.add("appeared");
		}
	});
}
let options = { threshold: [0.5] };
let observer = new IntersectionObserver(onEntry, options);
let elements = document.querySelectorAll(".appearance-animation");

for (let elm of elements) {
	observer.observe(elm);
}

let solutionBoxes = document.getElementsByClassName("solution-box"),
	solutions = document.getElementsByClassName("solution"),
	answers = document.getElementsByClassName("answer"),
	functionInput = document.getElementById("function"),
	initials = document.getElementsByClassName("init"),
	solveButtons = document.getElementsByClassName("solve-button"),
	resRanges = document.getElementsByClassName("res-range"),
	ranges = document.getElementsByClassName("range");

class Element {
	constructor(index, x1, exp1, x2, exp2) {
		this.index = index;
		this.x1 = x1;
		this.exp1 = exp1;
		this.x2 = x2;
		this.exp2 = exp2;
	}
}

function rangeSettings(range, resRange) {
	range.style.backgroundSize =
		((range.value - range.min) * 100) / (range.max - range.min) + "% 100%";

	range.addEventListener("input", function () {
		resRange.innerHTML = range.value;
		range.style.backgroundSize =
			((range.value - range.min) * 100) / (range.max - range.min) + "% 100%";
	});
}
for (let i = 0; i < ranges.length; i++) {
	rangeSettings(ranges[i], resRanges[i]);
}
// Метод градиентного спуска с постоянным шагом
solveButtons[0].addEventListener("click", function () {
	solutions[0].innerHTML = "";
	answers[0].innerHTML = "";

	let E1 = initials[2].value,
		E2 = initials[3].value,
		M = initials[4].value,
		func = parseFunction(functionInput.value.split("")),
		gradient = grad(func),
		solution = false,
		k = 0,
		t = initials[5].value,
		x = [],
		interation = 1,
		range = ranges[0].value;

	x[k] = [initials[0].value, initials[1].value];

	while (!solution) {
		let gradientV = gradValue(gradient, x[k]),
			normV = normValue(gradientV);

		if (normV < E1) {
			solutionBoxes[0].style.visibility = "visible";
			answers[0].innerHTML += `Решение: { x* = ( ${Number(x[k][0]).toFixed(range)}; ${Number(
				x[k][1]
			).toFixed(range)}); f(x*) = ${funcValue(func, x[k]).toFixed(range)} } <br>`;
			solutions[0].innerHTML += `<tr><td>${interation}</td> <td>${k}</td>
            <td>${t}</td>
            <td>(${Number(x[k][0]).toFixed(range)}; ${Number(x[k][1]).toFixed(
				range
			)})<sup>T</sup></td>
            <td>${funcValue(func, x[k]).toFixed(range)}</td>
            <td>(${gradientV[0].toFixed(range)}; ${gradientV[1].toFixed(range)})<sup>T</sup></td>
            <td>${normV.toFixed(range)} </td>
            <td></td>
            <td></td></tr>`;
			solution = true;
			break;
		} else {
			while (true) {
				x[k + 1] = nextXfirst(x[k], t, gradient);

				solutions[0].innerHTML += `<tr><td>${interation}</td> <td>${k}</td>
                                            <td>${t}</td>
                                            <td>(${Number(x[k][0]).toFixed(range)}; ${Number(
					x[k][1]
				).toFixed(range)})<sup>T</sup></td>
                                            <td>${funcValue(func, x[k]).toFixed(range)}</td>
                                            <td>(${gradientV[0].toFixed(
																							range
																						)}; ${gradientV[1].toFixed(range)})<sup>T</sup></td>
                                            <td>${normV.toFixed(range)} </td>
                                            <td>(${Number(x[k + 1][0]).toFixed(range)}; ${Number(
					x[k + 1][1]
				).toFixed(range)})<sup>T</sup></td>
                                            <td>${(
																							funcValue(func, x[k + 1]) - funcValue(func, x[k])
																						).toFixed(range)}</td></tr>`;

				if (funcValue(func, x[k + 1]) - funcValue(func, x[k]) < 0) {
					if (
						normValue([x[k + 1][0] - x[k][0], x[k + 1][1] - x[k][1]]) < E1 &&
						Math.abs(funcValue(func, x[k + 1]) - funcValue(func, x[k])) < E1
					) {
						solutionBoxes[0].style.visibility = "visible";
						answers[0].innerHTML += `<br><b>Решение:</b> { x* = ( ${Number(x[k + 1][0]).toFixed(
							range
						)}, ${Number(x[k + 1][1]).toFixed(range)}); f(x*) = ${funcValue(func, x[k + 1]).toFixed(
							range
						)} } <br>`;
						solutions[0].innerHTML += `<tr><td>-</td> 
                                                    <td>${k + 1}</td>
                                                    <td>${t}</td>
                                                    <td>(${Number(x[k + 1][0]).toFixed(
																											range
																										)}; ${Number(x[k + 1][1]).toFixed(
							range
						)})<sup>T</sup></td>
                                                    <td>${funcValue(func, x[k + 1]).toFixed(
																											range
																										)}</td>
                                                    <td>(${gradValue(gradient, x[k + 1])[0].toFixed(
																											range
																										)}; ${gradValue(gradient, x[k + 1])[1].toFixed(
							range
						)})<sup>T</sup></td>
                                                    <td>${normValue(
																											gradValue(gradient, x[k + 1])
																										).toFixed(
																											range
																										)}</td><td>-</td><td>-</td></tr>`;
						solution = true;
						break;
					} else {
						k++;
						interation++;
						break;
					}
				} else {
					t = t / 2;
					interation++;
				}
			}
		}
	}
});

// Метод наискорейшего градиентного спуска
solveButtons[1].addEventListener("click", function () {
	solutions[1].innerHTML = "";
	answers[1].innerHTML = "";

	let E1 = initials[8].value,
		E2 = initials[9].value,
		M = initials[10].value,
		func = parseFunction(functionInput.value.split("")),
		gradient = grad(func),
		solution = false,
		k = 0,
		t = initials[11].value,
		x = [],
		interation = 1,
		range = ranges[1].value;

	x[k] = [initials[6].value, initials[7].value];

	while (!solution) {
		let gradientV = gradValue(gradient, x[k]),
			normV = normValue(gradientV);

		if (normV < E1) {
			answers[1].innerHTML += `Решение: { x* = ( ${Number(x[k][0]).toFixed(range)}; ${Number(
				x[k][1]
			).toFixed(range)}); f(x*) = ${funcValue(func, x[k]).toFixed(range)} } <br>`;
			solution = true;
			break;
		} else {
			while (true) {
				t =
					(4 * Number(x[k][0]) * gradientV[0] +
						Number(x[k][0]) * gradientV[1] +
						Number(x[k][1]) * gradientV[0] +
						2 * Number(x[k][1]) * gradientV[1]) /
					(4 * Math.pow(gradientV[0], 2) +
						2 * gradientV[0] * gradientV[1] +
						2 * Math.pow(gradientV[1], 2));

				x[k + 1] = nextXfirst(x[k], t, gradient);

				solutions[1].innerHTML += `<tr><td>${interation}</td> <td>${k}</td>
                                            <td>${t.toFixed(range)}</td>
                                            <td>(${Number(x[k][0]).toFixed(range)}; ${Number(
					x[k][1]
				).toFixed(range)})<sup>T</sup></td>
                                            <td>${funcValue(func, x[k]).toFixed(range)}</td>
                                            <td>(${gradientV[0].toFixed(
																							range
																						)}; ${gradientV[1].toFixed(range)})<sup>T</sup></td>
                                            <td>${normV.toFixed(range)} </td>
                                            <td>(${Number(x[k + 1][0]).toFixed(range)}; ${Number(
					x[k + 1][1]
				).toFixed(range)})<sup>T</sup></td>
                                            <td>${(
																							funcValue(func, x[k + 1]) - funcValue(func, x[k])
																						).toFixed(range)}</td></tr>`;

				if (
					normValue([x[k + 1][0] - x[k][0], x[k + 1][1] - x[k][1]]) < E1 &&
					Math.abs(funcValue(func, x[k + 1]) - funcValue(func, x[k])) < E1
				) {
					solutionBoxes[1].style.visibility = "visible";
					answers[1].innerHTML += `<br><b>Решение:</b> { x* = ( ${Number(x[k][0]).toFixed(
						range
					)}; ${Number(x[k][1]).toFixed(range)}); f(x*) = ${funcValue(func, x[k]).toFixed(
						range
					)} } <br>`;
					solutions[1].innerHTML += `<tr><td>-</td> 
                                                <td>${k + 1}</td>
                                                <td>${t.toFixed(range)}</td>
                                                <td>(${Number(x[k + 1][0]).toFixed(
																									range
																								)}; ${Number(x[k + 1][1]).toFixed(
						range
					)})<sup>T</sup></td>
                                                <td>${funcValue(func, x[k + 1]).toFixed(range)}</td>
                                                <td>(${gradValue(gradient, x[k + 1])[0].toFixed(
																									range
																								)}; ${gradValue(gradient, x[k + 1])[1].toFixed(
						range
					)})<sup>T</sup></td>
                                                <td>${normValue(
																									gradValue(gradient, x[k + 1])
																								).toFixed(range)}</td><td>-</td><td>-</td></tr>`;
					solution = true;
					break;
				} else {
					k++;
					interation++;
					break;
				}
			}
		}
	}
});

// Метод Ньютона
solveButtons[2].addEventListener("click", function () {
	console.log("qq");
	solutions[2].innerHTML = "";
	answers[2].innerHTML = "";

	let E1 = initials[14].value,
		E2 = initials[15].value,
		M = initials[16].value,
		func = parseFunction(functionInput.value.split("")),
		gradient = grad(func),
		solution = false,
		k = 0,
		t = initials[17].value,
		x = [],
		interation = 1,
		range = ranges[2].value;

	x[k] = [initials[12].value, initials[13].value];

	while (!solution) {
		let gradientV = gradValue(gradient, x[k]),
			normV = normValue(gradientV);

		if (normV < E1) {
			answers[2].innerHTML += `Решение: { x* = ( ${Number(x[k][0]).toFixed(range)}; ${Number(
				x[k][1]
			).toFixed(range)}); f(x*) = ${funcValue(func, x[k]).toFixed(range)} } <br>`;
			solution = true;
			break;
		} else {
			while (true) {
				let d = [],
					H = HesseMatrix(gradient);

				if (detInverseHesseMatrix(H, x[k]) > 0) {
					d = [
						-1 * detInverseHesseMatrix(H, x[k]) * gradValue(gradient, x[k])[0],
						-1 * detInverseHesseMatrix(H, x[k]) * gradValue(gradient, x[k])[1],
					];
					t = 1;
				} else {
					d = [-1 * gradValue(gradient, x[k])[0], -1 * gradValue(gradient, x[k])[1]];
					t = -1 * (x[k][1] / d[1] + (5 * x[k][0]) / d[0]) - 0.000001;
				}
				x[k + 1] = [Number(x[k][0]) + t * Number(d[0]), Number(x[k][1]) + t * Number(d[1])];

				solutions[2].innerHTML += `<tr><td>${interation}</td> <td>${k}</td>
                                            <td>(${Number(x[k][0]).toFixed(range)}; ${Number(
					x[k][1]
				).toFixed(range)})<sup>T</sup></td>
                                            <td>${funcValue(func, x[k]).toFixed(range)}</td>
                                            <td>(${gradientV[0].toFixed(
																							range
																						)}; ${gradientV[1].toFixed(range)})<sup>T</sup></td>
                                            <td>${normV.toFixed(range)}</td>
                                            <td>${detHesseMatrix(H, x[k])}</td>
                                            <td>${detInverseHesseMatrix(H, x[k]).toFixed(
																							range
																						)}</td>
                                            <td>(${d[0].toFixed(range)}; ${d[1].toFixed(
					range
				)})<sup>T</sup></td>
                                            <td>${t.toFixed(range)}</td>
                                            <td>(${x[k + 1][0].toFixed(5)}; ${x[k + 1][1].toFixed(
					range
				)})<sup>T</sup></td>
                                            <td>${(
																							funcValue(func, x[k + 1]) - funcValue(func, x[k])
																						).toFixed(range)}</td></tr>`;

				if (
					normValue([x[k + 1][0] - x[k][0], x[k + 1][1] - x[k][1]]) < E1 &&
					Math.abs(funcValue(func, x[k + 1]) - funcValue(func, x[k])) < E1
				) {
					solutionBoxes[2].style.visibility = "visible";
					answers[2].innerHTML += `<br><b>Решение:</b> { x* = ( ${Number(x[k][0]).toFixed(
						range
					)}; ${Number(x[k][1]).toFixed(range)}); f(x*) = ${funcValue(func, x[k]).toFixed(
						range
					)} } <br>`;
					solutions[2].innerHTML += `<tr><td>-</td> 
                                                <td>${k + 1}</td>
                                                <td>(${Number(x[k][0]).toFixed(range)}; ${Number(
						x[k][1]
					).toFixed(range)})<sup>T</sup></td>
                                                <td>${funcValue(func, x[k + 1]).toFixed(range)}</td>
                                                <td>(${gradValue(gradient, x[k + 1])[0].toFixed(
																									range
																								)}; ${gradValue(gradient, x[k + 1])[1].toFixed(
						range
					)})<sup>T</sup></td>
                                                <td>${normValue(
																									gradValue(gradient, x[k + 1])
																								).toFixed(range)}</td>
                                                <td>${detHesseMatrix(H, x[k])}</td>
                                                <td>${detInverseHesseMatrix(H, x[k]).toFixed(
																									range
																								)}</td>
                                                <td>(${d[0].toFixed(range)}; ${d[1].toFixed(
						range
					)})<sup>T</sup></td>
                                                <td>${t.toFixed(
																									range
																								)}</td><td>-</td><td>-</td></tr>`;
					solution = true;
					break;
				} else {
					k++;
					interation++;
					break;
				}
			}
		}
	}
});

// Метод Ньютона-Рафсона
solveButtons[3].addEventListener("click", function () {
	solutions[3].innerHTML = "";
	answers[3].innerHTML = "";

	let E1 = initials[20].value,
		E2 = initials[21].value,
		M = initials[22].value,
		func = parseFunction(functionInput.value.split("")),
		gradient = grad(func),
		solution = false,
		k = 0,
		t = initials[23].value,
		x = [],
		interation = 1,
		range = ranges[3].value;
	x[k] = [initials[18].value, initials[19].value];

	while (!solution) {
		let gradientV = gradValue(gradient, x[k]),
			normV = normValue(gradientV);

		if (normV < E1) {
			answers[3].innerHTML += `Решение: { x* = ( ${Number(x[k][0]).toFixed(range)}; ${Number(
				x[k][1]
			).toFixed(range)}); f(x*) = ${funcValue(func, x[k]).toFixed(range)} } <br>`;
			solution = true;
			break;
		} else {
			while (true) {
				let d = [],
					H = HesseMatrix(gradient);

				if (detInverseHesseMatrix(H, x[k]) > 0) {
					d = [
						-1 * detInverseHesseMatrix(H, x[k]) * gradValue(gradient, x[k])[0],
						-1 * detInverseHesseMatrix(H, x[k]) * gradValue(gradient, x[k])[1],
					];
				} else {
					d = [-1 * gradValue(gradient, x[k])[0], -1 * gradValue(gradient, x[k])[1]];
				}
				t =
					(-1 *
						(4 * Number(x[k][0]) * d[0] +
							Number(x[k][0]) * d[1] +
							Number(x[k][1]) * d[0] +
							2 * Number(x[k][1]) * d[1])) /
					(4 * Math.pow(d[0], 2) + 2 * d[0] * d[1] + 2 * Math.pow(d[1], 2));

				x[k + 1] = [Number(x[k][0]) + t * Number(d[0]), Number(x[k][1]) + t * Number(d[1])];

				solutions[3].innerHTML += `<tr><td>${interation}</td> <td>${k}</td>
                                            <td>(${Number(x[k][0]).toFixed(range)}; ${Number(
					x[k][1]
				).toFixed(range)})<sup>T</sup></td>
                                            <td>${funcValue(func, x[k]).toFixed(range)}</td>
                                            <td>(${gradientV[0].toFixed(
																							range
																						)}; ${gradientV[1].toFixed(range)})<sup>T</sup></td>
                                            <td>${normV.toFixed(range)}</td>
                                            <td>${detHesseMatrix(H, x[k])}</td>
                                            <td>${detInverseHesseMatrix(H, x[k]).toFixed(
																							range
																						)}</td>
                                            <td>(${d[0].toFixed(range)}; ${d[1].toFixed(
					range
				)})<sup>T</sup></td>
                                            <td>${t}</td>
                                            <td>(${x[k + 1][0].toFixed(range)}; ${x[
					k + 1
				][1].toFixed(range)})<sup>T</sup></td>
                                            <td>${(
																							funcValue(func, x[k + 1]) - funcValue(func, x[k])
																						).toFixed(range)}</td></tr>`;

				if (
					normValue([x[k + 1][0] - x[k][0], x[k + 1][1] - x[k][1]]) < E1 &&
					Math.abs(funcValue(func, x[k + 1]) - funcValue(func, x[k])) < E1
				) {
					solutionBoxes[3].style.visibility = "visible";
					answers[3].innerHTML += `<br><b>Решение:</b> { x* = ( ${Number(x[k][0]).toFixed(
						range
					)}; ${Number(x[k][1]).toFixed(range)}); f(x*) = ${funcValue(func, x[k]).toFixed(
						range
					)} } <br>`;
					solutions[3].innerHTML += `<tr><td>-</td> 
                                                <td>${k + 1}</td>
                                                <td>(${Number(x[k][0]).toFixed(range)}; ${Number(
						x[k][1]
					).toFixed(range)})<sup>T</sup></td>
                                                <td>${funcValue(func, x[k + 1]).toFixed(range)}</td>
                                                <td>(${gradValue(gradient, x[k + 1])[0].toFixed(
																									range
																								)}; ${gradValue(gradient, x[k + 1])[1].toFixed(
						range
					)})<sup>T</sup></td>
                                                <td>${normValue(
																									gradValue(gradient, x[k + 1])
																								).toFixed(range)}</td>
                                                <td>${detHesseMatrix(H, x[k])}</td>
                                                <td>${detInverseHesseMatrix(H, x[k]).toFixed(
																									range
																								)}</td>
                                                <td>(${d[0].toFixed(range)}; ${d[1].toFixed(
						range
					)})<sup>T</sup></td>
                                                <td>${t}</td><td>-</td><td>-</td></tr>`;
					solution = true;
					break;
				} else {
					k++;
					interation++;
					break;
				}
			}
		}
	}
});

solveButtons[4].addEventListener("click", function () {
	solutions[4].innerHTML = "";
	answers[4].innerHTML = "";

	let E = initials[26].value,
		k = 0,
		r = [],
		x = [],
		F = [],
		gEquality = [],
		gInequality = [],
		func = parseFunction(document.getElementById("function2").value.split("")),
		solution = false,
		range = ranges[4].value,
		interation = 1;

	// ограничения типа равенствро
	gEquality[0] = [
		{
			index: 1,
			x1: "x1",
			exp1: 1,
			x2: "",
			exp2: 1,
		},
		{
			index: -1,
			x1: "",
			exp1: 1,
			x2: "",
			exp2: 1,
		},
	];

	// ограничения типа неравенство
	gInequality[0] = [
		{
			index: 1,
			x1: "x1",
			exp1: 1,
			x2: "",
			exp2: 1,
		},
		{
			index: 1,
			x1: "",
			exp1: 1,
			x2: "x2",
			exp2: 1,
		},
		{
			index: -2,
			x1: "",
			exp1: 1,
			x2: "",
			exp2: 1,
		},
	];

	r[k] = initials[27].value;
	x[k] = [initials[24].value, initials[25].value];

	// F.push(func);
	// F[0].push({
	// 	index: P(gEquality[0], gInequality[0], r[0], x[0]),
	// 	x1: "",
	// 	exp1: 1,
	// 	x2: "",
	// 	exp2: 1,
	// });

	//FValue(F, func, gEquality[0], gInequality[0], r[k], x[k], k);

	while (!solution) {
		FValue(F, func, gEquality[0], gInequality[0], r[k], x[k], k);

		console.log("F[k]");
		console.log(F[k]);

		let t = 0.5,
			gradient = grad(F),
			a = 0,
			xm = [],
			min = false,
			minX;

		xm[a] = [0, 0];

		console.log("FValue");
		console.log(funcValue(F, xm[k]));
		console.log("gradient");
		console.log(gradient);

		// поиск минимума F
		while (!min) {
			let gradientV = gradValue(gradient, xm[a]),
				normV = normValue(gradientV);

			console.log("gradientV");
			console.log(gradientV);
			console.log("normV");
			console.log(normV);

			if (normV < E) {
				minX = xm[a];
				min = true;
				break;
			} else {
				while (true) {
					console.log("xm");
					console.log(xm[a]);

					xm[a + 1] = nextXfirst(xm[a], t, gradient);

					console.log("funcValue(F, xm[a + 1])");
					console.log(funcValue(F, xm[a + 1]));
					console.log("funcValue(F, xm[a])");
					console.log(funcValue(F, xm[a]));
					// if (funcValue(F, xm[a + 1]) - funcValue(F, xm[a]) < 0) {
					// 	if (
					// 		normValue([xm[a + 1][0] - xm[a][0], xm[a + 1][1] - xm[a][1]]) < E &&
					// 		Math.abs(funcValue(F, xm[a + 1]) - funcValue(F, xm[a])) < E
					// 	) {
					// 		minX = xm[a + 1];
					// 		console.log("minX");
					// 		console.log(minX);
					// 		min = true;
					// 		break;
					// 	} else {
					// 		console.log("a++");
					// 		a++;
					// 		break;
					// 	}
					// } else {
					// 	console.log("t = t / 2");
					// 	t = t / 2;
					// }
				}
			}
		}

		// solutions[4].innerHTML += `<tr><td>${interation}</td> <td>${k}</td>
		// <td>(${Number(x[k][0]).toFixed(range)}; ${Number(x[k][1]).toFixed(range)})<sup>T</sup></td>
		// <td>${r[k]}</td>
		// <td>${funcValue(func, x[k])}</td>
		// <td>${P(gEquality[0], gInequality[0], r[k], x[k])}</td>
		// <td>${funcValue(F, x[k])}</td>
		// <td>(${Number(minX[0]).toFixed(range)}; ${Number(minX[1]).toFixed(range)})<sup>T</sup></td>
		// <td>${funcValue(F, minX)}</td>
		// <td>${P(gEquality, gInequality, r[k], minX)}</td>
		// </tr>`;

		if (P(gEquality, gInequality, r[k], minX) < E) {
			console.log("done");

			solutionBoxes[4].style.visibility = "visible";
			answers[4].innerHTML += `<br><b>Решение:</b> { x* = ( ${Number(minX[0]).toFixed(
				range
			)}; ${Number(minX[1]).toFixed(range)}); f(x*) = ${funcValue(func, minX).toFixed(
				range
			)} } <br>`;

			solution = true;
			break;
		} else {
			console.log("interation++");
			r.push(k * r[k]);
			x.push(minX);
			k++;
			interation++;
		}
	}
});

let FValue = function (F, func, gEquality, gInequality, r, x, k) {
	F.push(func);
	F[k].push({
		index: P(gEquality, gInequality, r[k], x[k]),
		x1: "",
		exp1: 1,
		x2: "",
		exp2: 1,
	});
};

let P = function (gEquality, gInequality, r, x) {
	let gPlus = funcValue(gInequality, x) > 0 ? funcValue(gInequality, x) : 0;
	return (r / 2) * (Math.pow(funcValue(gEquality, x), 2) + Math.pow(gPlus, 2));
};

// Разбитие входной функции на массив с объектами (слагаемыми)
let parseFunction = function (arr) {
	let numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
	let i = 0,
		x1 = "",
		index = 1,
		exp1 = 1,
		x2 = "",
		exp2 = 1,
		ntn = 0;
	let func = [];
	for (let j = 0; j < arr.length; j++) {
		if (arr[j] == "-" && index == 1 && x1 == "" && exp1 == 1 && x2 == "" && exp2 == 1) {
			index *= -1;
		} else if (arr[j] == "x") {
			arr[j + 1] == "1" ? (x1 = arr[j] + arr[j + 1]) : (x2 = arr[j] + arr[j + 1]);
			j++;
		} else if ((arr[j] == "+" || arr[j] == "-") && (x1 != "" || x2 != "" || index != 1)) {
			func[i] = new Element(index, x1, exp1, x2, exp2);
			arr[j] == "-" ? (index = -1) : (index = 1);
			x1 = "";
			exp1 = 1;
			x2 = "";
			exp2 = 1;
			i++;
		} else if (arr[j] == "^") {
			x2 != "" && exp2 == 1 ? (exp2 = Number(arr[j + 1])) : (exp1 = Number(arr[j + 1]));
			j++;
		} else if (arr[j] == "*") {
			x1 == "" ? (x1 = arr[j + 1] + arr[j + 2]) : x2 == "" ? (x2 = arr[j + 1] + arr[j + 2]) : ntn;
			j += 2;
		} else {
			for (let k = 0; k < numbers.length; k++) {
				if (arr[j] == numbers[k]) {
					index *= Number(arr[j]);
					break;
				}
			}
		}
		j == arr.length - 1
			? ((func[i] = new Element(index, x1, exp1, x2, exp2)),
			  (index = 1),
			  (x1 = ""),
			  (exp1 = 1),
			  (x2 = ""),
			  (exp2 = 1))
			: ntn++;
	}
	return func;
};

// Формирование матрицы Гессе
let HesseMatrix = function (gradient) {
	return [grad(gradient[0]), grad(gradient[1])];
};

// Вычисление определителя матрицы Гессе
let detHesseMatrix = function (H, x) {
	let H1 = H[0],
		H2 = H[1],
		elemValues = [];
	for (let i = 0; i < 2; i++) {
		elemValues[i] = funcValue(H1[i], x);
		elemValues[i + 2] = funcValue(H2[i], x);
	}
	return elemValues[0] * elemValues[3] - elemValues[1] * elemValues[2];
};

// Вычисление опредеителя обратной матрицы Гессе
let detInverseHesseMatrix = function (H, x) {
	let det = detHesseMatrix(H, x);
	let H1 = gradValue(H[0], x),
		H2 = gradValue(H[1], x),
		A = [];
	A[0] = H2[1] / det;
	A[1] = (-1 * H2[0]) / det;
	A[2] = (-1 * H1[1]) / det;
	A[3] = H1[0] / det;
	return A[0] * A[3] - A[1] * A[2];
};

// Вычисление значения функции в точке
let funcValue = function (func, x) {
	let ntn,
		value = [];
	for (let j = 0; j < func.length; j++) {
		value[j] = func[j].index;
		func[j].x1 != "" ? (value[j] *= Math.pow(x[0], func[j].exp1)) : ntn++;
		func[j].x2 != "" ? (value[j] *= Math.pow(x[1], func[j].exp2)) : ntn++;
	}
	return arrSum(value);
};

// Расчет градиента
let grad = function (func) {
	let gradX1 = [],
		gradX2 = [];
	for (let j = 0; j < func.length; j++) {
		if (func[j].x1 != "" && func[j].x2 == "") {
			// только A
			func[j].exp1 == 1
				? (gradX1[j] = new Element(
						func[j].index * func[j].exp1,
						"",
						func[j].exp1 - 1,
						func[j].x2,
						0
				  ))
				: (gradX1[j] = new Element(
						func[j].index * func[j].exp1,
						func[j].x1,
						func[j].exp1 - 1,
						func[j].x2,
						0
				  ));
			gradX2[j] = new Element(0, "", 0, "", 0);
		} else if (func[j].x1 == "" && func[j].x2 != "") {
			// только B
			func[j].exp2 == 1
				? (gradX2[j] = new Element(
						func[j].index * func[j].exp2,
						func[j].x1,
						0,
						"",
						func[j].exp2 - 1
				  ))
				: (gradX2[j] = new Element(
						func[j].index * func[j].exp2,
						func[j].x1,
						0,
						func[j].x2,
						func[j].exp2 - 1
				  ));
			gradX1[j] = new Element(0, "", 0, "", 0);
		} else if (func[j].x2 == "" && func[j].x1 == "") {
			// ни одного множителя
			gradX1[j] = new Element(0, "", 0, "", 0);
			gradX2[j] = new Element(0, "", 0, "", 0);
		} else if (func[j].x2 != "" && func[j].x1 != "") {
			// оба множителя
			func[j].exp1 == 1 // степень A = 1
				? (gradX1[j] = new Element(
						func[j].index * func[j].exp1,
						"",
						func[j].exp1 - 1,
						func[j].x2,
						func[j].exp2
				  ))
				: (gradX1[j] = new Element(
						func[j].index * func[j].exp1,
						func[j].x1,
						func[j].exp1 - 1,
						func[j].x2,
						func[j].exp2
				  ));
			func[j].exp2 == 1
				? (gradX2[j] = new Element(
						func[j].index * func[j].exp2,
						func[j].x1,
						func[j].exp1,
						"",
						func[j].exp2 - 1
				  ))
				: (gradX2[j] = new Element(
						func[j].index * func[j].exp2,
						func[j].x1,
						func[j].exp1,
						func[j].x2,
						func[j].exp2 - 1
				  ));
		}
	}
	return [gradX1, gradX2];
};

// Вычисление значение градиент в очке
let gradValue = function (grad, x) {
	let ntn,
		res = [];
	for (let i = 0; i < grad.length; i++) {
		let value = [];
		for (let j = 0; j < grad[i].length; j++) {
			value[j] = grad[i][j].index;
			if (value[j] != 0) {
				grad[i][j].x1 != "" ? (value[j] *= Math.pow(x[0], grad[i][j].exp1)) : ntn++;
				grad[i][j].x2 != "" ? (value[j] *= Math.pow(x[1], grad[i][j].exp2)) : ntn++;
			}
			res[i] = arrSum(value);
		}
	}
	return res;
};

// Вычисление нормы
let normValue = function (f) {
	let norm = 0;
	for (let i = 0; i < f.length; i++) norm += Math.pow(f[i], 2);
	return Math.sqrt(norm);
};

// Вычисление суммы элементов массива
let arrSum = function (arr) {
	let res = 0;
	for (let k = 0; k < arr.length; k++) res += arr[k];
	return res;
};

// Вычисление x^k+1 для метода спуска с постоянным шагом
let nextXfirst = function (xk, tk, grad) {
	return [xk[0] - tk * gradValue(grad, xk)[0], xk[1] - tk * gradValue(grad, xk)[1]];
};

let findTk = function (grad, xk, f) {
	let x = [];
	let gradV = gradValue(grad, xk);
	x[0] = xk[0] + "-" + gradV[0] + "*t";
	x[1] = xk[1] + "-" + gradV[1] + "*t";

	let ntn,
		newf = "";
	for (let j = 0; j < func.length; j++) {
		if (func[j].x1 != "" && func[j].x2 != "") {
			func[j].index != 1
				? func[j].index < 0
					? (newf += "-" + func[j].index + "*(" + x[0] + ")")
					: (newf += "+" + func[j].index + "*(" + x[0] + ")")
				: (newf += "+(" + x[0] + ")");
			func[j].exp1 != 1 ? (newf += "^" + func[j].exp1) : ntn++;
			newf += "*(" + x[1] + ")";
			func[j].exp2 != 1 ? (newf += "^" + func[j].exp2) : ntn++;
		} else if (func[j].x1 != "" && func[j].x2 == "") {
			func[j].index != 1
				? func[j].index < 0
					? (newf += "-" + func[j].index + "*(" + x[0] + ")")
					: (newf += "+" + func[j].index + "*(" + x[0] + ")")
				: (newf += "+(" + x[0] + ")");
			func[j].exp1 != 1 ? (newf += "^" + func[j].exp1) : ntn++;
		} else if (func[j].x2 != "" && func[j].x1 == "") {
			func[j].index != 1
				? func[j].index < 0
					? (newf += "-" + func[j].index + "*(" + x[1] + ")")
					: (newf += "+" + func[j].index + "*(" + x[0] + ")")
				: (newf += "+(" + x[1] + ")");
			func[j].exp2 != 1 ? (newf += "^" + func[j].exp2) : ntn++;
		}
	}
	console.log(newf);
};
