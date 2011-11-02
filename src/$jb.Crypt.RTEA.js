/**
  @file
  @author  Fyodorov "bga" Alexander <bga.email@gmail.com>
 
  @section LICENSE
 
  Experimental common javascript RIA library http://github.com/bga/jbasis

  Copyright (c) 2009-2010, Fyodorov "Bga" Alexander <bga.email@gmail.com>
  All rights reserved.

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:
      * Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.
      * Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.
      * The name of the developer may not be used to endorse or promote
        products derived from this software without specific prior
        written permission.

  THIS SOFTWARE IS PROVIDED BY FYODOROV "BGA" ALEXANDER "AS IS" AND ANY EXPRESS OR
  IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
  IN NO EVENT SHALL FYODOROV "BGA" ALEXANDER BE LIABLE FOR ANY DIRECT, INDIRECT,
  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
  OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 
  @section DESCRIPTION
*/

$jb.Loader._scope().
_require("$jb/OOP.js").
//_require("$jb/$G.String.js").
//_require("$jb/$G.Object.js").
_require("$jb/$jb.Crypt.Base.js").
_willDeclared("$jb/$jb.Crypt.RTEA.js").

_completed(function($G, $jb){

//var String = $G.String;

if($jb.Crypt == null)
  $jb.Crypt = {};

// http://ru.wikipedia.org/wiki/RTEA
// pre method
$jb.Crypt.RTEA = function()
{
};

$jb.Crypt.RTEA._staticDeriveFrom($jb.Crypt.Base);

var RTEAProto = $jb.Crypt.RTEA.prototype;

RTEAProto.decryptFns = {};
RTEAProto.encryptFns = {};

/*
$G._rteaEncode = function(v, key)
{
  var a = v[0], b = v[1], r, kw = key.length, len = kw*4 + 31;
  
  r = -1; while(r < len)
  {
    a = 0|(a + b + ((b<<6)^(b>>8)) + key[(++r)%kw] + r);
    b = 0|(b + a + ((a<<6)^(a>>8)) + key[(++r)%kw] + r);
  }
  
  v[0] = a;
  v[1] = b;
}; 
 
$G._rteaDecode = function(v, key)
{ 
  var a = v[0], b = v[1], r, kw = key.length;
  
  r = kw*4 + 32; while(r)
  {
    //b -= a + ((a<<6)^(a>>8)) + key[r%kw] + r;
    b = 0|(b - (a + ((a<<6)^(a>>8)) + key[(--r)%kw] + r));
    a = 0|(a - (b + ((b<<6)^(b>>8)) + key[(--r)%kw] + r));
  }

  v[0] = a;
  v[1] = b;
};
*/

/* < I:\WebSite\p\jbasis\src\_toupl\$jb.RTEA.prototype.__genEncryptAlgo.toupl.js > */

/* <toupl> */

RTEAProto.__genEncryptAlgo = function(keyLen)
{  
  var t = '', len = keyLen*4 + 32, r;
t += "var/**/k0=ks[0],";
 r = keyLen; while(--r) { t += "k";
t +=  r ;
t += "=ks[";
t +=  r ;
t += "]+";
t +=  r ;
t += ",";
 } t += "";
 r = keyLen - 1; while(++r < len) { t += "k";
t +=  r ;
t += "=k";
t +=  r%keyLen ;
t += "+";
t +=  r - r%keyLen ;
t += ",";
 } t += "i=vs.length+1,a,b;while(i>=0){b=vs[(i-=2)];a=vs[i-1];a=0|(a+b+((b<<6)^(b>>>8))+k0);b=0|(b+a+((a<<6)^(a>>>8))+k1);";
 r = 1; while(++r < len) { t += "a=0|(a+b+((b<<6)^(b>>>8))+k";
t +=  r ;
t += ");";
 ++r; t += "b=0|(b+a+((a<<6)^(a>>>8))+k";
t +=  r ;
t += ");";
 } t += "vs[i]=b;vs[i-1]=a;}return/**/vs;";

  return new Function('vs, ks', t);
};
/* </toupl> */
/* </ I:\WebSite\p\jbasis\src\_toupl\$jb.RTEA.prototype.__genEncryptAlgo.toupl.js > */


/* < I:\WebSite\p\jbasis\src\_toupl\$jb.RTEA.prototype.__genDecryptAlgo.toupl.js > */

/* <toupl> */

RTEAProto.__genDecryptAlgo = function(keyLen)
{  
  var t = '', len = keyLen*4 + 32, r;
t += "var/**/k0=ks[0],";
 r = keyLen; while(--r) { t += "k";
t +=  r ;
t += "=ks[";
t +=  r ;
t += "]+";
t +=  r ;
t += ",";
 } t += "";
 r = keyLen - 1; while(++r < len) { t += "k";
t +=  r ;
t += "=k";
t +=  r%keyLen ;
t += "+";
t +=  r - r%keyLen ;
t += ",";
 } t += "i=vs.length+1,a,b;while(i>=0){b=vs[(i-=2)];a=vs[i-1];";
 r = len; while(--r > 2) { t += "b=0|(b-a-((a<<6)^(a>>>8))-k";
t +=  r ;
t += ");";
 r--; t += "a=0|(a-b-((b<<6)^(b>>>8))-k";
t +=  r ;
t += ");";
 } t += "b=0|(b-a-((a<<6)^(a>>>8))-k1);a=0|(a-b-((b<<6)^(b>>>8))-k0);vs[i]=b;vs[i-1]=a;}return/**/vs;";

  return new Function('vs, ks', t);
};
/* </toupl> */
/* </ I:\WebSite\p\jbasis\src\_toupl\$jb.RTEA.prototype.__genDecryptAlgo.toupl.js > */


RTEAProto._encrypt = function(vs, ks)
{
  return (this.encryptFns[ks.length] || (this.encryptFns[ks.length] = this.__genEncryptAlgo(ks.length)))(vs, ks);
};

RTEAProto._decrypt = function(vs, ks)
{
  return (this.decryptFns[ks.length] || (this.decryptFns[ks.length] = this.__genDecryptAlgo(ks.length)))(vs, ks);
};

});