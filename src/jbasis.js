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

(function($G)
{

var $jb = $G.$jb,
  setTimeout = $G.setTimeout,
  clearTimeout = $G.clearTimeout
  ;

/** @var ref to application global namespace */ 
$G.$A = {};

/** @var ref to current window */ 
var $w = $G.$w = window;

/** @var ref to parent window */ 
//$G.$pw = $w.parent;

/** @var ref to top window */ 
$G.$tw = $w.top;

/** @var ref to current document */ 
var $d = $G.$d = document;

/** @var ref to parent document */ 
//$G.$pd = $pw.document;

/** @var ref to top document */ 
//$G.$td = $tw.document;

/** @var ref to current document head */ 
var $h = $G.$h = $d.getElementsByTagName("head")[0];

/** @var ref to parent document head */ 
//$G.$ph = $pd.getElementsByTagName("head")[0];

/** @var ref to top document head */ 
//$G.$th = $td.getElementsByTagName("head")[0];

/** @var ref to current document documentElement */ 
$G.$de = $d.documentElement;

/** @var ref to parent document documentElement */ 
//$G.$pde = $pd.documentElement;

/** @var ref to top document documentElement */ 
//$G.$tde = $td.documentElement;

/** @var ref to global Object for temp vars. Usefull to avoid extra closures and global vars. Do not forgive delete already unnecessary vars */ 
$G.$temp = {};

/** @var ref to temp namespace of jbasis */ 
$jb.Temp_ = {};

/** @namespace($jb.Loader) contains functions and classes related with dependences system of jbasis */
if($jb.Loader == null)
  $jb.Loader = {};

/** @alias */
var Loader = $jb.Loader;
  
/** @var map "full url" -> Boolean(true if inserted false else) */
var Loader_urlLoadStatusMap = Loader.urlLoadStatusMap_ = {};

/** @var map "declared url" -> Boolean(true if declared else false) */
var Loader_declaredUrlMap = Loader.declaredUrlMap_ = {};

/** @var map id -> Loader.Scope of all currently not completed Loader_scopes */
var Loader_scopes = Loader.scopes_ = {nextId: 0, els: {}};

/** @var array of {metaUrl:string, realUrl: string} for replace metaUrls to realUrls */
$jb.urlAliases = [{url: "$jb/", alias: $jb.Cfg.rootUrl}];

/**
  @fn replace meta pathes to physical equivalents
  @param url url to replace
  @return replaced url
*/
var _metaUrl = $jb._metaUrl = function(url)
{
  var ua = $jb.urlAliases, i = -1, len = ua.length;
  
  while(++i < len)
    url = url.replace(ua[i].url, ua[i].alias);
  
  return url;
};

/** @var precached value of location protocol */
Loader.locProt_ = '' + location.protocol;

/** @var precomputed value of location protocol and hostname */
Loader.locProt_ = location.protocol;
Loader.locProtAndHost_ = location.protocol + '//' + location.hostname;

/** @var precached value of location pathname */
Loader.locPath_ = '' + location.pathname;
Loader.locPath_ = Loader.locPath_.substr(0, Loader.locPath_.lastIndexOf('/')) + '/';


/**
  @fn complements given url to full url ie "source/checkout" -> "http://code.google.com/p/jbasis/source/checkout"
  @param url url to complement
  @return complemented url
*/
var _fullUrl;

(function()
{
  var cleanRE = /\/\.(?=\/)/g;
  
  _fullUrl = $jb._fullUrl = function(url)
  {
    var L = Loader;
    
    if(url.substr(0, 2) == '//')
    {
      url = L.locProt_ + url;
    }
    else if(url.substr(0, L.locProt_.length) != L.locProt_)
    {  
      var prefix = L.locProtAndHost_;
    
      if(url.charAt(0) != '/')
        prefix += L.locPath_;
    
      url = prefix + url;
    }
    
    url = url.replace(cleanRE, '');
    
    var b, c, e;
    
    for( ;; )
    {
      if((c = url.indexOf('/../')) < 0)
        break;
      
      b = e = c;

      do
      {
        e += 4;
        b = url.lastIndexOf('/', b - 1);
      }  
      while(url.substr(e, 4) == '/../');
      
      url = url.substr(0, b) + url.substring(e - 1);
    }
    
    return url;
  };
})();  

/**
  @fn add event listeners for given script dom node
  @param v ref to script dom node
  @param _func callback function(scriptDomNode,resultState) where scriptDomNode is given script node 'v' and resultState takes values true if script loaded successfuly, false if not loaded and null if can not detect 
*/
Loader.__set_DOMNodeLoaded = function(v, _fn)
{
  v.onload = function()
  {
    //alert('onload');
    v.onreadystatechange = v.onerror = null;
    
    setTimeout
    (
      function()
      {
        v.onload = null;
        _fn(v, true);
      },
      0
    );
  };
  v.onerror = function()
  {
    //alert('onerror');
    v.onreadystatechange = v.onload = null;
    
    setTimeout
    (
      function()
      {
        v.onerror = null;
        _fn(v, false);
      },
      0
    );
  };
  
  v.onreadystatechange = function()
  {
    //alert(this.readyState);
    if(v.readyState != "loaded" && v.readyState != "complete")
      return;

    v.onload = v.onerror = null;
    
    setTimeout
    (
      function()
      {
        v.onreadystatechange = null;
        _fn(v, null);
      },
      0
    );
  };
};

(function()
{
  var s = $h.getElementsByTagName('script')[0],
    checkerBody = '';
  
  if('readyState' in s)
  {
    checkerBody +=
      "var rs=v.readyState; \
      if(rs == 'loaded' || rs == 'complete')\
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
  Loader.__isDOMNodeLoaded = new Function('v', checkerBody);
  
})();


Loader.extToMimeMap =
{
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.png': 'image/png'
};

Loader.resouceTypes =
[
  {
    canDeclareSelf: true,
    _isSameMime : function(mime)
    {
      return /text\/javascript.*|application\/(x-)?javascript.*|application\/ecmascript/.test(mime);
    },  
    _findLoadingUrls: function(_callback)
    {
      var /* L = Loader, */
        ss = $h.getElementsByTagName('script'),
        src, i = -1, s, 
        _fullUrlC = _fullUrl, __isDOMNodeLoaded = Loader.__isDOMNodeLoaded;
      
      while((s = ss[++i]))
      {
        if((src = s.getAttribute("src")) != null)
          _callback(_fullUrlC(src), __isDOMNodeLoaded(s));
      }
    },
    _load: function(mime, url, _result)
    {
      var L = Loader,
        s = $d.createElement("script");
      
      s.src = url;
      s.type = mime;
      //s.defer=true;
      
      if(_result != null)
      {
        L.__set_DOMNodeLoaded
        (
          s,
          function(v, isLoaded)
          {
            _result(url, isLoaded);
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
      var /* L = Loader,*/
        ls = $h.getElementsByTagName('link'),
        href, i = -1, link,
        sheetName = this.sheetName_,
        _fullUrlC = _fullUrl;
      
      while(link = ls[++i])
      {
        if(link.getAttribute('rel') == 'stylesheet' && (href = link.getAttribute('href')) != null)
          _callback(_fullUrlC(href), link[sheetName] != null);
      }
    },
    _load: 
    ($w.opera || $d.recalc) ?
    function(mime, url, _result)
    {
      var L = Loader,
        link = $d.createElement("link"),
        self = this;
      
      //s.defer=true;
      
      if(_result != null)
      {
        L.__set_DOMNodeLoaded
        (
          link,
          function(v, isLoaded)
          {
            _result(url, isLoaded && link[self.sheetName_]);
          }  
        );
      }  

      link.type = mime;
      link.rel = 'stylesheet';
      link.href = url;

      $h.appendChild(link);
      
      return null;
    } : ($G.WebKitPoint || $w.navigator.mozIsLocallyAvailable) ?
    (function()
    {
      var
        nextId = 0, dataMap = {},      
        _insertLink = function(url, mime)
        {
          var link = $d.createElement('link');
          
          link.type = mime;
          link.rel = 'stylesheet';
          link.href = url;

          $h.appendChild(link);
        },
        _cleanUp, _onObjLoad, _fOnTimeout;
      
      if($w.navigator.mozIsLocallyAvailable) // ff
      {
        var iframe = $h.appendChild($d.createElement('iframe')), iframeDocEl,
          _insertScript = function(url, data)
          {
            var script = $d.createElement('script');
            
            script.type = 'text/javascript';
            script.src = url;
            script.onerror = _onScriptError;
            script.jb_ = data;

            iframeDocEl.appendChild(script);
          },
          _cleanUp = function(jb)
          {
            delete dataMap[jb.selfId]; 
            jb.obj.parentNode.removeChild(jb.obj)
            
            var script = jb.script;
            
            if(script)
            {
              script.onerror = script.jb_ = null;
              script.parentNode.removeChild(script);
            }
          },
          _onObjLoad = function()
          {
            //console.log("_onObjLoad");
            var jb = dataMap[this.getAttribute('jbLoaderDataId')]; 
            
            _insertLink(jb.url, jb.mime);
            
            jb._fn(jb.url, true);
            
            if(jb.script)
              jb.script.onerror = null;
            else
              clearTimeout(jb.timeoutId);
            
            setTimeout(function(){ _cleanUp(jb); }, 0);  
          },
          _onScriptError = function()
          {
            //console.log("_onScriptError");
            var jb = this.jb_;
            
            jb.obj.onload = null;
            jb._fn(jb.url, false);
            
            setTimeout(function(){ _cleanUp(jb); }, 0);  
          },
          _fOnTimeout = function(data)
          {
            return function()
            {
              data.script = _insertScript(data.url, data);
            };
          };  

        iframeDocEl = iframe.contentWindow.document;
      
        iframeDocEl.open();
        iframeDocEl.write('<html></html>');
        iframeDocEl.close();
        
        iframeDocEl = iframeDocEl.documentElement;
      }
      else // webkit
      {
        var
          _cleanUp = function(jb)
          {
            delete dataMap[jb.selfId]; 
            jb.obj.parentNode.removeChild(jb.obj)
          },
          _onObjLoad = function()
          {
            //console.log("_onObjLoad");
            var jb = dataMap[this.getAttribute('jbLoaderDataId')]; 
            
            _insertLink(jb.url, jb.mime);
            
            jb._fn(jb.url, true);
            
            if(jb.timeoutId)
              clearTimeout(jb.timeoutId);
            
            if(jb.sheetPollThreadId)
              clearInterval(jb.sheetPollThreadId);
            
            setTimeout(function(){ _cleanUp(jb); }, 0);  
          },
          _sheetPollThread = function(jb)
          {
            if(--jb.attempCount > 0 && !jb.obj.sheet)
              return;
            
            //console.log("_onScriptError");
            
            jb.obj.onload = null;
            jb._fn(jb.url, false);
            clearInterval(jb.sheetPollThreadId);
            
            _cleanUp(jb);
          },
          _fOnTimeout = function(data)
          {
            return function()
            {
              data.timeoutId = null;
              data.attempCount = 120;
              data.sheetPollThreadId = setInterval(function(){ _sheetPollThread(data); }, 250);
            };
          };  
      }
        
      return function(mime, url, _result)
      {
        var L = Loader, obj, data;
        
        if(_result == null)
        {
          _insertLink(url, mime);
          
          return null;
        }
        
        obj = $d.createElement("object");
        
        dataMap[nextId] = data = {url: url, mime: mime, _fn: _result, obj: obj, selfId:nextId};
        obj.data = url;
        obj.setAttribute('jbLoaderDataId', nextId);
        obj.onload = _onObjLoad;
        obj.width = obj.height = 1;
        obj.style.display = 'block';
        ($d.body || $de).appendChild(obj);
        
        data.timeoutId = setTimeout(_fOnTimeout(data), 5000);
        
        ++nextId;
        
        return null;
      }
    })() : null
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
          img.src = "dddwndkj://jh.knkjnkjwn/jbbj.nnj";
        }
        catch(err)
        {
        
        };
        
        if(typeof(img.naturalWidth) != 'undefined')
          prop = 'naturalWidth';
        else
          prop = 'width';
      })();  
      
      return function(mime, url, _result)
      {
        var L = Loader,
          image = new Image();
        
        image.src = url;
        
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
  @fn mark given url as declared and check Loader_scopes for complite
  @param url url for declare
*/
Loader._declareUrl = function(url)
{
  var obj = Loader_scopes.els, i;
  
  Loader_declaredUrlMap[url] = true;
  
  for(i in obj)
  {
    if(obj.hasOwnProperty(i))
      obj[i].__resourceDeclared(url);
  }
};

/**
  @fn generic callback for all nonCompatable scripts. If script loaded or state can not detected declare script url
  @see Loader.__requireUrl
  @see Loader.__checkScriptLoaded
  @param v script node
  @param isLoaded true if loaded false if not null if can not detect
*/
Loader.__nonSelfDeclareLoaded = function(url, isLoaded)
{
  Loader_urlLoadStatusMap[url] = isLoaded;
  
  if(isLoaded != false)
    Loader._declareUrl(url);
};

Loader._urlExt = function(url)
{
  var begin = 0, end = url.length, point, i;
  
  if((i = url.lastIndexOf('#', end)) > 0)
    end = i;
  
  if((i = url.lastIndexOf('?', end)) > 0)
    end = i;
  
  if((i = url.lastIndexOf('.', end)) < 0)
    return null;

  point = i;
  
  if((i = url.lastIndexOf('/', end)) > -1)
    begin = i;
  
  if(begin >= point)
    return null;
    
  return url.substring(point, end);
};

Loader._mimeByUrl = function(url)
{
  var L = Loader,
    ext = L._urlExt(url);
  
  if(ext == null)
    return null;
  
  return L.extToMimeMap[ext];
};

Loader._rtByMime=function(mime)
{
  if(mime == null)
    return null;
    
  var L = Loader,
    rts = L.resouceTypes, i = rts.length;
  
  while(i-- && rts[i]._isSameMime(mime) != true)
    ;
    
  if(i == -1)
    return null;
    
  return rts[i];
};

Loader._load = function(url, _result, mime)
{
  var L = Loader, ulsm = Loader_urlLoadStatusMap;
  
  url = _fullUrl(_metaUrl(url));
  
  if(url in ulsm)
  {  
    if(_result == null)
      return ulsm[url];
    else
      return _result(url, ulsm[url]);
  }
  
  var rt = L._rtByMime(mime || (mime = L._mimeByUrl(url)));
  
  if(rt == null)
    throw new Error("[Loader] resouce type not found by url='" + url + "' and mime='" + mime + "'");
  
  return ulsm[url] = rt._load(mime, url, _result);
};

/**
  @fn check if url declared already. Else create script dom node with given url to load and execute script file content. For nonCompatable script add loaded callback Loader.__nonCompableScriptLoaded which declare script url (see DESCRIPTION). 
  @param url required url 
  @param nonCompatable true if script not contains Loader_scopes. See DESCRIPTION. Optional 
  @return true if scope already declared else false
*/
Loader.__requireUrl = function(url, nonCompatable, mime)
{
  var L = Loader, dum = Loader_declaredUrlMap;
  
  if(url in dum)
    return dum[url];
  
  dum[url] = false;
  
  var rt = L._rtByMime(mime || (mime = L._mimeByUrl(url)));
  
  if(rt == null)
    throw new Error("[Loader] resouce type not found by url='" + url + "' and mime='" + mime + "'");

  var _loaded;
  
  if(rt.canDeclareSelf != true || nonCompatable == true)
    _loaded=L.__nonSelfDeclareLoaded;
  
  Loader_urlLoadStatusMap[url] = rt._load(mime, url, _loaded);
  
  return false;
};

Loader._status = function()
{
  var i, L = Loader, dm = Loader_declaredUrlMap, um = Loader_urlLoadStatusMap, sm = Loader_scopes.els,
    t = '', s = '', v, j, m;
    
  for(i in dm)
  {
    if(dm.hasOwnProperty(i) && dm[i] == false)
      s += i + '\n';
  }
  
  if(s != '')
    t += '/* non declared urls */\n' + s;
  else
    t += '/* all urls are declared */\n';
  
  s = '';

  for(i in um)
  {
    if(um.hasOwnProperty(i) && um[i] == false)
      s += i + '\n';
  }
  
  if(s != '')
    t += '/* non loaded urls */\n' + s;
  else
    t += '/* all urls are loaded */\n';

  s = '';

  for(i in sm)
  {
    if(!sm.hasOwnProperty(i))
      continue;
    
    v = sm[i];
    
    s += '{'
    for(j in (m = v.requireMap_))
    {  
      if(m.hasOwnProperty(j))
        s += j + ', ';
    }
    s += '} -> {';
    
    for(j in (m = v.willDeclareMap_))
    {
      if(m.hasOwnProperty(j))
        s += j + ', ';
    }
    
    s += '}\n';
  }
  
  if(s != '')
    t += '/* non completed Loader_scopes */\n' + s;
  else
    t += '/* all Loader_scopes are completed */\n';
  
  return t;
};

Loader.__init = function()
{
  var L = Loader,
    rTupes = L.resouceTypes, i = rTupes.length;
  
  var _callback = function(url, isLoaded)
  {
    //console.log(url+" "+isLoaded);
    Loader_urlLoadStatusMap[url] = isLoaded;
    Loader_declaredUrlMap[url] = true;
  };

  while(i--)
    rTupes[i]._findLoadingUrls(_callback);
};

/** @class represent scope interface */
Loader.Scope = function()
{
  /** @var map "require url" -> declared state (true if declared else false) */
  this.requireMap_ = {};
  
  /** @var count of url not declared already but requring by this scope */
  this.pendingUrlCount_ = 0;
  
  /** @var map "will declare url"->true */
  this.willDeclareMap_ = {};
  
  /** @var callback that will be fired when all required urls declared */
  this.__completed;

  /** @var self id in Loader_scopes */
  this.selfId_ = Loader_scopes.nextId;
  
  Loader_scopes.els[this.selfId_] = this;
  ++Loader_scopes.nextId;
  
  return this;
};  

/** @alias */
var ScopeProto = Loader.Scope.prototype;

/**
  @fn mark url as required for this scope
  @param url required url
  @param nonCompatable true if scope is non compatable. Optional
  @return this
*/ 
ScopeProto._require = function(url, nonCompatable, mime)
{
  url = _fullUrl(_metaUrl(url));
  
  if(Loader.__requireUrl(url, nonCompatable) == true)
    return this;
  
  if(!(url in this.requireMap_))
  {
    this.requireMap_[url] = false;
    ++this.pendingUrlCount_;
  }
  
  return this;
};

/**
  @fn same as Loader.Scope._require but require if cond if true
  @param url require url
  @param nonCompatable true if scope is non compatable. Optional
  @return this
*/ 
ScopeProto._requireIf = function(url, cond, nonCompatable, mime)
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
ScopeProto._willDeclared = function(url)
{
  url = _fullUrl(_metaUrl(url));

  this.willDeclareMap_[url] = true;
  
  return this;
};

/**
  @fn declare all urls marked as will declared  
*/ 
ScopeProto._declareUrl=function()
{
  var _declareUrl = Loader._declareUrl,
    obj = this.willDeclareMap_;
  
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
ScopeProto._completed = function(_func)
{
  this.__completed = _func;
  
  if(this.pendingUrlCount_ > 0)
    return this;
  
  if(this.__completed != null)
    this.__completed($G, $jb);
  
  delete Loader_scopes.els[this.selfId_];
  
  this._declareUrl();
  
  return this;
};

/**
  @fn this function must called on each declared url. If url was required mark as declared and decrise pending count. If pending count reaches 0 call completed callback and delete self from Loader_scopes
  @param url declared url
  @return 0 if not all requires declared else 1
*/ 
ScopeProto.__resourceDeclared = function(url)
{
  if(this.requireMap_[url] != false)
    return 0;
  
  this.requireMap_[url] = true;
  --this.pendingUrlCount_;
  
  if(this.pendingUrlCount_ > 0)
    return 0;
  
  if(this.__completed != null)
    this.__completed($G, $jb);
  
  delete Loader_scopes.els[this.selfId_];
  
  this._declareUrl();
  
  return 1;
};

/**
  @fn shotcut for new Loader.Scope()
  @return new scope
*/ 
Loader._scope = function()
{
  return new Loader.Scope();
};

Loader.__init();

})($G);