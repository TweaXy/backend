/**
 * IsEmail
 * @method
 * @param {string} identifier - user identifer
 * @returns {boolean} -is identifer an email or not
 **/
const IsEmail=(input)=> {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(input);
  };
  
/**
 * IsPhoneNumber
 * @method
 * @param {string} identifier - user identifer
 * @returns {boolean} -is identifer a phone number or not
 **/
  const IsPhoneNumber=(input)=> {
    const phonePattern = /^\d{11}$/; 
    return phonePattern.test(input);
  };
  
/**
 * IsUsername
 * @method
 * @param {string} identifier - user identifer
 * @returns {boolean} -is identifer an username or not
 **/
  const IsUsername=(input)=> {
    const usernamePattern = /^[A-Za-z0-9_-]+$/; 
    return usernamePattern.test(input);
};
  
export {IsEmail, IsPhoneNumber,  IsUsername,};
  