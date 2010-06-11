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
_require("$jb/$jb.nav.js").
_willDeclared("$jb/$G.String.js").
_completed(function(){

var String = $G.String, RegExp = $G.RegExp;

/*
String.prototype._indexOfMultiFirst=function(startPos)
{
  if(startPos==null)
    startPos=0;
    
  var a=arguments;
  var tLen=this.length;
  var len=a.length;
  var i=1;
  var pos=startPos,newPos;
  
  while(i<len && pos<tLen)
  {
    newPos=this.indexOf(a[i],pos);
    
    if(newPos!=-1)
      pos=newPos+a[i].length;
    
    ++i;
  }
  
  return pos==startPos ? null : pos;
};
String.prototype._indexOfMultiLast=function(startPos)
{
  var a=arguments;
  var i=a.length-1;
  var pos=-1;
  
  while(i>=1 && (pos=this.indexOf(a[i],startPos))==-1)
    --i;
  
  return pos==-1 ? null : pos;
};
String.prototype._lastIndexOfMultiLast=function(startPos)
{
  if(startPos==null)
    startPos=this.length-1;
    
  var a=arguments;
  var i=a.length-1;
  var pos=startPos,newPos;
  
  while(i>=1 && pos>0)
  {
    newPos=this.lastIndexOf(a[i],pos);
    
    if(newPos!=-1)
      pos=newPos;
    
    --i;
  }
  
  return pos==startPos ? null : pos;
};
String.prototype._lastIndexOfMultiFirst=function(startPos)
{
  var i=1;
  var len=arguments.length;
  var pos=-1;
  
  while(i<len && (pos=this.lastIndexOf(arguments[i],startPos))==-1)
    ++i;
  
  return pos==-1 ? null : pos;
};
*/

String.nativeGlobalStringReplace = ("aa".replace("a", "b", "g") === "bb");
String.nativeDirectCharAccess = (function()
{
  try
  {
    var s = '123';
    
    return s[0] === '1';
  }
  catch(err)
  {
    return false;
  }
})();

if(String.nativeDirectCharAccess)
{
  (function()
  {
    var re = /\.\s*charAt\s*\(([^\)]*)\)/g;
    
    String._optimizeCharsAccess = function(str)
    {
      return str.replace(re, '[$1]');
    };
  })();  
}
else
{
  String._optimizeCharsAccess = function(str)
  {
    return str;
  };
}

if(String.nativeGlobalStringReplace)
{
  String.prototype._escapeForHTML = function(andBR)
  {
    var t = this.replace("&", "&amp;", "g").replace("<", "&lt;", "g").replace(">", "&gt;", "g");

    if(andBR)
      t = t.replace("\n", "<br />", "g");
      
    return t;  
  };
}
else
{
  (function()
  {
    var reLeft = /</g,
      reRight = />/g,
      reAmp = /&/g,
      reBR = /\n/g;
  
    String.prototype._escapeForHTML = function(andBR)
    {
      var t = this.replace(reAmp, '&amp;').replace(reLeft, '&lt;').replace(reRight, '&gt;');

      if(andBR)
        t = t.replace(reBR, '<br />');
        
      return t;
    };
  })();  
}

(function()
{
  var re = /[\[\]\(\)\{\}\?\!\:\|\+]/g;
  
  String.prototype._escapeForRegExp = function()
  {
    return this.replace(re, '\\$&');
  };
})();

if(String.nativeGlobalStringReplace)
{
  String.prototype._escapeForRegExpReplace = function()
  {
    return this.replace('$', '$$', 'g');
  };
}
else
{
  (function()
  {
    var re = /\$/g;
    
    String.prototype._escapeForRegExpReplace = function()
    {
      return this.replace(re, '\\$$');
    };
  })();
}  

(function()
{
  var re = /[\n\r\\\"\'\t\f\b\v]/g,
    _replacer;
  
  if($jb.nav._opera() || $jb.nav._webkit())
  {
    _replacer = function(c)
    {
      var a, hexMapC;
      
      switch(c)
      {
        case '\\': return '\\\\';
        case '\n': return '\\n';
        case '\r': return '\\r';
        case '\"': return '\\\"';
        case '\t': return '\\t';
        case '\b': return '\\b';
        case '\f': return '\\f';
        default: return c;
      }
    };
  }  
  else
  {
    var map =
    {
      '\n': '\\n',
      '\r': '\\r',
      '\\': '\\\\',
      '\'': '\\\'',
      '\'': '\\\'',
      '\t': '\\t',
      '\f': '\\f',
      '\b': '\\b',
      //'\a':'\\a',
      '\v': '\\v'
    };
    _replacer = function(str)
    {
      return map[str];
    };
  }  
  
  String.prototype._escapeForCString = function()
  {
    return this.replace(re, _replacer);
  };
})();

if(!String.nativeGlobalStringReplace)
{
  var _oldReplace = String.prototype.replace;
  var strToRegExpCache = {};
  
  String.prototype.replace = function(a0, a1, mode)
  {
    if(mode == null)
      return _oldReplace.call(this, a0, a1);
    
    if(typeof(a0) == 'string')
      a0 = strToRegExpCache[a0] || (strToRegExpCache[a0] = new RegExp(a0._escapeForRegExp(), mode));
    
    return _oldReplace.call(this, a0, a1);
  };
}

String.prototype.__mulNumber = function(n, prefix)
{
  n |= 0;
  prefix += '';
  
  if(n <= 0 || this.length == 0)
    return prefix;
  
  var str = '' + this;
  
  if(n <= 8) // experimental value
  {
    prefix += str;
    
    while(--n)
      prefix += str;
      
    return prefix;  
  }
  
  while(n)
  {
    if(n&1)
      prefix += str;
      
    n >>>= 1;
    str += str;
  }
  
  return prefix;
};
/*
String.prototype.__mulNumber2 = function(n, prefix)
{
  n |= 0;
  prefix += '';
  
  if(n <= 0 || this.length == 0)
    return prefix;
  
  var str = '' + this;
  
  if(n <= 8) // experimental value
  {
    prefix += str;
    
    while(--n)
      prefix += str;
      
    return prefix;  
  }
  
  var r = 1, a = n;;
  
  if(a > 0xFFFF)
  {
    r += 16;
    a >>>= 16;
  }  
  if(a > 0xFF)
  {
    r += 8;
    a >>>= 8;
  }  
  if(a > 0xF)
  {
    r += 4;
    a >>>= 4;
  }  

  switch(a)
  {
    case 3:
    case 2:
      r += 2;
      break;
    case 1:
      r += 1;
      break;
  }
  
  a = 1 << r;
  
  while(n)
  {
    if(n&a)
      prefix += str;
      
    n >>= 1;
    str += str;
  }
  
  return prefix;
};
*/
String.prototype._mulNumber = function(n)
{
  return this.__mulNumber(n, '');
};
String.prototype._append = function(str, n)
{
  return ('' + str).__mulNumber(n, this);
};
String.prototype._prepend = function(str, n)
{
  return ('' + str).__mulNumber(n, '') + this;
};

String.prototype._padLeft = function(len, filler)
{
  filler += '';

  return filler.__mulNumber((len - this.length)/filler.length, '') + this;
};
String.prototype._padRight = function(len, filler)
{
  filler += '';
  
  return filler.__mulNumber((len - this.length)/filler.length, this);
};

// s.slice(0, s.lastIndexOf(sep, pos) >>> 0);
String.prototype._cropRight = function(sep, pos)
{
  if(sep == null)
    return this;
  
  var i;
  
  if((i = this.lastIndexOf(sep, pos)) < 0)
    return this;
  
  return this.substr(0, i);
};

// s.slice(~(temp = s.indexOf(sep, pos)) && (temp + sep.length));
String.prototype._cropLeft = function(sep, pos)
{
  if(sep == null)
    return this;
  
  var i;
  
  if((i = this.indexOf(sep, pos)) < 0)
    return this;
  
  return this.substring(i + sep.length);
};

// (s.slice(0, temp = str.length) === str) ? s.slice(temp) : s
String.prototype._cutLeft = function(str)
{
  var i = str.length;
  
  return (this.substr(0, i) === str) ? this.substring(i) : this;
};

// (s.slice(temp = -str.length) === str) ? s.slice(temp) : s
String.prototype._cutRight = function(str)
{
  var i = -str.length;

  return (this.slice(i) === str) ? this.substr(0, i) : this;
};

String.prototype._requireLeft = function(str)
{
  return (this.substr(0, str.length) === str) ? this : str + this;
};
String.prototype._requireRight = function(str)
{
  return (this.slice(-str.length) === str) ? this : this + str;
};
String.prototype._require = function(strLeft, strRight)
{
  var isInLeft = this.substr(0, strLeft.length) === strLeft,
    isInRight = this.slice(-strRight.length) === strRight;
  
  return (isInLeft && isInRight) ? this : ((isInLeft) ? "" : strLeft) + this + ((isInRight) ? "" : strRight);
};

if(!String.prototype.trim)
{
  (function()
  {
    var re = /^\s+|\s+$/;
    
    String.prototype.trim = function()
    {
      return this.replace(re, '');
    };
  })();
}

var _fromCharCode = String.fromCharCode;

Number.prototype._asByteToString = function(n)
{
  return _fromCharCode(n);
};
Number.prototype._asWordToString = function(n)
{
  return _fromCharCode(n);
};
Number.prototype._asIntToString = function(n)
{
  return _fromCharCode(n&0xFFFF) + _fromCharCode((n>>16)&0xFFFF);
};

String.prototype._toByte = function()
{
  return this.charCodeAt(0)&0xFF;
};
String.prototype._toWord = function()
{
  return this.charCodeAt(0);
};
String.prototype._toInt = function()
{
  return this.charCodeAt(0)|(this.charCodeAt(1)<<16);
};

(function()
{
  var re=/\d/;
  
  String.prototype._extractIndex = function()
  {
    var i = this.search(re);

    if(i === -1)
      return null;

    return +this.substring(i);
  };
  String.prototype._extractName = function()
  {
    var i = this.search(re);

    if(i === -1)
      return null;

    return this.substr(0,i);
  };
})();

String.prototype._diffLengthLeft=null;
String.prototype._diffLengthRight=null;

if($jb.nav.ff_)
{
  String.prototype._diffLengthLeft = function(s2)
  {
    var i = -1,
      minLength = (this.length < s2.length) ? this.length : s2.length;
    
    while(++i < minLength && this.charAt(i) === s2.charAt(i))
      ;
    
    return i;
  };
  String.prototype._diffLengthRight=function(s2)
  {
    var tLen = this.length,sLen=s2.length;
    var i=tLen-1,j=sLen-1;
    
    if(tLen<sLen)
    {
      while(i >= 0 && this.charAt(i)==s2.charAt(j))
        --i,--j;
      
      return tLen-i-1;
    }
    else
    {
      while(i>=0 && this.charAt(i)==s2.charAt(j))
        --i,--j;
      
      return sLen-j-1;
    }
  };
}
else
{
  String.prototype._diffLengthLeft=function(s2)
  {
    var i=0;
    var minLength=this.length<s2.length?this.length:s2.length;
    
    while(i<minLength && this.charCodeAt(i)==s2.charCodeAt(i))
      ++i;
    
    return i;
  };
  String.prototype._diffLengthRight=function(s2)
  {
    var tLen=this.length,sLen=s2.length;
    var i=tLen-1,j=sLen-1;
    
    if(tLen<sLen)
    {
      while(i>=0 && this.charCodeAt(i)==s2.charCodeAt(j))
        --i,--j;
      
      return tLen-i-1;
    }
    else
    {
      while(i>=0 && this.charCodeAt(i)==s2.charCodeAt(j))
        --i,--j;
      
      return sLen-j-1;
    }
  };
}
String.prototype._diffLeft=function(s2)
{
  var i=this._diffLengthLeft(s2);
  
  return i<this.length?this.substring(i):"";
};
String.prototype._diffRight=function(s2)
{
  var i=this._diffLengthRight(s2);
  
  return i<this.length?this.substr(0,this.length-i):"";
};
String.prototype._diffAbsLeft=function(s2)
{
  var i=this._diffLengthLeft(s2);
  
  return i<this.length?this.substring(i):s2.substring(i);
};
String.prototype._diffAbsRight=function(s2)
{
  var i=this._diffLengthRight(s2);
  
  return i<this.length?this.substr(0,this.length-i):s2.substr(0,s2.length-i);
};

String.prototype._deepScanForward=function(strOpen,strClose,lvl,i,deep)
{
  if(deep==null)
    deep=0;
  if(lvl==null)
    lvl=1;
  if(i==null)
    i=0;

  var tLen=this.length;
  var soLen=strOpen.length,scLen=strClose.length;
  var i1=this.indexOf(strOpen,i);
  var i2=this.indexOf(strClose,i);

  while(lvl>0 || deep>0)
  {
    // open tag
    if(i1<i2)
    {
      ++deep;
      i=i1+soLen+1;
      
      i1=this.indexOf(strOpen,i);
      
      if(i1==-1)
        i1=tLen;
    }  
    // close tag
    else if(i2<i1)
    {
      --deep;
      i=i2+scLen+1;

      i2=this.indexOf(strClose,i);

      if(i2==-1)
        i2=tLen;
    }

    if(i2==tLen && i1==tLen)
      break;

    if(deep==0)
      --lvl;
  }

  if(lvl==0 && deep==0)
    return i;   

  return null;
};

String.prototype._deepScanBackward=function(strOpen,strClose,lvl,i,deep)
{
  var t=this;

  if(!_t(deep))
    deep=0;
  if(!_t(lvl))
    lvl=1;
  if(!_t(i))
    i=t.length;

  var i1,i2;

  while(lvl>0 || deep>0)
  {
    i1=t.lastIndexOf(strOpen,i);
    i2=t.lastIndexOf(strClose,i);

    i1=i1==-1?0:i1;
    i2=i2==-1?0:i2;

    // open tag
    if(i1>i2)
    {
      deep++;
      i=i1-strOpen.length-1;
    }
    // close tag
    else
    {
      deep--;
      i=i2-strClose.length-1;
    }

    if(deep==0)
      lvl--;
  }
  i+=strClose.length;

  return i;
};

(function()
{
  var _replacerMulti = function(str)
  {
    if(n !== 0)
    {
      --n;
      
      return str.toUpperCase();
    }
    else
    {
      return str;
    }  
  },
  _replacerSingle = function(str)
  {
    return str.toUpperCase();
  },
  re = /\b./g
  ;

  String.prototype._capitalize= function(n)
  {
    var _replacer = (n > 0) ? _replacerMulti : _replacerSingle;
    
    return this.replace(re, _replacer);
  };
})();
  
String.prototype._posToLineAndCol=function(pos,tabSpacesLength)
{
  if(pos==null || pos<0)
    return null;
  
  if(pos==0)
    return {line_:0,col_:0};
  
  if(tabSpacesLength==null)
    tabSpacesLength=8;
  
  var i=0,j;
  var line=-1;
  
  while(i!=-1 && i<pos)
  {
    j=i;
    i=this.indexOf("\n",i+1);
    ++line;
  }
  
  var col=0;

  i=j;

  while(i!=-1 && i<pos)
  {
    col+=i-j;
    j=i;
    i=this.indexOf("\t",i+1);
    col+=tabSpacesLength;
  }
  
  col+=pos-j;
  
  col-=tabSpacesLength;
  
  return {line_:line,col_:col};
}


});