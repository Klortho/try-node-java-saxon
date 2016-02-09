#!/usr/bin/env node --harmony_destructuring
'use strict';

var java = require("java");
java.asyncOptions = {
  asyncSuffix: undefined,     // Don't generate async methods
  syncSuffix: "",             // Sync methods use the base name(!!)
  promiseSuffix: undefined,   // Don't generate methods returning promises
};

var beforeTime = new Date().getTime();

var mvn = require('node-java-maven');
mvn({
    localRepository: './jars'
  },
  function(err, mvnResults) {
    console.log('node-java-maven took ' +
      (new Date().getTime() - beforeTime) + ' milliseconds to ' +
      'find the jars.');
    if (err) {
      return console.error('Could not resolve maven dependencies', err);
    }
    mvnResults.classpath.forEach(function(c) {
      console.log('Adding ' + c + ' to classpath');
      java.classpath.push(c);
    });
    main();
  }
);


function main() {
  var System = java.import('java.lang.System');
  console.log('Java version: ' + System.getProperty('java.version'));

  // I explored a couple of ways to do multiple imports concisely.
  // Method 1. Use es6 destructuring assignment
  var [
    File,
    StreamSource,
    Processor,
    Serializer,
    XdmNode,
    XsltCompiler,
    XsltExecutable,
  ] =
  [
    'java.io.File',
    'javax.xml.transform.stream.StreamSource',
    'net.sf.saxon.s9api.Processor',
    'net.sf.saxon.s9api.Serializer',
    'net.sf.saxon.s9api.XdmNode',
    'net.sf.saxon.s9api.XsltCompiler',
    'net.sf.saxon.s9api.XsltExecutable',
  ]
  .map(function(fullName) {return java.import(fullName)});

  /*
  // Method 2. Use eval -- incompatible with 'use strict' above.
  // But I like
  var javaImports = {
    File:           'java.io.File',
    StreamSource:   'javax.xml.transform.stream.StreamSource',
    Processor:      'net.sf.saxon.s9api.Processor',
    Serializer:     'net.sf.saxon.s9api.Serializer',
    XdmNode:        'net.sf.saxon.s9api.XdmNode',
    XsltCompiler:   'net.sf.saxon.s9api.XsltCompiler',
    XsltExecutable: 'net.sf.saxon.s9api.XsltExecutable',
  };
  eval(
    Object.keys(javaImports).map(function(n) {
      return `var ${n} = java.import('${javaImports[n]}');`
    }).join('\n')
  );
  */

  var proc = new Processor(false);
  console.log('Saxon version: ', proc.getSaxonProductVersion());
  var comp = proc.newXsltCompiler();
  var exp = comp.compile(new StreamSource(new File('samples/books.xsl')));
  var source = proc.newDocumentBuilder().build(
    new StreamSource(new File('samples/books.xml')));
  var out = proc.newSerializer(new File('samples/books.html'));
  out.setOutputProperty(Serializer.Property.METHOD, 'html');
  out.setOutputProperty(Serializer.Property.INDENT, 'yes');
  var trans = exp.load();
  trans.setInitialContextNode(source);
  trans.setDestination(out);
  trans.transform();
  console.log('Output written to samples/books.html');
}