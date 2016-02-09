#!/usr/bin/env node
// This runs with the prepublish hook, which means it runs every time
// the user enters `npm install` without any arguments.

// Note that this same code is repeated in transform.js -- it's needed
// there to set the classpath. It would be nice if I could set the
// options like localRepository in the package.json file.

var mvn = require('node-java-maven');
mvn({
    localRepository: './jars'
  },
  function(err, mvnResults) {
    if (err) {
      return console.error('Could not resolve maven dependencies', err);
    }
  }
);
