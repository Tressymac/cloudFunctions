let inputMiles = 100;

// "Normal" syntax 
const milesToKM = function(miles){
    return miles * 1.60934;
};

// "Arrow Function" syntax
const milesToKM_arrow = (miles) => {
    return miles * 1.60934
};

// Short arrow function sytax
const milesToKM_short = miles => miles * 1.60934

console.log(milesToKM(inputMiles));
console.log(milesToKM_arrow(inputMiles));
console.log(milesToKM_short(inputMiles)); 