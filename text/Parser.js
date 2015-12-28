'use strict';

var markdown = require('markdown').markdown;

class Parser {
  constructor(printer) {
    if(!printer)
      throw new Error('Parser needs a printer object');

    this.printer = printer;
  }

  parse(text) {
    if(!this.printer)
      throw new Error('Parser needs a printer object at instanciation');

    var tree = markdown.parse(text);
    var parsedText = '';

    if(tree[0] == 'markdown') {
      for(let i = 1; i < tree.length; i++) {
        parsedText += this._parseBlock(tree[i]);
      }
    }

    return parsedText;
  }

  _parseBlock(block) {
    var blockType = block.shift();
    var string = '';

    if(blockType == 'header') {
      string = `<h1>${this._formatInlineText(block)}</h1>`;
    } else if(blockType == 'para') {
      string = `<p>${this._formatInlineText(block)}</p>`;
    } else if(blockType == 'blockquote') {
      return `<div class="blockquote">${this._parseBlock(block[0])}</div>`;
    } else if(blockType == 'bulletlist') {
      let list = '<ul>';
      for(let i = 0; i < block.length; i++) {
        list += this._parseBlock(block[i]);
      }
      return list + '</ul>';
    } else if(blockType == 'numberlist') {
      let list = '<ol>';
      for(let i = 0; i < block.length; i++) {
        list += this._parseBlock(block[i]);
      }
      return list + '</ol>';
    } else if(blockType == 'listitem') {
      return `<li>${this._formatInlineText(block)}</li>`;
    }

    return string + '\n';
  }

  _formatInlineText(block) {
    var string = '';
    if(block.length > 1) {
      for(let i = 0; i < block.length; i++) {
        let chunk = block[i];

        if(typeof chunk === 'string') {
          string += chunk;
        } else {
          if(chunk[0] == 'strong') {
            string += `<b>${chunk[1]}</b>`;
          } else if(chunk[0] == 'em') {
            string += `<em>${chunk[1]}</em>`;
          }
        }
      }
    } else {
      string = block[0];
    }
    return string.replace(/\r?\n/g, "<br>");
  }
}

module.exports = Parser;