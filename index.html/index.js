const checkCreditCard = cardnumber => {

   //Error messages
  const ccErrors = [];
  ccErrors [0] = "Unknown card type";
  ccErrors [1] = "No card number provided";
  ccErrors [2] = "Credit card number is in invalid format";
  ccErrors [3] = "Credit card number is invalid";
  ccErrors [4] = "Credit card number has an inappropriate number of digits";
  ccErrors [5] = "Warning! This credit card number is associated with a scam attempt";

   //Response format
   const response = (success, message = null, type = null) => ({
    message,
    success,
    type
  });
  const cards = [];
  cards [0] = {name: "Visa", 
               length: "13,16", 
               prefixes: "4",
               checkdigit: true};
  cards [1] = {name: "MasterCard", 
               length: "16", 
               prefixes: "51,52,53,54,55",
               checkdigit: true};

 // Ensure that the user has provided a credit card number
 if (cardnumber.length == 0)  {
    return response(false, ccErrors[1]);
 }
   
 // Now remove any spaces from the credit card number
 // Update this if there are any other special characters like -
 cardnumber = cardnumber.replace (/\s/g, "");
 
 // Validate the format of the credit card
 // luhn's algorithm
 if(!validateCardNumber(cardnumber)){
   return response(false, ccErrors[2]);
 }

 // Check it's not a spam number
 if (cardnumber == '5490997771092064') { 
   return response(false, ccErrors[5]);
 }

 // The following are the card-specific checks we undertake.
 let lengthValid = false;
 let prefixValid = false; 
 let cardCompany = "";
 
 // Check if card belongs to any organization
 for(let i = 0; i < cards.length; i++){
   const prefix = cards[i].prefixes.split(",");
   
   for (let j = 0; j < prefix.length; j++) {
     const exp = new RegExp ("^" + prefix[j]);
     if (exp.test (cardnumber)) {
       prefixValid = true;
     }
   }
   
   if(prefixValid){
     const lengths = cards[i].length.split(",");
     // Now see if its of valid length;
     for (let j=0; j < lengths.length; j++) {
       if (cardnumber.length == lengths[j]) {
         lengthValid = true;
       }
     }
   }
   
   if(lengthValid && prefixValid){
     cardCompany = cards[i].name;
     return response(true, null, cardCompany);
   }  
 }
 
 // If it isn't a valid prefix there's no point at looking at the length
 if (!prefixValid) {
    return response(false, ccErrors[3]);
 }
 
 // See if all is OK by seeing if the length was valid
 if (!lengthValid) {
    return response(false, ccErrors[4]);
 };   
 
 // The credit card is in the required format.
 return response(true, null, cardCompany);

}
      

