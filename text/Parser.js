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

    if(tree[0] == 'markdown') {
      for(let i = 1; i < tree.length; i++) {
        this._parseBlock(tree[i]);
      }
    }
  }

  _parseBlock(block) {
    var blockType = block.shift();
    var string = '';

    if(blockType == 'header') {
      this.printer
        .center().bold(true);

      this._formatInlineText(block);

      this.printer
        .bold(false)
        .printLine('----------------')
        .left()
        .printLine()
        .printLine()
        .printLine();
    } else if(blockType == 'para') {
      this._formatInlineText(block);
    } else if(blockType == 'blockquote') {
      this.printer.indent(10);
      this._parseBlock(block[0]);
      this.printer.indent(0);
    } /*else if(blockType == 'bulletlist') {
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
     }*/

    return string + '\n';
  }

  _formatInlineText(block) {
    if(block.length > 1) {
      for(let i = 0; i < block.length; i++) {
        let chunk = block[i];

        if(typeof chunk === 'string') {
          this.printer.printText(chunk);
        } else {
          if(chunk[0] == 'strong') {
            this.printer
              .bold(true)
              .printText(chunk)
              .bold(false);
          } else if(chunk[0] == 'em') {
            this.printer
              .inverse(true)
              .printText(chunk)
              .inverse(false);
          }
        }
      }
    } else {
      this.printer.printText(block[0]);
    }
    this.printer
      .printLine()
      .printLine()
      .printLine();
  }
}

module.exports = Parser;