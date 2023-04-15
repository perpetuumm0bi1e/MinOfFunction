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

let functionInput = document.getElementById('function'),
    initials = document.getElementsByClassName('init');

let firstButton = document.getElementById('first-button');

class Element {
    constructor(index, base1, exp1, base2, exp2) {
        this.index = index;
        this.base1 = base1;
        this.exp1 = exp1;
        this.base2 = base2;
        this.exp2 = exp2;
    }
}

firstButton.addEventListener('click', function() {
    let numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let arr = functionInput.value.split('');
    let func = [];
    let i = 0,
        base1 = '',
        index = 1,
        exp1 = 1,
        base2 = '',
        exp2 = 1,
        ntn = 0;

    for (let j = 0; j < arr.length; j++) {
        if (arr[j] == '-' && index == 1 && base1 == '' && exp1 == 1 && base2 == '' && exp2 == 1) { 
            index *= -1;
        } else if (arr[j] == 'a' || arr[j] == 'b') { 
            (base1 == '') ? base1 = arr[j]: base2 = arr[j];
        } else if ((arr[j] == '+' || arr[j] == '-') && (base1 != '' || base2 != '' || index != 1)) { 
            let base, exp;
            ((base1 == 'b' && base2 == 'a') || (base1 == 'b' && base2 == '')) ? (base = base1, exp = exp1, base1 = base2, exp1 = exp2, base2 = base, exp2 = exp) : ntn++;
                func[i] = new Element(index, base1, exp1, base2, exp2);
                (arr[j] == '-') ? index = -1: index = 1;
                base1 = '';
                exp1 = 1;
                base2 = '';
                exp2 = 1;
                i++;
        } else if (arr[j] == '^') {
            (base2 != '' && exp2 == 1) ? exp2 = Number(arr[j + 1]): exp1 = Number(arr[j + 1]);
            j++;
        } else if (arr[j] == '*') {
            (base2 == '') ? base2 = arr[j + 1] : base1 = arr[j + 1];
            j++;
        } else {
            for (let k = 0; k < numbers.length; k++) {
                if (arr[j] == numbers[k]) {
                    index *= Number(arr[j]);
                    break;
                }
            }
        }
        let base, exp;
        ((base1 == 'b' && base2 == 'a') || (base1 == 'b' && base2 == '')) ? (base = base1, exp = exp1, base1 = base2, exp1 = exp2, base2 = base, exp2 = exp) : ntn++;
        (j == arr.length - 1) ?
        (func[i] = new Element(index, base1, exp1, base2, exp2), index = 1, base1 = '', exp1 = 1, base2 = '', exp2 = 1) : ntn++;
    }
    let gradient = grad(func); // массив объектов со значениями градиента
    let x01 = initials[0].value, 
        x02 = initials[1].value, 
        E1 = initials[2].value, 
        E2 = initials[3].value, 
        M = initials[4].value, 
        t0 = initials[5].value,
        x = [];
        x[0] = [x01, x02]; // шаг 1

    let solution = false;
    let k = 0, t = t0;
    while(!solution) {
        let gradientV = gradValue(gradient, x[k]); // шаг 2
        let normV = normValue(gradientV);

        console.log('Градиент в точке:' + gradientV); 
        console.log('Норма в точке:' + normV);
        console.log('Значение функции в точке:' + funcValue(func, x[k]));
        
        if(normV < E1){ // шаг 3
            console.log('Решение: { x* = (' + x[k][0] + ', ' + x[k][1] + '); f(x*) = ' + funcValue(func, x[k]) + ' }');
            solution = true;
            break;
        } else {
            while(true) {
                x[k + 1] = nextX(x[k], t, gradient); // шаг 5: вычисление xk

                console.log('x^k+1:' + x[k + 1]);
                console.log('f(x^k+1) - f(x^k) = ' + (funcValue(func, x[k + 1]) - funcValue(func, x[k])));

                if((funcValue(func, x[k + 1]) - funcValue(func, x[k])) < 0){ // шаг 6
                    console.log('f(x^k+1) - f(x^k) = ' + (funcValue(func, x[k + 1]) - funcValue(func, x[k])));
                    let newX = [x[k + 1][0] - x[k][0], x[k + 1][1] - x[k][1]];
                    if(normValue(newX) < E1 && Math.abs(funcValue(func, x[k + 1]) - funcValue(func, x[k + 1])) < E1){ // шаг 7
                        console.log('Решение: { x* = (' + x[k][0] + ', ' + x[k][1] + '); f(x*) = ' + funcValue(func, x[k]) + ' }');
                        solution = true;
                        break;
                    } else {
                        k++; // и к шагу 2
                        break;
                    }
                } else {
                    t /= 2; // и к шагу 5
                }
            }
        }
    }

    
});
// вычисление x^k+1
let nextX = function(xk, tk, grad){
    let x = [];
    let gradV = gradValue(grad, xk);
    console.log('gradV: ' + gradV);
    for(let i = 0; i < grad.length; i++){
        x[i] = xk[i] - tk * gradV[i];
    }
    return x;

}
// значение функции в точке
let funcValue = function(func, x){
    let ntn, res = 0, value = [];
    for(let j = 0; j < func.length; j++){
        value[j] = func[j].index;
        if(value[j] != 0){
            (func[j].base1 != '') ? value[j] *= Math.pow(x[0], func[j].exp1) : ntn++;
            (func[j].base2 != '') ? value[j] *= Math.pow(x[1], func[j].exp2) : ntn++;
        }
    }
    for(let k = 0; k < value.length; k++){
        res += value[k];
    }
    return res;
}
// значение градиент в очке
let gradValue = function(grad, x) {
    let ntn, res = [];
    for(let i = 0; i < grad.length; i++){
        let value = [];
        for(let j = 0; j < grad[i].length; j++){
            value[j] = grad[i][j].index;
            if(value[j] != 0){
                (grad[i][j].base1 != '') ? value[j] *= Math.pow(x[0], grad[i][j].exp1) : ntn++;
                (grad[i][j].base2 != '') ? value[j] *= Math.pow(x[1], grad[i][j].exp2) : ntn++;
            }
            res[i] = 0;
            for(let k = 0; k < value.length; k++){
                res[i] += value[k];
            }
        }
    }
    return res;
}

// вычисление нормы
let normValue = function(f) {
    let norm = 0;
    for(let i = 0; i < f.length; i++){
        norm += Math.pow(f[i], 2);
    }
    return Math.sqrt(norm);
}

// вычислние градиента
let grad = function(func) {
    let gradA = [],
        gradB = [];
    for (let j = 0; j < func.length; j++) {
        if (func[j].base1 != '' && func[j].base2 == '') { // только A
            (func[j].exp1 == 1) ?
            gradA[j] = new Element(func[j].index * func[j].exp1, '', func[j].exp1 - 1, func[j].base2, 0):
                gradA[j] = new Element(func[j].index * func[j].exp1, func[j].base1, func[j].exp1 - 1, func[j].base2, 0);
            gradB[j] = new Element(0, '', 0, '', 0);
        } else if (func[j].base1 == '' && func[j].base2 != '') { // только B
            (func[j].exp2 == 1) ?
            gradB[j] = new Element(func[j].index * func[j].exp2, func[j].base1, 0, '', func[j].exp2 - 1):
                gradB[j] = new Element(func[j].index * func[j].exp2, func[j].base1, 0, func[j].base2, func[j].exp2 - 1);
            gradA[j] = new Element(0, '', 0, '', 0);
        } else if (func[j].base2 == '' && func[j].base1 == '') { // ни одного множителя
            gradA[j] = new Element(0, '', 0, '', 0);
            gradB[j] = new Element(0, '', 0, '', 0);
        } else if (func[j].base2 != '' && func[j].base1 != '') { // оба множителя 
            (func[j].exp1 == 1) ? // степень A = 1
            gradA[j] = new Element(func[j].index * func[j].exp1, '', func[j].exp1 - 1, func[j].base2, func[j].exp2):
                gradA[j] = new Element(func[j].index * func[j].exp1, func[j].base1, func[j].exp1 - 1, func[j].base2, func[j].exp2);
            (func[j].exp2 == 1) ?
            gradB[j] = new Element(func[j].index * func[j].exp2, func[j].base1, func[j].exp1, '', func[j].exp2 - 1):
                gradB[j] = new Element(func[j].index * func[j].exp2, func[j].base1, func[j].exp1, func[j].base2, func[j].exp2 - 1);
        }
    }
    return [gradA, gradB];
    /*
    function gradStringer(gradArr){
        let gradString = ''
        for(let i = 0; i < gradArr.length; i++){
            let ind, ntn;
            (i == 0) ? ind = gradArr[i].index : ntn++;
            (gradArr[i].index > 0 && gradArr[i].index != 1 && i != 0) ? ind = '+' + gradArr[i].index : ntn++;
            (gradArr[i].index > 0 && gradArr[i].index == 1) ? ind = '+' : ntn++;
            (gradArr[i].index < 0 || gradArr[i].index == 0) ? ind = gradArr[i].index : ntn++;
            (gradArr[i].index == -1) ? ind = '-' : ntn++;
            let gradStringEl = ind;
            (gradArr[i].base1 != '') ? gradStringEl += gradArr[i].base1 : ntn++;
            (gradArr[i].exp1 != 0 && gradArr[i].exp1 != 1) ? gradStringEl += ('^' + gradArr[i].exp1) : ntn++;
            (gradArr[i].base2 != '') ? gradStringEl += gradArr[i].base2 : ntn++;
            (gradArr[i].exp2 != 0 && gradArr[i].exp2 != 1) ? gradStringEl += ('^' + gradArr[i].exp2) : ntn++;
            (gradStringEl == 0) ? gradStringEl = '+0' : ntn++;
            gradString += gradStringEl;
        }
        return gradString;
    }
    let gradAString = gradStringer(gradA), gradBString = gradStringer(gradB);
    //console.log('gradA:' + '\n' + gradAString + '\n' + 'gradB:' + '\n' + gradBString);
    let finalGradient = [gradAString, gradBString];
    */
}