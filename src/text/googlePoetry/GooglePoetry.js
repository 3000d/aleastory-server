'use strict';

var request =  require('request');
var parseXML = require('xml2js').parseString;

var iconv = require('iconv-lite');

var Util = require('util/Util');
var dict = require('./dict');

class GooglePoetry {
  constructor(query, callback) {
    if (!query) {
      query = GooglePoetry.generateQuery();
    }

    this._askGoogle(query, callback);
  }

  _askGoogle(query, callback) {
    let url = 'http://google.com/complete/search?output=toolbar&q=' + encodeURIComponent(query);

    request({
      url,
      encoding: 'UTF-8'
    }, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        parseXML(body, (err, xmlObject) => {
          if(!err) {
            //xmlObject = JSON.parse(JSON.stringify(xmlObject));
            xmlObject = xmlObject.toplevel.CompleteSuggestion;
            let results = [];
            if(!xmlObject) {
              return;
            }

            for(var i = 0; i < xmlObject.length; i++) {
              let result = xmlObject[i].suggestion[0].$.data;
              if(result != query) { // Remove same suggest as query
                results.push(iconv.decode(iconv.encode(result, 'UTF-8'), 'UTF-8'));
                //results.push(entities.decode(result));
              }
            }
            callback({
              query,
              results: Util.getRandom(results, results.length < 3 ? results.length : 3)
            });
          } else {
            console.error('Error parsing google suggest results', err);
          }
        });
      } else {
        console.error('Error when requesting google at', url);
      }
    });
  }

  static generateQuery() {
    let sentences = Util.rand(dict);
    let query = "";

    switch(sentences.type) {
      case 'simple':
        query += Util.rand(sentences.words);
        break;
      case 'question':
        query += sentences.question + " ";
        query += Util.rand(sentences.words);
        break;
      case 'sentence':
        for(var i = 0; i < sentences.words.length; i++) {
          query += Util.rand(sentences.words[i]);
          if(i < sentences.words.length - 1) {
            query += " ";
          }
        }
        break;
    }

    return query;
  }
}

module.exports = GooglePoetry;