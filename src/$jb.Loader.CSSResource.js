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
//_require("$jb/$jb.EventTarget.js").
_require("$jb/$jb.nav.js").
_willDeclared("$jb/$jb.Loader.CSSResource.js").
_completed(function($G, $jb){

/*
if($jb.Loader == null)
  $jb.Loader = {};
*/

$jb.Loader.extToMimeMap['.css'] = 'text/css';

$jb.Loader.CSSResource = function()
{
  this.isExtractImports = false;
};

/** @alias */
var CSSResourceProto = $jb.Loader.CSSResource.prototype;

CSSResourceProto.canDeclareSelf = false;

(function()
{
  var re = /text\/css/;
  
  CSSResourceProto._isSameMime = function(mime)
  {
    return re.test(mime);
  };
})();  
  
//CSSResourceProto.sheetName_ = ($jb.nav._ie()) ? 'styleSheet' : 'sheet';
CSSResourceProto.sheetName_ = ('styleSheet' in $d.createElement('link')) ? 'styleSheet' : 'sheet';
 
CSSResourceProto._findLoadingUrls = function(_callback)
{
  var /* L = Loader,*/
    ls = $h.getElementsByTagName('link'),
    href, i = -1, link,
    sheetName = this.sheetName_,
    _fullUrlC = $jb.Loader._fullUrl;
  
  while((link = ls[++i]))
  {
    if(link.getAttribute('rel') == 'stylesheet' && (href = link.getAttribute('href')) != null)
      _callback(_fullUrlC(href), null);
  }
};

if($jb.nav._opera() || $jb.nav._ie())
{
  CSSResourceProto._load = function(mime, url, _result)
  {
    var L = $jb.Loader,
      link = $d.createElement('link'),
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

    //$h.insertBefore(link);
    $h.appendChild(link);
    
    return null;
  }
}  
else if($jb.nav._webkit() || $jb.nav._ff())
{
  CSSResourceProto._load = (function()
  {
    var
      nextId = 0, dataMap = {},      
      _insertLink = function(url, mime, data)
      {
        var link = $d.createElement('link');
        
        link.type = mime;
        link.rel = 'stylesheet';
        link.href = url;

        //$h.insertBefore(link);
        $h.appendChild(link);
        
        return link;
      },
      _cleanUp, _onObjLoad, _fOnTimeout;
    
    if($jb.nav._ff()) // ff
    {
      var //iframe = $h.appendChild($d.createElement('iframe')), iframeDocEl,
        _insertScript = function(url, data)
        {
          var script = $d.createElement('script');
          
          script.type = 'text/javascript';
          script.src = url;
          script.onerror = _onScriptError;
          script.jb_ = data;

          $h.appendChild(script);
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

      /*
      var iframeDoc = iframe.contentWindow.document;
    
      iframeDoc.open();
      iframeDoc.write('<html></html>');
      iframeDoc.close();
      
      iframeDocEl = iframeDoc.documentElement;
      */
    }
    else // webkit
    {
      var
        _cleanUp = function(jb)
        {
          delete dataMap[jb.selfId]; 
          jb.obj.parentNode.removeChild(jb.obj);
          
          if(jb.link)
            jb.link.parentNode.removeChild(jb.link);
        },
        _onObjLoad = function()
        {
          //console.log("_onObjLoad");
          var jb = dataMap[this.getAttribute('jbLoaderDataId')]; 
          
          if(!jb.link)
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
          if(--jb.attempCount > 0 && !jb.link.sheet)
            return;
          
          //console.log("_onScriptError");
          
          jb.obj.onload = null;
          jb._fn(jb.url, false);
          clearInterval(jb.sheetPollThreadId);
          
          _cleanUp(jb);
        },
        _fOnTimeout = function(jb)
        {
          return function()
          {
            jb.timeoutId = null;
            jb.attempCount = 120;
            jb.link = _insertLink(jb.url, jb.mime);
            jb.sheetPollThreadId = setInterval(function(){ _sheetPollThread(jb); }, 250);
          };
        };  
    }
      
    return function(mime, url, _result)
    {
      var L = $jb.Loader, obj, data;
      
      if(_result == null)
      {
        _insertLink(url, mime);
        
        return null;
      }
      
      obj = $d.createElement('object');
      
      dataMap[nextId] = data = {url: url, mime: mime, _fn: _result, obj: obj, selfId: nextId};
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
  })();
}
else
{
  CSSResourceProto._load = null;
}  

/*
if($jb.nav._ie())
{
  CSSResourceProto._extractImports = function(v)
  {
    var imports = v[this.sheetName_].imports, i = -1, im, urlLoadStatusMap = $jb.Loader.urlLoadStatusMap;
    
    while((im = imports[++i]))
    {
      if(im.hrefurlLoadStatusMap[])
    }
  };
}
*/

$jb.Loader.resouceTypes.push(($jb.Loader.cssResource = new $jb.Loader.CSSResource()))


});