// AXIOS dependencies
const axios = require("axios");

/**
* Simple axois get, with response data
* @param {String} urlWithParams 
* @param {Object} options 
*/
var axiosGet = function(urlWithParams, options){
	return new Promise(function(resolve, reject){
		axios.get(urlWithParams, options).then(response => {
			resolve(response.data)
		}).catch(e => {
			reject(e)
		})
	})
}

/**
* Simple axois post, with response data
* @param {String} urlWithParams 
* @param {Object} body 
* @param {Object} options 
*/
var axiosPost = function(url, body, options){
	return new Promise(function(resolve, reject){
		axios.post(url, body, options).then(response =>{
			resolve(response.data)
		}).catch(e => {
			reject(e)
		})
	})
}


/**
* Simple MailgunApi accessor class for reading event stream, and saved emails
* 
* Example usage
* ```
* let reader = new mailgunReader( { apiKey:"api-*****", emailDomain:"inboxkitten.com" })
* 
* // Returns a list of email recieve events
* reader.recipientEventList("some-domain.inboxkitten.com");
* 
* // Get and return the email json
* reader.getRecipentEmail("some-email-id");
* ```
*/
let mailgunReader = function mailgunReader(config) {
	
	// The config object being used
	this._config = config;
	
	// Validate the config for required parameters
	if( this._config.apiKey == null || this._config.apiKey.length <= 0 ) {
		throw new Error("Missing config.apiKey");
	}
	if( this._config.emailDomain == null || this._config.emailDomain.length <= 0 ) {
		throw new Error("Missing config.emailDomain");
	}
	
	// Default mailgun domain if not used
	this._config.mailgunApi = this._config.mailgunApi || "https://api.mailgun.net/v3";

	// Setup the authentication option object
	this._authOption = {
		username : "api",
		password : this._config.apiKey
	}
}

/**
 * Validate the request email against list of domains
 * 
 * @param {String} email 
 */
mailgunReader.prototype.recipientEmailValidation = function recipientEmailValidation(email) {
	// @TODO - the validation
	return true;
}

/**
 * Get and return a list of email events
 * 
 * See : https://documentation.mailgun.com/en/latest/api-events.html#event-structure
 * 
 * @param {String} email 
 * 
 * @return  Promise object, returning list of email events
 */
mailgunReader.prototype.recipientEventList = function recipientEventList(email) {
	// Validate email format
	if( !this.recipientEmailValidation(email) ) {
		return Promise.reject("Invalid email format : "+email);
	}

	// Compute the listing url
	let urlWithParams = this._config.mailgunApi+"/"+this._config.emailDomain+"/events?recipent="+email;

	// Lets get and return it with a promise
	return axiosGet(urlWithParams, this._authOption);
}

/**
 * Return the email object itself
 * 
 * See: https://www.mailgun.com/blog/how-to-view-your-messages
 */

// Export the mailgunReader class
module.exports = mailgunReader;