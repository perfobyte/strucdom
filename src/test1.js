(()=>{var dt=Object.defineProperty;var B=(e,r)=>{for(var t in r)dt(e,t,{get:r[t],enumerable:!0})};var C={};B(C,{ATTRIBUTE_NODE:()=>c,COMMENT_NODE:()=>m,ELEMENT_NODE:()=>f,TEXT_NODE:()=>u});var f=1,c=2,u=3,m=8;var _=["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr","!doctype"];var $=["a","abbr","acronym","address","applet","area","article","aside","audio","b","base","basefont","bdi","bdo","bgsound","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","command","content","data","datalist","dd","del","details","dfn","dialog","dir","div","dl","dt","em","embed","fieldset","figcaption","figure","font","footer","form","frame","frameset","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","iframe","image","img","input","ins","isindex","kbd","keygen","label","legend","li","link","main","map","mark","marquee","menu","menuitem","meta","meter","nav","nobr","noembed","noframes","noscript","object","ol","optgroup","option","output","p","param","picture","plaintext","portal","pre","progress","q","rb","rp","rt","rtc","ruby","s","samp","script","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","title","tr","track","tt","u","ul","var","video","wbr","xmp"];var O=[" ","	",`
`,"\f","\r"];var w=['"',"'"];var H=["script","style"];var A={};B(A,{ATTRIBUTE_NODE:()=>c,COMMENT_NODE:()=>m,ELEMENT_NODE:()=>f,HtmlTags:()=>$,NodeType:()=>C,QuotesCharacters:()=>w,RawValueTags:()=>H,SpaceCharacters:()=>O,TEXT_NODE:()=>u,UnclosedHtmlTags:()=>_,_inner_html:()=>W,_outer_html:()=>et,_text_content:()=>nt,append_child:()=>F,first_child:()=>X,get_attribute:()=>rt,has_child_nodes:()=>P,last_child:()=>V,next_sibling:()=>G,previous_sibling:()=>Q,quote_rgx:()=>ut,remove:()=>z,remove_child:()=>j,replace_with:()=>Y,set_attribute:()=>at});var X=function(){return this.children[0]};var V=function(){var e=this.children;return e[e.length-1]};var P=function(){return this.children.length>0};var F=function(e){var r=e.parent;return r&&r.remove_child(e),(e.parent=this).children.push(e)};var j=function(e){var r=0,t=this.children;return e.parent=null,(r=t.indexOf(e))===-1||t.splice(r,1),void 0};var G=function(){var e=null,r=null,t=0;return(e=this.parent)&&(t=(r=e.children).indexOf(this)+1)<r.length?r[t]:null};var Q=function(){var e=null,r=null,t=0;return(e=this.parent)&&(t=(r=e.children).indexOf(this)-1)>=0?r[t]:null};var Y=function(e){var r=null,t=null,a=0,o=e.parent;return o&&o.remove_child(e),(r=this.parent)?(this.parent=null,e.parent=r,(t=r.children)[t.indexOf(this)]=e):null};var z=function(){return this.parent.remove_child(this)};var J=function(e){for(var r=this.children,t=this.ATTRIBUTE_NODE,a="",o=0,n=r.length,d=null,i=0;o<n;o++)(i=(d=r[o]).type)!==t&&(a+=d.outer_html(e));return a};var T=function(e){return this.data};var W={[f]:J,[c]:T,[u]:T,[m]:T};var K=function(e){for(var r=this.children,t=this.ATTRIBUTE_NODE,a=this.name,o=`<${a}`,n="",d=0,i=r.length,p=null,S="",R="",l=0;d<i;d++)(l=(p=r[d]).type)===t&&(o+=` ${p.outer_html(e)}`);return(n=this.inner_html(e))?`${o}>${n}</${a}>`:e.includes(a)?`${o}>`:`${o}/>`};var Z=function(){return`<!--${this.data}-->`};var tt=function(){var e=this.data,r=this.name,t=this.SpaceCharacters,a=this.QuotesCharacters,o=0,n=t.length;return this.data.length>0?e.includes('"')?`${r}="${e.replace(this.quote_rgx,"&quot;")}"`:`${r}="${e}"`:r};var et={[f]:K,[c]:tt,[u]:T,[m]:Z};var rt=function(e,r){var t=this.children,a=this.constructor,o=this.ATTRIBUTE_NODE,n=0,d=t.length,i=null;t:{for(;n<d;n++)if((i=t[n]).type===o&&i.name===e){i.data=r,i.specified||(i.specified=!0);break t}t.push(new a(o,e,null,this,this.ownerDocument,r,!0))}};var at=function(e){for(var r=this.children,t=this.constructor,a=this.ATTRIBUTE_NODE,o=0,n=r.length,d=null,i=null;o<n;o++)if((i=r[o]).type===a&&i.name===e){d=i.data;break}return d};var ot=function(e){for(var r=this.children,t=this.TEXT_NODE,a=this.ELEMENT_NODE,o="",n=0,d=r.length,i=null,p=0;n<d;n++)(p=(i=r[n]).type)===t?o+=i.outer_html(e):p===a&&(o+=i.text_content(e));return o};var nt={[f]:ot,[c]:T,[u]:T,[m]:T};var ut=/"/g;function lt(e,r,t,a,o,n,d){this.name=r,this.children=t,this.parent=a,this.ownerDocument=o,this.data=n,this.specified=d,this.inner_html=this._inner_html[this.type=e],this.outer_html=this._outer_html[e],this.text_content=this._text_content[e]}lt.prototype=A;var k=lt;var v=(e,r,t,a,o,n,d,i,p,S)=>{for(var R=0,l="",D="",g="",h=t,y=0,M=0,b="",x=u,s=null,E=r,U=!1,ht=null,q=0,N=!1,L="";t<a;){if(l=e[t],x===u)if(l==="<")if(console.log(e.substring(t)),t>h&&E.push(new p(u,"#text",null,s,r,e.substring(h,t),!1)),(L=e[t+1])==="!"&&e[t+2]==="-"&&e[t+3]==="-"){for(h=t+=4;!(e[t]==="-"&&e[t+1]==="-"&&e[t+2]===">")&&t<a;)t++;E.push(new p(m,"#comment",null,s,r,e.substring(h,t),!1)),h=t+=3}else if(L==="/"){for(h=t+=2;e[t]!==">"&&t<a;)t++;s&&s.name===(D=e.substring(h,t).trim().toLowerCase())?E=(s=s.parent)?s.children:r:E=(s=s?s.parent:null)?s.children:r,h=++t,x=u;continue}else{for(t++;n.includes(e[t])&&t<a;)t++;for(h=t;t<a&&!n.includes(l=e[t])&&l!==">"&&l!=="/";)t++;s=new p(f,D=e.substring(h,t).toLowerCase(),new S,s,r,"",!1),E.push(s),E=s.children,U=o.includes(D),x=f}else t++;else{if(N){l===b&&(N=!1),t++;continue}if(!N&&d.includes(l)){b=l,N=!0,t++;continue}for(;n.includes(e[t])&&t<a;)t++;if(l=e[t],console.log(e.substring(t,t+10)),l==="/"&&e[t+1]===">")E=(s=s.parent)?s.children:r,h=t+=2,x=u;else if(l===">")U&&(E=(s=s.parent)?s.children:r),h=++t,x=u;else{for(h=t;!n.includes(l=e[t])&&l!=="="&&l!==">"&&l!=="/"&&t<a;)t++;for(y=t;n.includes(e[t])&&t<a;)t++;if((l=e[t])==="="){for(t++;n.includes(e[t])&&t<a;)t++;if((l=e[t])===">")g=i,t++,x=u;else{if((q=d.indexOf(l))===-1)for(M=t;!n.includes(l=e[t])&&l!==">"&&l!=="/"&&t<a;)t++;else for(b=d[q],M=++t;e[t]!==b&&t<a;)t++;g=e.substring(M,t),t++}}else l===">"&&(t++,x=u),g=i;y>h&&E.push(new p(c,e.substring(h,y).toLowerCase(),null,s,r,g,!1))}}t===h&&(console.log("\u26A0\uFE0F stuck at",t,"char:",JSON.stringify(e[t])),t++)}return R};var I=(e,r)=>{for(var t=0,a=e.length,o="";t<a;t++)o+=e[t].outer_html(r);return o};var st=`<!DOCTYPE html>
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

    <!-- STYLE TEST -->
    <style>
      .weird[data-x="1'2'3"]::after {
        content: '>';
      }
    </style>

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
`,it=[],He=v(st,it,0,st.length,_,O,w,"",k,Array);console.log(I(it,_));})();
//# sourceMappingURL=test1.js.map
