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
//_require("$jb/exceptions.js").
//_require("$jb/$jb.nav.js").
_willDeclared("$jb/$jb.Url.js").
_completed(function($G, $jb){

if($jb.Url == null)
  $jb.Url = {};

var Url = $jb.Url;  

var __declareBeginBased = function(name)
{
  var index = '_' + name + 'Index',
    endIndex = '__' + name + 'EndIndex';

  Url['_' + name + 'EndIndex'] = eval("0,(function(s)\
  {\
    return Url." + endIndex + "(s, Url." + index + "(s));\
  })");
  Url['_' + name + 'Length'] = eval("0,(function(s)\
  {\
    var begin = Url." + index + "(s);\
    \
    return Url." + endIndex + "(s, begin) - begin;\
  });");
  Url['_' + name] = eval("0, (function(s)\
  {\
    var begin = Url." + index + "(s);\
    \
    return s.substring(begin, Url." + endIndex + "(s, begin));\
  });");
};
var __declareEndBased = function(name)
{
  var index = '__' + name + 'Index',
    endIndex = '_' + name + 'EndIndex';

  Url['_' + name + 'Index'] = eval("0,(function(s)\
  {\
    return Url." + index + "(s, Url." + endIndex + "(s));\
  })");
  Url['_' + name + 'Length'] = eval("0,(function(s)\
  {\
    var end = Url." + endIndex + "(s);\
    \
    return end - Url." + index + "(s, end);\
  })");
  Url['_' + name] = eval("0,(function(s)\
  {\
    var end = Url." + endIndex + "(s);\
    \
    return s.substring(Url." + index + "(s, end), end);\
  })");
};

// (protocol://)(domian)(:port)(/path/)(name)(.ext)(?query)(#fragment)
Url._fragmentEndIndex = function(s)
{
  return s.length;
};
Url.__fragmentIndex = function(s, end)
{
  return ~(~s.lastIndexOf('#', end) || ~end);
};
__declareEndBased('fragment');

Url._queryEndIndex = function(s)
{
  return ~(~s.lastIndexOf('#') || ~s.length);
};
Url.__queryIndex = function(s, end)
{
  return ~(~s.lastIndexOf('?', end) || ~end);
};
__declareEndBased('query');

Url._extEndIndex = function(s)
{
  return ~(~s.lastIndexOf('?', 
      s.lastIndexOf('#') >>> 0
    ) || ~s.length);
};
Url.__extIndex = function(s, end)
{
  return Math.min(s.indexOf('.', s.lastIndexOf('/', end) + 1) >>> 0, end);
};

__declareEndBased('ext');

Url._nameEndIndex = function(s, begin)
{
  var p = Url._extEndIndex(s);
  
  return ~(~s.indexOf('.', s.lastIndexOf('/', p) + 1) || ~p);
};
Url._nameIndex = function(s)
{
  return s.lastIndexOf('/', Url._extEndIndex(s)) + 1;
};
Url._name = function(s)
{
  var p = Url._extEndIndex(s), q = s.lastIndexOf('/', p) + 1;
  
  return s.substring(q, ~(~s.indexOf('.', q) || ~p));
};
Url._nameLength = function(s)
{
  var p = Url._extEndIndex(s), q = s.lastIndexOf('/', p) + 1;
  
  return ~(~s.indexOf('.', q) || ~p) - q;
};


Url._pathIndex = function(s)
{
  var i = s.indexOf('://');
  
  return (i + 1) && ~(~s.indexOf('/', i + 3) || ~s.length);
};
Url._pathEndIndex = function(s)
{
  var p;
  
  return (s.lastIndexOf('/', 
      (p = ~(~s.lastIndexOf('?', s.lastIndexOf('#') >>> 0) || ~s.length))
    ) + 1) || p; 
};
Url._path = function(s)
{
  return s.substring(Url._pathIndex(s), Url._pathEndIndex(s));
};
Url._pathLength = function(s)
{
  return Url._pathEndIndex(s) - Url._pathIndex(s);
};

Url._portIndex = function(s)
{
  return Url._domainEndIndex(s);
};
Url.__portEndIndex = function(s, begin)
{
  var i;
  
  return (begin > 0 && s.charAt(begin) == ':' && (i = s.indexOf('/', begin)) > -1) ? i : begin;
};
__declareBeginBased('port');

Url._domainIndex = function(s)
{
  return Url._protocolEndIndex(s);
};
Url.__domainEndIndex = function(s, begin)
{
  return ~(~s.indexOf(':', begin) || ~s.indexOf('/', begin) || ~begin);
};
__declareBeginBased('domain');

Url.__protocolEndIndex = function(s, begin)
{
  var i = s.indexOf('://', begin);
  
  return (~i) ? i + 3 : begin;
};
Url._protocolIndex = function(s)
{
  return 0;
};
__declareBeginBased('protocol');

Url._winToUnix = function(s)
{
  return s.replace(/\\/g, '/');
};
Url._unixToWin = function(s)
{
  return s.replace(/\//g, '\\');
};

Url._normalizePath = function(s)
{
  s = s.replace(/\/(?:\.\/)+/g, '');
  
  var nb, b, c, e = 0;
  
  while((c = s.indexOf('/../', e)) > -1)
  {
    b = e = c;

    do
    {
      e += 4;
      b = nb;
      nb = s.lastIndexOf('/', b - 1);
    }  
    while(nb > -1 && s.substr(e, 4) == '/../');
    
    s = s.substr(0, b) + s.slice(e - 1);
  }
  
  return s;
};

Url._full = function(url, protocol, domainAndPort, path)
{
  if(url.substr(0, 2) == '//')
  {
    url = protocol + url;
  }
  else if(url.substr(0, protocol.length) != protocol)
  {  
    var prefix = protocol + '//' + domainAndPort;
  
    if(url.charAt(0) != '/')
      prefix += path;
  
    url = prefix + url;
  }
  
  return url;
};


/**
  @fn
  @example
    b       s          Url._relativePath(b, s)
    /       /a/     -> a/
    /a/     /       -> ../ 
    /a/     /a/b/   -> b/
    /a/b/   /a/     -> ../
    /a/b/c/ /a/     -> ../../
    /a/b/c/ /a/d/   -> ../../d/
    /a/d/   /a/b/c/ -> ../b/c/
*/    
Url._relativePath = function(b, s)
{
  var m = (b.length < s.length) ? b : s; 
  
  var op, p = 0;

  while((p = m.indexOf('/', (op = p + 1))) > -1 && b.slice(op, p) == s.slice(op, p))
    ;
    
  var r = '';
  
  if(p > -1)
  {  
    while((p = b.indexOf('/', p + 1)) > -1)
      r += '../';
  }  
  
  return r + s.slice(op);
};

});