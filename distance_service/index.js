exports.convertDistance = (req, res) => {
    const unit = req.query.unit;
    const value = req.query.value;
  
    // Check for numeric value of the value parameter in the querystring
    if ( isNaN(value) ) {
        res.status(400).send('Value is not numeric (つω`｡)');
        return;
    }
  
    let responseValue;
  
    if (unit == "miles") {
        responseValue = milesToKm(value);
    } 
    else if (unit == "km"){
        responseValue = kmToMiles(value);
    }
    else if (unit == "feet"){
        responseValue = feetToMeters(value);
    }
    else if (unit == "meters"){
        responseValue = metersToFeet(value);
    }
    else {
        res.status(406).send('Sorry, I am unable to convert that unit (｡•́︿•̀｡)');
        return;
    }
  
    res.status(200).send(responseValue.toString());
  
  };
  
// HELPER FUNCTIONS
const milesToKm = miles => miles * 1.60934;
const kmToMiles = km => km * 0.621371;
const feetToMeters = km => km * 0.3281;
const metersToFeet = km => km * 3.281;