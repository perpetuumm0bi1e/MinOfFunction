function onEntry(entry) {
    entry.forEach(change => {
        if (change.isIntersecting) {
            change.target.classList.add('appeared');
        }
    });
}
let options = { threshold: [0.5] };
let observer = new IntersectionObserver(onEntry, options);
let elements = document.querySelectorAll('.appearance-animation');
for (let elm of elements) {
    observer.observe(elm);
}

let solutionBoxes = document.getElementsByClassName('solution-box'),
    solutions = document.getElementsByClassName('solution'),
    answers = document.getElementsByClassName('answer'),
    functionInput = document.getElementById('function'),
    initials = document.getElementsByClassName('init'),
    solveButtons = document.getElementsByClassName('solve-button');

let x01 = initials[0].value, 
    x02 = initials[1].value, 
    E1 = initials[2].value, 
    E2 = initials[3].value, 
    M = initials[4].value, 
    t0 = initials[5].value;

class Element {
    constructor(index, x1, exp1, x2, exp2) {
        this.index = index;
        this.x1 = x1;
        this.exp1 = exp1;
        this.x2 = x2;
        this.exp2 = exp2;
    }
}

solveButtons[0].addEventListener('click', function() {
    solutions[0].innerHTML = '';
    answers[0].innerHTML = '';
    let numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let arr = functionInput.value.split('');
    let func = [];
    let i = 0,
        x1 = '',
        index = 1,
        exp1 = 1,
        x2 = '',
        exp2 = 1,
        ntn = 0;

    for (let j = 0; j < arr.length; j++) {
        if (arr[j] == '-' && index == 1 && x1 == '' && exp1 == 1 && x2 == '' && exp2 == 1) { 
            index *= -1;
        } else if (arr[j] == 'x') { 
            (arr[j + 1] == '1') ? x1 = (arr[j] + arr[j + 1]) : x2 = (arr[j] + arr[j + 1]);
            j++;
        } else if ((arr[j] == '+' || arr[j] == '-') && (x1 != '' || x2 != '' || index != 1)) { 
                func[i] = new Element(index, x1, exp1, x2, exp2);
                (arr[j] == '-') ? index = -1: index = 1;
                x1 = '';
                exp1 = 1;
                x2 = '';
                exp2 = 1;
                i++;
        } else if (arr[j] == '^') {
            (x2 != '' && exp2 == 1) ? exp2 = Number(arr[j + 1]): exp1 = Number(arr[j + 1]);
            j++;
        } else if (arr[j] == '*') {
            (x1 == '') ? x1 = (arr[j + 1] + arr[j + 2]) : ((x2 == '') ? x2 = (arr[j + 1] + arr[j + 2]) : ntn);
            j+=2;
        } else {
            for (let k = 0; k < numbers.length; k++) {
                if (arr[j] == numbers[k]) {
                    index *= Number(arr[j]);
                    break;
                }
            }
        }
        (j == arr.length - 1) ?
        (func[i] = new Element(index, x1, exp1, x2, exp2), index = 1, x1 = '', exp1 = 1, x2 = '', exp2 = 1) : ntn++;
    }
    let gradient = grad(func); // массив объектов со значениями градиента

    x = [];
    x[0] = [x01, x02]; 
    let solution = false;
    let k = 0, t = t0;
    // метод градиентного спуска с постоянным шагом
    while(!solution) {
        if(k > M){
            break;
        }
        let gradientV = gradValue(gradient, x[k]);
        let normV = normValue(gradientV);
        solutions[0].innerHTML += `<br><b>k = ${k}:</b> <br><br> 
                                  ∇f(x<sup>k</sup>) = (${gradientV[0]}; ${gradientV[1]})<sup>T</sup> <br>
                                  || ∇f(x<sup>k</sup>) || = ${normV} <br>
                                  f(x<sup>k</sup>) = ${funcValue(func, x[k])} <br>`;
        if(normV < E1){ 
            console.log('Решение: { x* = (' + x[k][0] + ', ' + x[k][1] + '); f(x*) = ' + funcValue(func, x[k]) + ' }');
            answers[0].innerHTML += `Решение: { x* = ( ${x[k][0]}, ${x[k][1]}); f(x*) = ${funcValue(func, x[k])} } <br>`;
            solution = true;
            break;
        } else {
            while(true) {
                x[k + 1] = nextX(x[k], t, gradient); 
                solutions[0].innerHTML += `x<sup>k+1</sup> = (${x[k + 1][0]}; ${x[k + 1][1]})<sup>T</sup> <br>
                                          f(x<sup>k+1</sup>) - f(x<sup>k</sup>) = ${funcValue(func, x[k + 1]) - funcValue(func, x[k])} <br>`;
                if((funcValue(func, x[k + 1]) - funcValue(func, x[k])) < 0){ 
                    let newX = [x[k + 1][0] - x[k][0], x[k + 1][1] - x[k][1]];
                    if(normValue(newX) < E1 && Math.abs(funcValue(func, x[k + 1]) - funcValue(func, x[k + 1])) < E1){
                        console.log('Решение: { x* = (' + x[k][0] + ', ' + x[k][1] + '); f(x*) = ' + funcValue(func, x[k]) + ' }');
                        solutionBoxes[0].style.visibility = 'visible';
                        answers[0].innerHTML += `<br><b>Решение:</b> { x* = ( ${x[k][0]}, ${x[k][1]}); f(x*) = ${funcValue(func, x[k])} } <br>`;
                        solution = true;
                        break;
                    } else {
                        k++; 
                        break;
                    }
                } else {
                    t /= 2;
                }
            }
        }
    }
});

solveButtons[1].addEventListener('click', function() {
    solutionBoxes[1].style.visibility = 'visible';
});
solveButtons[2].addEventListener('click', function() {
    solutionBoxes[2].style.visibility = 'visible';
});
solveButtons[3].addEventListener('click', function() {
    solutionBoxes[3].style.visibility = 'visible';
});
let findTk = function(grad, xk, f){
    let x = [];
    let gradV = gradValue(grad, xk);
    x[0] = xk[0] + '-' + gradV[0] + '*t';
    x[1] = xk[1] + '-' + gradV[1]+ '*t';



    let ntn, newf = '';
    for(let j = 0; j < func.length; j++){
            if(func[j].x1 != '' && func[j].x2 != ''){
                (func[j].index != 1) ?
                (func[j].index < 0) ? (newf += '-' + func[j].index + '*(' + x[0] +')') : (newf += '+' + func[j].index + '*(' + x[0] +')') : newf += '+(' + x[0] +')';
                (func[j].exp1 != 1) ? newf += '^' + func[j].exp1 :  ntn++;
                newf += '*(' + x[1] +')';
                (func[j].exp2 != 1) ? newf += '^' + func[j].exp2 : ntn++;
        } else if (func[j].x1 != '' && func[j].x2 == ''){
            (func[j].index != 1) ?
            (func[j].index < 0) ? (newf += '-' + func[j].index + '*(' + x[0] +')') : (newf += '+' + func[j].index + '*(' + x[0] +')') : newf += '+(' + x[0] +')';
            (func[j].exp1 != 1) ? newf += '^' + func[j].exp1 :  ntn++;
        } else if(func[j].x2 != '' && func[j].x1 == ''){
            (func[j].index != 1) ?
            (func[j].index < 0) ? (newf += '-' + func[j].index + '*(' + x[1] +')') : (newf += '+' + func[j].index + '*(' + x[0] +')') : newf += '+(' + x[1] +')';
            (func[j].exp2 != 1) ? newf += '^' + func[j].exp2 :  ntn++;
        }
    }
    console.log(newf);
}
// вычисление x^k+1
let nextX = function(xk, tk, grad){
    return [xk[0] - tk * gradValue(grad, xk)[0], xk[1] - tk * gradValue(grad, xk)[1]];
}
// значение функции в точке
let funcValue = function(func, x){
    let ntn, value = [];
    for(let j = 0; j < func.length; j++){
        value[j] = func[j].index;
            (func[j].x1 != '') ? value[j] *= Math.pow(x[0], func[j].exp1) : ntn++;
            (func[j].x2 != '') ? value[j] *= Math.pow(x[1], func[j].exp2) : ntn++;
    }
    return arrSum(value);
}
// значение градиент в очке
let gradValue = function(grad, x) {
    let ntn, res = [];
    for(let i = 0; i < grad.length; i++){
        let value = [];
        for(let j = 0; j < grad[i].length; j++){
            value[j] = grad[i][j].index;
            if(value[j] != 0){
                (grad[i][j].x1 != '') ? value[j] *= Math.pow(x[0], grad[i][j].exp1) : ntn++;
                (grad[i][j].x2 != '') ? value[j] *= Math.pow(x[1], grad[i][j].exp2) : ntn++;
            }
            res[i] = arrSum(value);
        }
    }
    return res;
}

// вычисление нормы
let normValue = function(f) {
    let norm = 0;
    for(let i = 0; i < f.length; i++)
        norm += Math.pow(f[i], 2);
    return Math.sqrt(norm);
}

// вычислние градиента
let grad = function(func) {
    let gradA = [],
        gradB = [];
    for (let j = 0; j < func.length; j++) {
        if (func[j].x1 != '' && func[j].x2 == '') { // только A
            (func[j].exp1 == 1) ?
            gradA[j] = new Element(func[j].index * func[j].exp1, '', func[j].exp1 - 1, func[j].x2, 0):
                gradA[j] = new Element(func[j].index * func[j].exp1, func[j].x1, func[j].exp1 - 1, func[j].x2, 0);
            gradB[j] = new Element(0, '', 0, '', 0);
        } else if (func[j].x1 == '' && func[j].x2 != '') { // только B
            (func[j].exp2 == 1) ?
            gradB[j] = new Element(func[j].index * func[j].exp2, func[j].x1, 0, '', func[j].exp2 - 1):
                gradB[j] = new Element(func[j].index * func[j].exp2, func[j].x1, 0, func[j].x2, func[j].exp2 - 1);
            gradA[j] = new Element(0, '', 0, '', 0);
        } else if (func[j].x2 == '' && func[j].x1 == '') { // ни одного множителя
            gradA[j] = new Element(0, '', 0, '', 0);
            gradB[j] = new Element(0, '', 0, '', 0);
        } else if (func[j].x2 != '' && func[j].x1 != '') { // оба множителя 
            (func[j].exp1 == 1) ? // степень A = 1
            gradA[j] = new Element(func[j].index * func[j].exp1, '', func[j].exp1 - 1, func[j].x2, func[j].exp2):
                gradA[j] = new Element(func[j].index * func[j].exp1, func[j].x1, func[j].exp1 - 1, func[j].x2, func[j].exp2);
            (func[j].exp2 == 1) ?
            gradB[j] = new Element(func[j].index * func[j].exp2, func[j].x1, func[j].exp1, '', func[j].exp2 - 1):
                gradB[j] = new Element(func[j].index * func[j].exp2, func[j].x1, func[j].exp1, func[j].x2, func[j].exp2 - 1);
        }
    }
    return [gradA, gradB];
}

let arrSum = function(arr) {
    let res = 0;
    for(let k = 0; k < arr.length; k++)
        res += arr[k];
    return res;
}