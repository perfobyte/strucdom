import {RawValueTags, Node, parse, SpaceCharacters, UnclosedHtmlTags, QuotesCharacters, document_to_string} from './0.js';

var v = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Parser Stress Test</title>

  <meta name="description" content="Parser test &quot;HTML stress&quot; example with nested tags and tricky attributes.">
  <link rel="stylesheet" href="style.css">
</head>
<body id="main" class="page test-page" data-info="x'y&quot;z &lt;3" hidden>

  <!-- HEADER SECTION -->
  <header class="header" role="banner">
    <h1 class='title "weird"' data-level="1">HTML Parser Test</h1>
    <nav class="nav">
      <ul>
        <li><a href="/" title='Home "page"'>Home</a></li>
        <li><a href="/about" title="About &gt; Us">About</a></li>
        <li><a href="/contact" disabled>Contact</a></li>
      </ul>
    </nav>
  </header>

  <!-- MAIN SECTION -->
  <main>
    <section id="intro">
      <p>Hello <b>World</b>!<br>This is a <i>stress</i> test of <code>&lt;HTML&gt;</code> parsing.</p>
      <img src="photo.jpg" alt='image > sample' width=300 height=200>
    </section>

    <!-- FORM TEST -->
    <section id="form-section">
      <form action="/submit" method="post" novalidate autocomplete="off">
        <input type="text" name="username" placeholder="Enter &quot;username&quot;" required>
        <input type="password" name="password" value='p@ss"word'>
        <input type="checkbox" name="agree" checked disabled>
        <textarea name="comments">Multiline
text &lt;div&gt; inside textarea
and quotes "here"</textarea>
        <button type="submit">Submit</button>
      </form>
    </section>

    <!-- TABLE TEST -->
    <section>
      <table border="1" cellpadding="2" cellspacing="0">
        <thead>
          <tr><th>ID</th><th>Name</th><th>Value</th></tr>
        </thead>
        <tbody>
          <tr><td>1</td><td>Alice</td><td>&amp;lt;test&gt;</td></tr>
          <tr><td>2</td><td>Bob</td><td>"quoted"</td></tr>
          <tr><td>3</td><td>Charlie</td><td>'single'</td></tr>
        </tbody>
      </table>
    </section>

    <!-- SCRIPT TEST -->
    

    <!-- COMMENT EDGE CASES -->
    <!-- single-line comment -->
    <!-- nested <!-- fake nested --> comment -->

    <!-- SVG TEST -->
    <svg width="100" height="100">
      <circle cx="50" cy="50" r="40" stroke="green" fill="yellow" />
      <text x="10" y="90">SVG &lt;text&gt;</text>
    </svg>

    <!-- VOID ELEMENTS -->
    <br>
    <hr>
    <input type="hidden" value="done">
    <meta charset="UTF-8">
    <link rel="icon" href="favicon.ico">
    <source src="audio.mp3" type="audio/mpeg">
  </main>

  <!-- FOOTER -->
  <footer>
    <p>Made with &lt;3 in 2025. Email: <a href="mailto:test@example.com">test@example.com</a></p>
  </footer>

</body>
</html>
`;
var doc = [];
var dom = parse(
    v,doc, 0,v.length,
    
    UnclosedHtmlTags, SpaceCharacters, QuotesCharacters,
    
    "",
    
    Node, Array,
);


console.log(document_to_string(doc,UnclosedHtmlTags));
