var request =  require('request');
var parseXML = require('xml2js').parseString;

class GooglePoetry {
  constructor(query, callback) {
    if (!query) {
      query = GooglePoetry._generateQuery();
    }

    this._askGoogle(query, callback);
  }

  _askGoogle(query, callback) {
    let url = 'http://google.com/complete/search?output=toolbar&q=' + encodeURIComponent(query);

    request(url, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        parseXML(body, (err, xmlObject) => {
          if(!err) {
            xmlObject = JSON.parse(JSON.stringify(xmlObject));
            xmlObject = xmlObject.toplevel.CompleteSuggestion;
            let results = [];
            for(var i = 0; i < xmlObject.length; i++) {
              let result = xmlObject[i].suggestion[0].$.data;
              if(result != query) { // Remove same suggest as query
                results.push(xmlObject[i].suggestion[0].$.data);
              }
            }
            callback(results);
          } else {
            console.error('Error parsing google suggest results', err);
          }
        });
      } else {
        console.error('Error when requesting google at', url);
      }
    });
  }

  static _generateQuery() {
    return "j'aime quand";
  }
}

module.exports = GooglePoetry;