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
 
  Initial and main script for jbasis. Declare global vars and dependences system.
  
  Architecture and terminology:
    Url is a physical url or any string 
    Scope is abstract unit.
    Scope can require urls.
    Declaration url remove requirements of url in all scopes.
    Scope can declare urls.
    If scope has zero count of requires - it marked as completed.
    If scope completed and it can declare urls - scope must declare urls.
    Script can contains zero or more scopes. If script contains zero scopes and marked special 'nonCompatable' flag that script become whole scope without requires url and declare its physical url.
    Scope can call callback function between moments of zero count of requires and declaration of url.
    Scope require url. If url not declared already, start process lookup url as physical url. If found content of file executed. 
*/

/** @var ref to global scope */ 
this.$G = this;

/** @var ref to current window */ 
$G.$w = window;

/** @var ref to parent window */ 
$G.$pw = $w.parent;

/** @var ref to top window */ 
$G.$tw = $w.top;

/** @var ref to current document */ 
$G.$d = document;

/** @var ref to parent document */ 
$G.$pd = $pw.document;

/** @var ref to top document */ 
$G.$td = $tw.document;

/** @var ref to current document head */ 
$G.$h = $d.getElementsByTagName("head")[0];

/** @var ref to parent document head */ 
$G.$ph = $pd.getElementsByTagName("head")[0];

/** @var ref to top document head */ 
$G.$th = $td.getElementsByTagName("head")[0];

/** @var ref to current document documentElement */ 
$G.$de = $d.documentElement;

/** @var ref to parent document documentElement */ 
$G.$pde = $pd.documentElement;

/** @var ref to top document documentElement */ 
$G.$tde = $td.documentElement;

/** @var ref to global Object for temp vars. Usefull to avoid extra closures and global vars. Do not forgive delete already unnecessary vars */ 
$G.$temp = {};

/** @var ref to temp namespace of jbasis */ 
$jb.Temp_ = {};

/** @namespace($jb.Loader) contains functions and classes related with dependences system of jbasis */
if($jb.Loader == null)
  $jb.Loader = {};

/** @var map "full url" -> Boolean(true if inserted false else) */
$jb.Loader.urlLoadStatusMap_ = {};

/** @var map "declared url" -> Boolean(true if declared else false) */
$jb.Loader.declaredUrlMap_ = {};

/** @var map id -> $jb.Loader.Scope of all currently not completed scopes */
$jb.Loader.scopes_ = {nextId:0,els:{}};

/** @var array of {metaUrl:string, realUrl: string} for replace metaUrls to realUrls */
$jb.urlAliases = [{url:"$jb/",alias:$jb.Cfg.rootUrl}];

/**
  @fn replace meta pathes to physical equivalents
  @param url url to replace
  @return replaced url
*/
$jb._metaUrl = function(url)
{
  var ua = $jb.urlAliases, i = -1, len = ua.length;
  
  while(++i !== len)
    url = url.replace(ua[i].url, ua[i].alias);
  
  return url;
};

/** @var precached value of location protocol */
$jb.Loader.locProt_ = ""+location.protocol;

/** @var precomputed value of location protocol and hostname */
$jb.Loader.locProt_ = location.protocol;
$jb.Loader.locProtAndHost_ = location.protocol+"//"+location.hostname;

/** @var precached value of location pathname */
$jb.Loader.locPath_ = ""+location.pathname;
$jb.Loader.locPath_ = $jb.Loader.locPath_.substr(0, $jb.Loader.locPath_.lastIndexOf("/"))+"/";


/**
  @fn complements given url to full url ie "source/checkout" -> "http://code.google.com/p/jbasis/source/checkout"
  @param url url to complement
  @return complemented url
*/
$jb._fullUrl = function(url)
{
  var B = $jb.Loader;
  
  if(url.substr(0, 2) === "//")
  {
    url = B.locProt_+url;
  }
  else if(url.substr(0,B.locProt_.length)!=B.locProt_)
  {  
    var prefix = B.locProtAndHost_;
  
    if(url.charAt(0) !== "/")
      prefix += B.locPath_;
  
    url = prefix+url;
  }
  
  url=url.replace(/\/\.(?=\/)/g, "");
  
  var b,c,e;
  
  for( ;; )
  {
    c=url.indexOf("/../");
    
    if(c === -1)
      break;
    
    b = e = c;

    do
    {
      e += 4;
      b = url.lastIndexOf("/", b-1);
    }  
    while(url.substr(e,4) === "/../");
    
    url = url.substr(0, b)+url.substring(e-1);
  }
  
  return url;
};

/**
  @fn add event listeners for given script dom node
  @param v ref to script dom node
  @param _func callback function(scriptDomNode,resultState) where scriptDomNode is given script node 'v' and resultState takes values true if script loaded successfuly, false if not loaded and null if can not detect 
*/
$jb.Loader.__set_DOMNodeLoaded=function(v, _func)
{
  v.onload = function()
  {
    v.onreadystatechange = v.onerror = null;
    
    setTimeout
    (
      function()
      {
        v.onload = null;
        _func(v, true);
      },
      0
    );
  };
  v.onerror = function()
  {
    v.onreadystatechange = v.onload = null;
    
    setTimeout
    (
      function()
      {
        v.onerror = null;
        _func(v, false);
      },
      0
    );
  };
  v.onreadystatechange = function()
  {
    if(this.readyState !== "loaded" && this.readyState !== "complete")
      return;

    v.onload = v.onerror = null;
    
    setTimeout
    (
      function()
      {
        v.onreadystatechange = null;
        _func(v, null);
      },
      0
    );
  };
};

(function()
{
  var s = $h.getElementsByTagName("script")[0];
  
  var checkerBody="";
  
  if("readyState" in s)
  {
    checkerBody +=
      "var rs=v.readyState; \
      if(rs === 'loaded' || rs === 'complete')\
        return true; \
      else\
        return false;"
  }
  
  if($w.opera)
  {
    checkerBody +=
      "if(v.text != null) return true;";
  }
  
  checkerBody += "return null;";
  
  /**
    @fn try to check given script loaded state and declare script url. Can add listeners to detect state and declare later.  
    @param v ref to script node
  */
  $jb.Loader.__isDOMNodeLoaded=new Function("v", checkerBody);
  
})();


$jb.Loader.extToMimeMap =
{
  ".js": "text/javascript",
  ".css": "text/css",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
  ".png": "image/png"
};

$jb.Loader.resouceTypes =
[
  {
    canDeclareSelf: true,
    _isSameMime : function(mime)
    {
      return /text\/javascript.*|application\/(x-)?javascript.*|application\/ecmascript/.test(mime);
    },  
    _findLoadingUrls: function(_callback)
    {
      var L = $jb.Loader;
      var ss = $h.getElementsByTagName("script");
      var src, i = ss.length,s;
      
      while(i--)
      {
        if((src = (s = ss[i]).getAttribute("src")) != null)
          _callback($jb._fullUrl(src), L.__isDOMNodeLoaded(s));
      }
    },
    _load: function(mime, url, _result)
    {
      var L = $jb.Loader;
      var s = $d.createElement("script");
      
      s.src = url;
      s.type = mime;
      s.jb_ = {buildOrigUrl: url};
      //s.defer=true;
      
      if(_result != null)
      {
        L.__set_DOMNodeLoaded
        (
          s,
          function(v, isLoaded)
          {
            _result(v.jb_.buildOrigUrl, isLoaded);
            v.jb_ = null;
          }  
        );
      }  

      setTimeout(
        function()
        {
          $h.appendChild(s);
        },
        0
      );
      
      return null;
    }
  },
  {
    canDeclareSelf: false,
    _isSameMime: function(mime)
    {
      return /text\/css/.test(mime);
    },  
    sheetName_: ($d.recalc) ? "styleSheet" : "sheet", 
    _findLoadingUrls:function(_callback)
    {
      var L = $jb.Loader;
      var ls = $h.getElementsByTagName("link");
      var href, i = ls.length, link;
      var sheetName = this.sheetName_;
      
      while(i--)
      {
        link = ls[i];
        
        if(link.getAttribute("rel") === "stylesheet" && (href = link.getAttribute("href")) != null)
          _callback($jb._fullUrl(href), link[sheetName] != null);
      }
    },
    _load: function(mime, url, _result)
    {
      var L = $jb.Loader;
      var link = $d.createElement("link");
      
      //s.defer=true;
      
      if(_result != null)
      {
        this.__set_DOMNodeLoaded
        (
          link,
          function(v, isLoaded)
          {
            _result(v.jb_.buildOrigUrl, isLoaded);
            v.jb_ = null;
          }  
        );
      }  

      link.type = mime;
      
      link.jb_ = {buildOrigUrl: url};
      link.rel = "stylesheet";

      link.href = url;
      $h.appendChild(link);
      
      return null;
    },
    __set_DOMNodeLoaded: ($d.recalc || $w.opera) ? 
      $jb.Loader.__set_DOMNodeLoaded : 
      function(v,_fn)
      {
        var attempCount = 10;
        var sheetName = this.sheetName_;
        
        var id=setInterval(
          function()
          {
            if(v[sheetName] != null)
            {
              clearInterval(id);
              _fn(v, true);
            }
            else if(--attempCount === 0)
            {
              clearInterval(id);
              _fn(v, false);
            }
          },
          250
        );  
      }
  },
  {
    canDeclareSelf: false,
    _isSameMime: function(mime)
    {
      return /image\/.*/.test(mime);
    },  
    _findLoadingUrls: function(_callback)
    {
    },
    // http://lucassmith.name/2008/11/is-my-image-loaded.html
    _load: (function()
    {
      var prop;
      
      (function()
      {
        var img = new Image();
        
        try
        {
          img.src = "dddwndkj://jhbjhbjh.knkjnkjwn/jbjhbj.nknjknj";
        }
        catch(err)
        {
        
        };
        
        if(typeof(img.naturalWidth) !== 'undefined')
          prop = 'naturalWidth';
        else
          prop = 'width';
      })();  
      
      return function(mime, url, _result)
      {
        var L = $jb.Loader;
        var image = new Image();
        
        image.src = url;
        image.jb_ = {buildOrigUrl: url};
        
        if(image.complete)
        {
          var isLoaded = image[prop] > 0;
          
          if(_result != null)
            _result(url, isLoaded);
            
          return isLoaded;  
        }

        if(_result != null)
        {
          image.onload = function()
          {
            image.onerror = null;
            
            setTimeout(function(){ image.onload = null; _result(url, true); }, 0);
          };
          image.onerror = function()
          {
            image.onload = null;
            
            setTimeout(function(){ image.onerror = null; _result(url, false); }, 0);
          };
        }  

        return null;
      };
    })()
  }
];


/**
  @fn mark given url as declared and check scopes for complite
  @param url url for declare
*/
$jb.Loader._declareUrl = function(url)
{
  var obj = $jb.Loader.scopes_.els;
  var i;
  
  $jb.Loader.declaredUrlMap_[url] = true;
  
  for(i in obj)
  {
    if(obj.hasOwnProperty(i))
      obj[i].__resourceDeclared(url);
  }
};

/**
  @fn generic callback for all nonCompatable scripts. If script loaded or state can not detected declare script url
  @see $jb.Loader.__requireUrl
  @see $jb.Loader.__checkScriptLoaded
  @param v script node
  @param isLoaded true if loaded false if not null if can not detect
*/
$jb.Loader.__nonSelfDeclareLoaded = function(url, isLoaded)
{
  $jb.Loader.urlLoadStatusMap_[url] = isLoaded;
  
  if(isLoaded !== false)
    $jb.Loader._declareUrl(url);
};

$jb.Loader._urlExt = function(url)
{
  var begin = 0, end = url.length, point, i;
  
  if((i = url.lastIndexOf("#",end)) !== -1)
    end=i;
  
  if((i = url.lastIndexOf("?",end)) !== -1)
    end = i;
  
  if((i = url.lastIndexOf(".",end)) === -1)
    return null;

  point = i;
  
  if((i = url.lastIndexOf("/",end)) !== -1)
    begin = i;
  
  if(begin >= point)
    return null;
    
  return url.substring(point, end);
};

$jb.Loader._mimeByUrl = function(url)
{
  var L = $jb.Loader;
  var ext = L._urlExt(url);
  
  if(ext == null)
    return null;
  
  return L.extToMimeMap[ext];
};

$jb.Loader._rtByMime=function(mime)
{
  if(mime == null)
    return null;
    
  var L = $jb.Loader;
  var rts = L.resouceTypes, i = rts.length;
  
  while(i-- && rts[i]._isSameMime(mime) !== true)
    ;
    
  if(i === -1)
    return null;
    
  return rts[i];
};

$jb.Loader._load=function(url, _result, mime)
{
  var L = $jb.Loader;
  
  url = $jb._fullUrl($jb._metaUrl(url));
  
  if(url in L.urlLoadStatusMap_)
  {  
    if(_result == null)
      return L.urlLoadStatusMap_[url];
    else
      return _result(url, L.urlLoadStatusMap_[url]);
  }
  
  var rt = L._rtByMime(mime || (mime = L._mimeByUrl(url)));
  
  if(rt == null)
    throw new Error("[$jb.Loader] resouce type not found by url='"+url+"' and mime='"+mime+"'");
  
  return L.urlLoadStatusMap_[url] = rt._load(mime, url, _result);
};

/**
  @fn check if url declared already. Else create script dom node with given url to load and execute script file content. For nonCompatable script add loaded callback $jb.Loader.__nonCompableScriptLoaded which declare script url (see DESCRIPTION). 
  @param url required url 
  @param nonCompatable true if script not contains scopes. See DESCRIPTION. Optional 
  @return true if scope already declared else false
*/
$jb.Loader.__requireUrl=function(url, nonCompatable, mime)
{
  var L = $jb.Loader;
  
  if(url in L.declaredUrlMap_)
    return L.declaredUrlMap_[url];
  
  L.declaredUrlMap_[url] = false;
  
  var rt = L._rtByMime(mime || (mime = L._mimeByUrl(url)));
  
  if(rt == null)
    throw new Error("[$jb.Loader] resouce type not found by url='"+url+"' and mime='"+mime+"'");

  var _loaded;
  
  if(rt.canDeclareSelf !== true || nonCompatable === true)
    _loaded=L.__nonSelfDeclareLoaded;
  
  L.urlLoadStatusMap_[url] = rt._load(mime, url, _loaded);
  
  return false;
};

$jb.Loader.__init=function()
{
  var L = $jb.Loader;
  
  var _callback=function(url, isLoaded)
  {
    //console.log(url+" "+isLoaded);
    L.urlLoadStatusMap_[url] = isLoaded;
    L.declaredUrlMap_[url] = true;
  };

  var rTupes = L.resouceTypes, i = rTupes.length;
  
  while(i--)
    rTupes[i]._findLoadingUrls(_callback);
};

/** @class represent scope interface */
$jb.Loader.Scope=function()
{
  /** @var map "require url" -> declared state (true if declared else false) */
  this.requreMap_ = {};
  
  /** @var count of url not declared already but requring by this scope */
  this.pendingUrlCount_ = 0;
  
  /** @var map "will declare url"->true */
  this.willDeclareMap_ = {};
  
  /** @var callback that will be fired when all required urls declared */
  this.__completed = null;

  /** @var self id in $jb.Loader.scopes_ */
  this.selfId_ = $jb.Loader.scopes_.nextId;
  
  $jb.Loader.scopes_.els[this.selfId_] = this;
  ++$jb.Loader.scopes_.nextId;
  
  return this;
};  

/**
  @fn mark url as required for this scope
  @param url required url
  @param nonCompatable true if scope is non compatable. Optional
  @return this
*/ 
$jb.Loader.Scope.prototype._require=function(url, nonCompatable, mime)
{
  url = $jb._fullUrl($jb._metaUrl(url));
  
  if($jb.Loader.__requireUrl(url, nonCompatable) === true)
    return this;
  
  this.requreMap_[url] = false;
  ++this.pendingUrlCount_;
  
  return this;
};

/**
  @fn same as $jb.Loader.Scope._require but require if cond if true
  @param url require url
  @param nonCompatable true if scope is non compatable. Optional
  @return this
*/ 
$jb.Loader.Scope.prototype._requireIf=function(url, cond, nonCompatable, mime)
{
  if(cond)
    this._require(url, nonCompatable, mime);
    
  return this;  
};

/**
  @fn mark url as it will be declared if all required url declared 
  @param url will declared url
  @return this
*/ 
$jb.Loader.Scope.prototype._willDeclared=function(url)
{
  url = $jb._fullUrl($jb._metaUrl(url));

  this.willDeclareMap_[url] = true;
  
  return this;
};

/**
  @fn declare all urls marked as will declared  
*/ 
$jb.Loader.Scope.prototype._declareUrl=function()
{
  var _declareUrl = $jb.Loader._declareUrl;
  var obj = this.willDeclareMap_;
  
  for(var i in obj)
  {
    if(obj.hasOwnProperty(i))
      _declareUrl(i);
  };
};

/**
  @fn set callback to fire when all required urls declared
  @param _func callback
  @return this
*/ 
$jb.Loader.Scope.prototype._completed=function(_func)
{
  this.__completed = _func;
  
  if(this.pendingUrlCount_ > 0)
    return this;
  
  if(this.__completed != null)
    this.__completed();
  
  delete $jb.Loader.scopes_.els[this.selfId_];
  
  this._declareUrl();
  
  return this;
};

/**
  @fn this function must called on each declared url. If url was required mark as declared and decrise pending count. If pending count reaches 0 call completed callback and delete self from $jb.Loader.scopes_
  @param url declared url
  @return 0 if not all requires declared else 1
*/ 
$jb.Loader.Scope.prototype.__resourceDeclared=function(url)
{
  if(this.requreMap_[url] !== false)
    return 0;
  
  this.requreMap_[url] = true;
  --this.pendingUrlCount_;
  
  if(this.pendingUrlCount_ > 0)
    return 0;
  
  if(this.__completed != null)
    this.__completed();
  
  delete $jb.Loader.scopes_.els[this.selfId_];
  
  this._declareUrl();
  
  return 1;
};

/**
  @fn shotcut for new $jb.Loader.Scope()
  @return new scope
*/ 
$jb.Loader._scope=function()
{
  return new $jb.Loader.Scope();
};

$jb.Loader.__init();