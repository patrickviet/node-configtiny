// --------------------------------------------------------------------------
// Javascript implementation of read_string method from
// http://cpansearch.perl.org/src/ADAMK/Config-Tiny-2.14/lib/Config/Tiny.pm
// --------------------------------------------------------------------------
//
// Patrick Viet (patrick.viet@gmail.com) 2013
// https://github.com/patrickviet/node-configtiny/
//
// usage : put in node_modules/ directory, then
// var configtiny = require('configtiny');
// var conf = configtiny.read_file('path/to/ini_file');

// also added a read_and_override function...

var fs = require('fs');

exports.read_file = function(filename) {
  var content = String(fs.readFileSync(filename));
  
  var data = {};
  var section = '_';
  var counter = 0;
  
 
  var lines = content.split(/(?:\015{1,2}\012|\015|\012)/);
  for(num in lines) {
    counter++;
    var line = String(lines[num]);
    
    // get rid of comments
    if (line.match(/^\s*(?:\#|\;|$)/)) { continue; }
    
    // get rid of inline comments
    line = line.replace(/\s\;\s.+$/,'');
    
    // match section headers
    var m;
    if (m = line.match(/^\s*\[\s*(.+?)\s*\]\s*$/)) {
      section = m[1];
      if (!data.hasOwnProperty(section)) { data[section] = {}; }
      continue;
     }
    // match data
    if (m = line.match(/^\s*([^=]+?)\s*=\s*(.*?)\s*$/)) {
      data[section][m[1]] = m[2];
      continue;
    }
    
    // nothing matched? damn it!!
    throw 'error at line '+counter+' of file'+filename+': '+line;  
  }
  return data;
}

exports.read_and_override = function(file1,file2) {

  var data1 = exports.read_file(file1);
  var data2 = exports.read_file(file2);
  
  for(k1 in data2) {
    if (!data1.hasOwnProperty(k1)) { data1[k1] = {}; }
    for(k2 in data2[k1]) {
	  data1[k1][k2] = data2[k1][k2];
	}
  }

  return data1;
}
