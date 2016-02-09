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
