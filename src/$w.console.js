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
 
  add support of console object
*/

$jb.Loader._scope().
_require("$jb/$G.String.js").
_require("$jb/$G.Object.js").
_require("$jb/$G.Function.js").

_willDeclared("$jb/$w.console.js").
_completed(function(){

if($w.console == null)
  console={};

console.indStep="  ";
console.selfFileName="$w.console.js";
console.isNotDumpDOMObjects=false;
console.initDeep=6;

console._dumpObject=function(obj, deep, ind)
{
  if(obj == null)
    return "null"; //typeof(obj);
  
  if(deep === 0)
    return "new "+typeof(obj)._capitalize()+"( /* deep === 0 */ )";
  
  if(obj._dumpToText != null)
    return obj.__dump(deep, ind);

  if(obj.tagName != null)
    return "/* DOM Node */ "+obj.tagName;
  
  if(obj.toString != null)
    return "/* undumpable object */ toString() = " + obj.toString();
  
  if(obj.toSource != null)
    return "/* undumpable object */ toSource() = " + obj.toSource();
    
  return "/* undumpable object */";
  
};

console.__checkExtend=function(obj, _filter, deep, ind)
{
  var t="";
  
  if(!obj._isEmptyAsObject(_filter))
    t+="._extend(" + obj.__dumpAsObject(deep, ind, _filter) + ")";
  
  return t;
};

Object.prototype.__dump=function(deep, ind, _filter)
{
  if(deep === 0)
    return "\n" + ind + "{\n" + ind + console.indStep + "/* deep == 0 */\n" + ind + "\n";
  
  if(console.isNotDumpDOMObjects && this.prototype === undefined)
  {
    var t=this.toString();
    
    return "\n" + ind + "{\n" + ind+console.indStep + "/* DOM Object " + t + " */\n" + ind + "}\n";
  }
  
  if(_filter == null)
    _filter=this._filterExtra;

  var t="";
  var nextInd=ind+console.indStep;
  var i=null;
  
  t+="\n" + ind + "{\n";
  
  var names=[], n=0, maxNameLen=-1;
  
  for(name in this)
  {
    if(!_filter(i, this))
      continue;
      
    names[n++]=name;
    
    if(name.length > maxNameLen)
      maxNameLen=name.length;
  }
  
  if(n > 0)
  {
    var i=-1;
    
    while(++i !== n)
    {
      t+=nextInd + "\"" + (name=names[i]) + "\"" + " "._mulNumber(maxNameLen-name.length) + " : " + console._dumpObject(this[i], deep-1, nextInd) + "\n";
    }
  }
  
  t+=ind+"}";
  
  return t;
};
Object.prototype.__dumpAsObject=Object.prototype.__dump;

Array.prototype._dumpToText=function(deep, ind)
{
  var t="", thisLen=this.length;
  var lenDigitCount=Math.ceil(Math.log(thisLen)/Math.LN10);
  var nextInd=ind + console.indStep;
  
  t+="\n" + ind + "[\n";
  
  var i=-1;
  while(++i !== thisLen)
  {
    t+=nextInd + "/* " + (""+i)._padLeft(lenDigitCount, " ") + " */ " + console._dumpObject(this[i], deep-1, nextInd) + ",\n";
  }
  
  t+=ind + "]";
  
  t+=console.__checkExtend(this, this._filterExtra, deep, ind);
  
  return t;
};

Date.prototype._dumpToText=function(deep, ind)
{
  return "new Date( \" "+this.toGMTString()+"\" )" + 
  console.__checkExtend(this,$jb.Filter._dateExtra, deep, ind);
};
String.prototype._dumpToText=function(deep, ind)
{
  return "\"" + this + "\"" + console.__checkExtend(this, this._filterExtra, deep, ind);
};
Number.prototype._dumpToText=function(deep, ind)
{
  return "" + this + console.__checkExtend(this, this._filterExtra, deep, ind);
};
Boolean.prototype._dumpToText=function(deep, ind)
{
  return "new Boolean( " + this + " )" + console.__checkExtend(this, this._filterExtra, deep, ind);
};
RegExp.prototype._dumpToText=function(deep, ind)
{
  return "" + this + console.__checkExtend(this, this._filterExtra, deep, ind);
};
Function.prototype._dumpToText=function(deep, ind)
{
  return "" + this + console.__checkExtend(this, this._filterExtra, deep, ind);
};

console._dumpObjects=function(args, deep, ind)
{
  if(deep === 0)
    return "/* deep==0 */";
  
  if(deep == null)
    deep=console.initDeep;
  
  if(ind == null)
    ind="";
    
  var t="";
  var i=-1, argsLen=args, a;
  
  while(++i !== argsLen)
  {
    if(typeof(a = args[i]) === "string")
      t+=a + c.__checkExtend(args[i], a._filterExtra, deep-1, ind);
    else
      t+=c._dumpObject(a, deep-1, ind);
  }
  
  return t;
};

if(console.Trace==null)
  console.Trace={};

console.Trace._makeTrace=$jb._null;

console.Trace.__tryFirefox=function()
{
  try
  {
    throw new Error("");
  }
  catch(err)
  {
    if(err.stack == null)
      return false;
  };

  (function()
  {
    var re=new RegExp(/^@(.*:?):([0-9]+)$/);

    console.Trace._makeTrace=function $w$console$Trace$_makeTrace()
    {
      var lines=[];
      var err;
      
      try
      {
        throw new Error("");
      }
      catch(someErr)
      {
        err=someErr;
      }
      
      var stackString=err.stack;
      var i=0, j;
      var reRes;
      var skipCount=1;
      var selfFileName=console.selfFileName;
      var reC=re;
      
      for( ;; )
      {
        i=stackString.indexOf("@",i);
        
        if(i === -1)
          break;
        
        j=stackString.indexOf("\n",i);
        
        reRes=reC.exec(stackString.substring(i, j));
        
        if(--skipCount < 0)
        {
          if(reRes[1].slice(-selfFileName.length) !== selfFileName)
            lines.push({file:reRes[1], line:+reRes[2]});
        }
        
        i=j;
      }
      
      return lines;
    };
  })();
  
  return true;
}

// big thanks to http://eriwen.com/javascript/js-stack-trace/
console.Trace.__tryOpera=function()
{
  try
  {
    throw new Error("test Error");
  }
  catch(err)
  {
    if(err.stacktrace==null || err.message==null)
      return false;
  
    if(err.stacktrace==false)
    {
      _warning("Fail to use Opera stacktrace\nReason: ",err.message);
      
      return false;
    }
  };

  (function()
  {
    var re=new RegExp(/^Line\s+([0-9]+) of (.*)/);

    console.Trace._makeTrace=function $w$console$Trace$_makeTrace()
    {
      var lines=[];
      var err;
      
      try
      {
        throw new Error("test Error");
      }
      catch(someErr)
      {
        err=someErr;
      }
      
      var stackString=err.stacktrace;
      var i=0, j;
      var reRes=null;
      var skipCount=1;
      
      for( ;; )
      {
        i=stackString.indexOf("Line",i);
        
        if(i === -1)
          break;
        
        j=stackString.indexOf("\n",i);
        
        reRes=re.exec(stackString.substring(i, j));
        
        if(--skipCount < 0)
        {
          if(reRes[2].slice(-selfFileName.length) !== selfFileName)
            lines.push({file:reRes[2], line:+reRes[1]});
        }

        i=j;
      }
      
      return lines;
    };
  })();
  
  return true;
}

console.Trace.__tryViaCaller=function()
{
  console.Trace.exeptFunctionNameMap=
  {
    "$w$console$Trace$_makeTrace":true,
    "$w$console$_dumpTrace":true,
    "$w$console$log":true,
    "$w$console$warning":true,
    "$w$console$error":true,
    "$w$console$assert":true
  };
  
  console.Trace._makeTrace=function $w$console$Trace$_makeTrace()
  {
    var limit=25;

    var lines=[];
    var t="";
    var i;
    var ind=console.indStep, nextInd=ind/*+console.indStep*/;
    var header, name, argNames, args;
    var minLen;
    var _func;

    for(_func=console.Trace._makeTrace.caller;limit>=0 && _func!=null;--limit, _func=_func.caller)
    {
      /* for stupid Google Chrome */
      if(typeof(_func._header) !== "function")
        continue;
        
      header=_func._header();
      name=_func._name(header);
      
      if(console.Trace.exeptFunctionNameMap[name]!=null)
        continue;

      t=header;
      t+="\n{\n";
      
      argNames=_func._argNames(header);
      args=_func.arguments;
      minLen=Math.min(argNames.length, args.length);
      
      for(i=0;i<minLen;++i)
      {
        t+=ind;
        t+=argNames[i];
        t+=" = ";
        t+=console._dumpObject(args[i], console.initDeep, nextInd)._cutRight("\n");
        t+="\n";
      }
      
      if(i<args.length)
      {
        minLen=args.length;
        
        for(;i<minLen;++i)
        {
          t+=ind;
          t+="n/a = ";
          t+=console._dumpObject(args[i],console.initDeep, nextInd);
          t+="\n";
        }
      }

      if(i<argNames.length)
      {
        minLen=argNames.length;

        for(;i<minLen;++i)
        {
          t+=ind;
          t+=argNames[i];
          t+=" = undefined\n";
        }
      }
      
      if(i === 0)
        t+=ind + "/* no args */\n";
      
      t+="}\n";
      
      lines.push({line:"n/a",file:t});
    }
    
    if(limit === 0)
      lines.push({line_:"n/a",file_:"..."});
      
    return lines;
  };
  
  return true;
};

console._dumpTrace=function $w$console$_dumpTrace(lines)
{
  if(lines == null)
    lines=console.Trace._makeTrace();

  if(lines == null)
    return "";
  
  var t="\nTrace\n";
  
  for(var i=0;i<lines.length;++i)
  {
    t+="[ " + lines[i].line + " ]\t" + lines[i].file + "\n";
  }
  
  return t;
};

$jb._log=$jb._null;
$jb._warning=$jb._null;
$jb._error=$jb._null;
$jb._assert=$jb._null;
  
console.__tryFireBug=function()
{
  if(window.console==null && window.loadFirebugConsole!=null)
    window.loadFirebugConsole();

  if(window.console==null)
    return false;
  
  var isOriginal=typeof(window.console.getFirebugElement)=="function";
  
  if(isOriginal)
  {
    $jb._log=function $_log()
    {
      console.info.apply(console, arguments);
      //console.trace();
    };
    $jb._warning=function $_warning()
    {
      console.warn.apply(console, arguments);
      console.trace();
    };
    $jb._error=function $_error()
    {
      console.error.apply(console, arguments);
      //console.trace();
    };
    $jb._assert=function $_assert(expr)
    {
      if(expr!=true)
        console.error("Assert failed");
    };
  }
  else
  {
    $jb._log=function $_log()
    {
      console.info.apply(console, arguments);
      console.trace();
    };
    $jb._warning=function $_warning()
    {
      console.warn.apply(console, arguments);
      console.trace();
    };
    $jb._error=function $_error()
    {
      console.error.apply(console, arguments);
      console.trace();
    };
    $jb._assert=function $_assert(expr)
    {
      if(expr!=true)
        console.error("Assert failed");
    };
  }
  
  return true;
};

console.__tryOperaNative=function()
{
  if(window.opera==null || typeof(window.opera.postError)!="function")
    return false;
  
  $jb._log=function $_log()
  {
    opera.postError("Log [ "+(new Date()).toGMTString()+" ]\n"+console._dumpObjects(arguments)+
    console._dumpTrace());
  };
  $jb._warning=function $_warning()
  {
    opera.postError("Warning [ "+(new Date()).toGMTString()+" ]\n"+console._dumpObjects(arguments)+
    console._dumpTrace());
  };
  $jb._error=function $_error()
  {
    opera.postError("Error [ "+(new Date()).toGMTString()+" ]\n"+console._dumpObjects(arguments)+
    console._dumpTrace());
  };
  $jb._assert=function $_assert(expr)
  {
    if(expr!=true)
      opera.postError("Assert failed [ "+(new Date()).toGMTString()+" ]"+
      console._dumpTrace());
  };
  
  return true;
};

console.__tryFirefoxNative=function()
{
  var consoleService=null;
  
  try
  {
    Components.utils.reportError("Test Error message");
    
    consoleService=Components.classes["@mozilla.org/consoleservice;1"]
    .getService(Components.interfaces.nsIConsoleService);
    
    consoleService.logStringMessage("Test log message");
  }
  catch(err)
  {
    consoleService=null;
  }
  
  if(consoleService==null)
    return false;
  
  $jb._log=function $_log()
  {
    consoleService.logStringMessage("Log [ "+(new Date()).toGMTString()+" ]\n"+
    console._dumpObjects(arguments)+console._dumpTrace());
  };
  $jb._warning=function $_warning()
  {
    Components.utils.reportError("Warning [ "+(new Date()).toGMTString()+" ]\n"+
    console._dumpObjects(arguments)+console._dumpTrace());
  };
  $jb._error=function $_error()
  {
    Components.utils.reportError("Error [ "+(new Date()).toGMTString()+" ]\n"+
    console._dumpObjects(arguments)+console._dumpTrace());
  };
  $jb._assert=function $_assert(expr)
  {
    if(expr!=true)
    {
      Components.utils.reportError("Assert failed [ "+(new Date()).toGMTString()+
      " ]\nTrace\n"+console._dumpTrace());
    }
  };
  
  return true;
};

console.__tryAlert=function()
{
  $jb._log=function $_log()
  {
    alert("Log [ "+(new Date()).toGMTString()+" ]\n"+
    console._dumpObjects(arguments)+console._dumpTrace());
  };
  $jb._warning=function $_warning()
  {
    alert("Warning [ "+(new Date()).toGMTString()+" ]\n"+
    console._dumpObjects(arguments)+console._dumpTrace());
  };
  $jb._error=function $_error()
  {
    alert("Error [ "+(new Date()).toGMTString()+" ]\n"+
    console._dumpObjects(arguments)+console._dumpTrace());
  };
  $jb._assert=function $_assert(expr)
  {
    if(expr!=true)
    {
      alert("Assert failed [ "+(new Date()).toGMTString()+
      " ]"+console._dumpTrace());
    }
  };
  
  return true;
};

console.__tryTopDiv=function()
{
  if(console.__tryTopDiv._keyHandler!=null)
  {
    return console.__tryTopDiv.div_!=null;
  }
  
  console.__tryTopDiv._keyHandler=function(e)
  {
    if(e==null)
      e=window.event;
      
    var div=console.__tryTopDiv.div_;
    
    if((e.keyCode || e.which)==74 && e.ctrlKey && (e.altKey+e.shiftKey)==1)
    {
      if(div.style.display=="none")
       div.style.display="";
      else
        div.style.display="none";
    }
    
    return true;
  };
  
  console.__tryTopDiv._appendText=function(text, className)
  {
    var textDiv=$d.createElement("div");
    
    text=text.toString()._escapeForHTML(true);
    
    // some cool features
    
    text=text.replace(
      /Trace([\s\S]*)/,
      "<a href=\"#\" onclick=\"$jb.Dom._toggleNodeShow(this.nextSibling); return false;\">Trace</a><div \ class=\"trace\" style=\"display:none;\">$1</div>"
    );
    
    textDiv.innerHTML=text;
    
    if(className!=null)
      textDiv.className=className;
    
    console.__tryTopDiv.div_.appendChild(textDiv);  
  };

  $jb.Build._scope().
  _require("$jb/ext/dom.js").
  _completed(function(){

  $jb._domReady(
    function()
    {
      //alert("!");
      var div=$d.createElement("div");
      
      div.style.cssText="display:none; z-index:10000; position:absolute; \
      left:10px; right:10px; top:10px; bottom: 50%; border: 3px black solid; \
      font-family: Courier New; font-size:8pt; background:#FFFFFF; padding:2px; \
      overflow:auto; color: black;";
      
      $b.appendChild(div);
      
      if($d.addEventListener)
        $d.addEventListener("keyup",console.__tryTopDiv._keyHandler, false);
      else if($d.attachEvent)
        $d.attachEvent("onkeyup",console.__tryTopDiv._keyHandler)
        
      console.__tryTopDiv.div_=div;
      
      $jb._log=function $_log()
      {
        console.__tryTopDiv._appendText("Log [ "+(new Date()).toGMTString()+" ]\n"+
        console._dumpObjects(arguments)+console._dumpTrace(),"log");
      };
      $jb._warning=function $_warning()
      {
        console.__tryTopDiv._appendText("Warning [ "+(new Date()).toGMTString()+" ]\n"+
        console._dumpObjects(arguments)+console._dumpTrace(),"warning");
      };
      $jb._error=function $_error()
      {
        console.__tryTopDiv._appendText("Error [ "+(new Date()).toGMTString()+" ]\n"+
        console._dumpObjects(arguments)+console._dumpTrace(),"error");
      };
      $jb._assert=function $_assert(expr)
      {
        if(expr!=true)
        {
          console.__tryTopDiv._appendText("Assert failed [ "+(new Date()).toGMTString()+
          " ]"+console._dumpTrace(),"error");
        }
      };
      
      if(console.__tryTopDiv._ready!=null)
        console.__tryTopDiv._ready();
    }
  );
  
  });
  
  return false;
};


console.__tryCacheAndWait=function(_checker)
{
  console.__tryCacheAndWait.msgCache__=[];
  
  console.__tryCacheAndWait._tryFlush=function()
  {
    if(!_checker())
      return false;
    
    var msgs=console.__tryCacheAndWait.msgCache__;
    
    for(var i=0;i<msgs.length;++i)
    {
      if(msgs[i]._hasSub("Log",0))
        $jb._log(msgs[i]);
      else if(msgs[i]._hasSub("Warning",0))
        $jb._warning(msgs[i]);
      else if(msgs[i]._hasSub("Error",0))
        $jb._error(msgs[i]);
      else
        $jb._log(msgs[i]);
    }
    
    msgs.splice(0, msgs.length);
    
    return true;
  };
  
  _checker._ready=console.__tryCacheAndWait._tryFlush;
  
  $jb._log=function $_log()
  {
    console.__tryCacheAndWait.msgCache__.push("Log [ "+(new Date()).toGMTString()+" ]\n"+
    console._dumpObjects(arguments)+console._dumpTrace());
    
    console.__tryCacheAndWait._tryFlush();
  };
  $jb._warning=function $_warning()
  {
    console.__tryCacheAndWait.msgCache__.push("Warning [ "+(new Date()).toGMTString()+" ]\n"+
    console._dumpObjects(arguments)+console._dumpTrace());

    console.__tryCacheAndWait._tryFlush();
  };
  $jb._error=function $_error()
  {
    console.__tryCacheAndWait.msgCache__.push("Error [ "+(new Date()).toGMTString()+" ]\n"+
    console._dumpObjects(arguments)+console._dumpTrace());

    console.__tryCacheAndWait._tryFlush();
  };
  $jb._assert=function $_assert(expr)
  {
    if(expr!=true)
    {
      console.__tryCacheAndWait.msgCache__.push("Assert failed [ "+(new Date()).toGMTString()+
      " ]"+console._dumpTrace());
      
      console.__tryCacheAndWait._tryFlush();
    }
  };
  
  return true;
};


console._methods=
[
  console.__tryFireBug,
  console.__tryFirefoxNative,
  //console.__tryOperaNative,
  //console.__tryAlert
  console.__tryCacheAndWait._fBind(this,[console.__tryTopDiv])
];

console.Trace._methods=
[
  console.Trace.__tryFirefox,
  console.Trace.__tryOpera,
  console.Trace.__tryViaCaller
];


console._init=function $_init()
{
  var i=0;
  
  while(i<console._methods.length && !console._methods[i]())
    ++i;
  
  $jb._log("Log started");
  
  i=0;

  while(i<console.Trace._methods.length && !console.Trace._methods[i]())
    ++i;
  
  if(i==console.Trace._methods.length)
    $jb._warning("Nothing trace method supported in this browser");
  
  return true;
};

console._init();


if(window.console && window.console.time && typeof(window.console.getFirebugElement) == "function")
{
  $jb._timerBegin=console.time;
  $jb._timerEnd=console.timeEnd;
}  
else
{
  $jb._timerBegin=function(name)
  {
    $jb._timerBegin.timers__[name]=new Date();
  };
  $jb._timerEnd=function(name)
  {
    var timer=$jb._timerBegin.timers__[name];
    
    if(timer==null)
      return;
    
    var dt=(new Date()).getTime()-timer.getTime();
    
    $jb._log(name,": ",dt);
    delete $jb._timerBegin.timers__[name];
    
    return dt;
  };

  $jb._timerBegin.timers__={};
}

});
