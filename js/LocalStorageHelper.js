var localStorageHelper = new LocalStorageHelper();

/**
 * Safe wrappers for localStorage methods.
 */
function LocalStorageHelper() {

  // Typeless values

  /**
   * A safe wrapper around the localStorage.getItem() function. According to the MDN documentation:
   * `The getItem() method of the Storage interface, when passed a key name, will return that key's value or null if the key does not exist.`
   * @param {string} keyName A DOMString containing the name of the key you want to retrieve the value of.
   * @return {string} A DOMString containing the value of the key. If the key does not exist, null is returned.
   */
  this.getItem = function(keyName) {
    try {
      return window.localStorage.getItem(keyName);
    }
    catch(e) {
      return null;
    }
  };

  /**
   * A safe wrapper around the Storage.setItem() function. According to the MDN documentation:
   * `The setItem() method of the Storage interface, when passed a key name and value, will add that key to the storage, or update that key's value if it already exists.`
   * @param {string} keyName A DOMString containing the name of the key you want to create/update.
   * @param {string} keyValue A DOMString containing the value you want to give the key you are creating/updating.
   */
  this.setItem = function(keyName, keyValue) {
    try {
      window.localStorage.setItem(keyName, keyValue);
    }
    catch(e) {
    }
  };

  // Boolean values

  /**
   * Retrieves a Boolean value from localStorage.
   * @param {string} keyName A DOMString containing the name of the key you want to retrieve the value of.
   * @return {boolean}
   */
  this.getBoolean = function(keyName) {
    var storedValue = this.getItem(keyName);
    if(storedValue === null) {return storedValue;}
    return storedValue === 'true';
  };

  this.setBoolean = this.setItem;

  // Integer values

  /**
   * Retrieves an integer value from localStorage.
   * @param {string} keyName A DOMString containing the name of the key you want to retrieve the value of.
   * @return {int}
   */
  this.getInt = function(keyName) {
    var storedValue = this.getItem(keyName);
    if(storedValue === null) {return storedValue;}
    return parseInt(storedValue);
  };

  this.setInt = this.setItem;

  // Float values

  /**
   * Retrieves a floating point number from localStorage.
   * @param {string} keyName A DOMString containing the name of the key you want to retrieve the value of.
   * @return {number}
   */
  this.getFloat = function(keyName) {
    var storedValue = this.getItem(keyName);
    if(storedValue === null) {return storedValue;}
    return parseFloat(storedValue);
  };

  this.setFloat = this.setItem;

  // Object values

  /**
   * Retrieves a JavaScript object from localStorage.
   * @param {string} keyName A DOMString containing the name of the key you want to retrieve the value of.
   * @return {Object}
   */
  this.getObject = function(keyName) {
    var storedValue = this.getItem(keyName);
    if (typeof storedValue !== "string") {
      return null;
    }
    return JSON.parse(storedValue);
  };

  /**
   * Retrieves a Boolean value from localStorage.
   * @param {string} keyName A DOMString containing the name of the key you want to create/update.
   * @param {Object} keyValue A JavaScript object containing the value you want to give the key you are creating/updating.
   */
  this.setObject = function(keyName, keyValue) {
    var valueToStore = JSON.stringify(keyValue);
    this.setItem(keyName, valueToStore);
  };
}
