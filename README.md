# Running Saxon in Node.js with node-java

This is a port of one of the examples from S9APIExamples.java,
in the "additional resources" download of Saxon.

Here's the code in Java:

```java
// If not specified, the class name is in net.sf.saxon.s9api.*
Processor proc = new Processor(false);
XsltCompiler comp = proc.newXsltCompiler();
// java.io.File, javax.xml.transform.stream.StreamSource
XsltExecutable exp = comp.compile(new StreamSource(
  new File("styles/books.xsl")));
XdmNode source = proc.newDocumentBuilder().build(
  new StreamSource(new File("data/books.xml")));
Serializer out = proc.newSerializer(new File("books.html"));
out.setOutputProperty(Serializer.Property.METHOD, "html");
out.setOutputProperty(Serializer.Property.INDENT, "yes");
XsltTransformer trans = exp.load();
trans.setInitialContextNode(source);
trans.setDestination(out);
trans.transform();
System.out.println("Output written to books.html");
```

To run it:

```
npm install
./transform.js
```

Using [node-java-maven](https://github.com/joeferner/node-java-maven),
it automatically fetches the SaxonHE jar from Maven Central, during
the `npm install` (using the prepublish hook).

## Questions

### Resolving jar locations at runtime

It bothers me a little to have this code both in the fetch-saxon.js
script, and at the top of every script that will use the jars:

```js
var mvn = require('node-java-maven');
mvn({
    localRepository: './jars'
  },
  function(err, mvnResults) {
    ...
```

How does it resolve the jar location exactly? The directory can be
computed from $localRepository/$groupId/$artifactId/$version/,
then, I'm not sure exactly how it calculates the .jar filename.

Probably not a big deal. But, I should be able to specify
`localRepository` in package.json.
