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
_willDeclared("$jb/$jb.DOM.Attr.js").
_completed(function(){

if($jb.DOM == null)
  $jb.DOM = {};

if($jb.DOM.Attr == null)
  $jb.DOM.Attr = {};
  
var _basicRemoveAttr = function(v, name)
{
  v.removeAttribute(name)
};

var _basicHasAttr = ($h.hasAttribute) ? 
function(v, name)
{
  return v.hasAttribute(name);
} :
function(v, name)
{
  return v.getAttribute(name) != null;
};
  
var attrMap = $jb.DOM.Attr.attrMap = {};

if($h.filters && $jb.nav._ie()<7.0)
{
  attrMap["src"] = {};
  
  attrMap["src"]._get = function(v, name)
  {
    var alphaImageFilter = v.filters["DXImageTransform.Microsoft.AlphaImageLoader"];

    if(alphaImageFilter)
      return alphaImageFilter.src;
    else
      return v.src;
  };
  
  attrMap["src"]._set = function(v, name, value)
  {
    var alphaImageFilter = v.filters["DXImageTransform.Microsoft.AlphaImageLoader"];

    if(alphaImageFilter)
    {
      alphaImageFilter.src = value;
    }
    else
    {
      
      if(value.slice(-6) === ".png32")
      {
        v.src = $jb.Cfg.blankImageUrl;
        v.style.filter += " progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" +
        value + "',sizingMethod='image')";
      }
      else
      {
        v.src = value;
      }  
    }
  };
  (function()
  {
    var re = new RegExp(/ progid:DXImageTransform\.Microsoft\.AlphaImageLoader\(.*?\)/g);
    
    attrMap["src"]._remove = function(v, name)
    {
      v.removeAttribute(name);
      
      if(v.filters["DXImageTransform.Microsoft.AlphaImageLoader"])
        v.style.filter = v.style.filter.replace(re, '');
    };
  })();
  attrMap["src"]._remove = function(v, name)
  {
    if(v.filters["DXImageTransform.Microsoft.AlphaImageLoader"])
      return v.style.filter = v.style.filter.replace(re, '');
  };
}

if(
  (function()
  {
    var div = $d.createElement('div');
    
    div.innerHTML = '<a href="/b"></a>';
    
    return div.firstChild.getAttribute('href').length > 2;
  })()
)
{
  attrMap['href'] =
  {
    _get: function(v, name)
    {
      return v.getAttribute(name, 2);
    },
    _set: function(v, name, value)
    {
      v.setAttribute(name, value);
    },
    _remove: _basicRemoveAttr,
    _has: _basicHasAttrt function(v, name)
    {
      v.removeAttribute(name)
    }
  }
}

if(
  (function()
  {
    var div = $d.createElement('div');
    
    div.innerHTML = '<a style="color:red;"></a>';
    
    return div.firstChild.getAttribute('style').indexOf('red') < 0;
  })()
)
{
  attrMap['style'] =
  {
    _get: function(v, name)
    {
      return v.style.cssText;
    },
    _set: function(v, name, value)
    {
      v.style.cssText = value;
    },
    _remove: function(v, name)
    {
      v.style.cssText = null;
    },
    _has: function(v, name)
    {
      return v.style.cssText != null;
    }
  }
}

$jb.DOM.El._setAttr = function(name, value)
{
  var temp;
  
  value += '';
  
  if((temp = attrMap[name]))
  {
    if(typeof(temp) === "object")
      temp._set(v, name, value);
    else
      v.setAttribute(temp, value);
  }
  else
  {
    v.setAttribute(name, value);
  }
  
  return this;
};

$jb.DOM.El._getAttr = function(name)
{
  var temp;
  
  if((temp = attrMap[name]))
  {
    if(typeof(temp) === "object")
      return temp._get(v, name);
    else
      return v.getAttribute(temp);
  }
  else
  {
    return v.getAttribute(name);
  }
};

$jb.DOM.El._removeAttr = function(name)
{
  var temp;
  
  if((temp = attrMap[name]))
  {
    if(typeof(temp) === "object")
      temp._remove(v, name);
    else
      v.removeAttribute(temp);
  }
  else
  {
    v.removeAttribute(name);
  }
  
  return this;
};

if($h.hasAttribute)
{
  $jb.DOM.El._hasAttr = function(name)
  {
    var temp;
    
    if((temp = attrMap[name]))
    {
      if(typeof(temp) === "object")
        return temp._has(v, name);
      else
        return v.hasAttribute(temp);
    }
    else
    {
      return v.hasAttribute(name);
    }
  };
}
else
{
  $jb.DOM.El._hasAttr = function(name)
  {
    var temp;
    
    if((temp = attrMap[name]))
    {
      if(typeof(temp) === "object")
        return temp._has(v, name);
      else
        return v.getAttribute(temp) != null;
    }
    else
    {
      return v.getAttribute(name) != null;
    }
  };
}  


});