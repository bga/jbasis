/**
  @file
  @author  Fyodorov "bga" Alexander <bga.email@gmail.com>
 
  @section LICENSE
 
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
  
  cross browser support functions for DOM.Node
 
*/

$jb.Loader._scope().
//_require("$jb/nav.js").
_require("$jb/$G.String.js").
_require("$jb/OOP.js").
_require("$jb/$jb.Storage.Base.js").
_willDeclared("$jb/$jb.Storage.DocCookies.js").
_completed(function($G, $jb){

/** @namespace contains different storages classes */
if($jb.Storage == null)
  $jb.Storage = {};

var deleteDate = '; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  
/** @class Document Cookies Storage  */
$jb.Storage.DocCookies = Object(function(doc)
{
  $jb.Storage.Base.call(this);

  /** @var {HTMLDocument} cookies document */
  this.doc_ = doc || $G.document;
  
  /** @var {Number} default expire ms count */
  this.defaultExpireMsCount = null;

  /** @var {String} default path */
  this.defaultPath = null;

  /** @var {String} default domain */
  this.defaultDomain = null;
});

$jb.Storage.DocCookies.name = '$jb.Storage.DocCookies';

/** @inherit */
$jb.Storage.DocCookies._staticDeriveFrom($jb.Storage.Base);

/** @var trait map */
$jb.Storage.DocCookies.prototype.traitMap =
{
  /**
    @fn get total occupied space
    @return number
  */  
  totalOccupiedSpace: function()
  {
    return this.doc.cookie.length;
  },
  /**
    @fn calc max entry(key, value, expire, path, domain) size. After first calculation self replace to result size
    @return number
  */  
  maxEntrySize: function()
  {
    var prec = 32;
      
    var doc = this.doc;
    var filler = '0'._mulNumber(prec), prefix = '$jbTemp=', unit = filler, newUnit;
    var deleteStr = '$jbTemp=' + deleteDate;

    for(;;)
    {
      doc.cookie = deleteStr;
      doc.cookie = prefix + (newUnit = (unit + unit));
      
      if(doc.cookie.indexOf('$jbTemp=') < 0)
      {
        if(unit == filler)
          break;

        prefix += (unit = filler);
      }
      else
      {
        unit = newUnit;
      }  
    }

    doc.cookie = deleteStr;

    return (this.constructor.prototype.traitMap.maxEntrySize = prefix.length);
  },
  curEntriesCount: function()
  {
    var s = this.doc.cookie;
    
    if(s)
    {
      var i = 1, p = -2;
      
      while((p = s.indexOf('; ', p + 2)) > -1)
        ++i;
      
      return i;
    }
    else
    {
      return 0;
    }
  }
};

$jb.Storage.DocCookies.prototype._paramsString = function()
{
  return '{"domain":"' + this.domain._escapeForCString() + '","path":"' + this.path._escapeForCString() + '"}';
};
$jb.Storage.DocCookies.prototype._init = function(_callback, param)
{
  if(param != null)
  {
    var paramMap;
    
    try
    {
      paramMap = JSON.parse(param);

      if(paramMap.domain == null || paramMap.domain !== $d.domain)
        return _callback && _callback(this, false);

      if(paramMap.domain != null)
        this.domain = paramMap.domain;

      if(paramMap.path != null)
        this.path = paramMap.path;
    }
    catch(err)
    {
      return _callback && _callback(this, false);
    }
  }
  
  // check cookie support
  this.doc.cookie = '$jbTemp=1';
  
  if(this._has('$jbTemp'))
  {
    this.doc.cookie = '$jbTemp=' + deleteDate;
    
    return _callback && _callback(this, true);
  }
  
  return _callback && _callback(this, false);
};

$jb.Storage.DocCookies.prototype._calcMaxValueSize = function(key)
{
  return this._trait('maxEntrySize')-key.length - 44 - 9 //- this.domain.length - this.path.length;
};

$jb.Storage.DocCookies.prototype._get = function(_callback, name)
{
  var value;
  
  if(name != null)
  {
    var c = this.doc.cookie;
    var matchStr = '; ' + name + '=';
    var i = c.indexOf(matchStr);
    
    // may be in start of cookie string
    if(i < 0)
    {
      if(c.slice(0, (matchStr = name + '=').length) == matchStr)
        i = 0;
    }
    
    if(i > -1)
    {
      var j = c.indexOf(';', (i += matchStr.length));
      
      if(j < 0)
        j = c.length;
      
      value = c.slice(i, j);
    }
  }  

  _callback && _callback(this, name, value);
  
  return value;
};

$jb.Storage.DocCookies.prototype._has = function(_callback, name)
{
  var has;
  
  if(name != null)
  {  
    var c = this.doc.cookie, matchStr;
    
    has = c.indexOf('; ' + name + '=') > -1 || c.substr(0, (matchStr = name + '=').length) == matchStr;
  }
  else
  {
    has = false;
  }
  
  _callback && _callback(this, name, has);
  
  return has;
};

/**
  @fn set cookie with 'name' to 'value' and optional 'expireDaysCount', 'path', 'domain'. Cookie can not really set if no enough available space or value more than cookie chunk size. Use '_has to detect success of setting
  @param name cookie name to set
  @param value cookie value to set
  @param expireDaysCount day count after which cookie expired. Optional. Default 'this.expireDaysCount'. '-1' for session cookie 
  @return success boolean 
*/  
$jb.Storage.DocCookies.prototype._set = function(_callback, name, value, expireDaysCount)
{
  var str = name + '=' + value;
  
  if(expireDaysCount == null)
    expireDaysCount = this.expireDaysCount;
  
  if(expireDaysCount > 0)
  {
    var expired = new Date();
    
    expired.setTime(expired.getTime() + expireDaysCount*86400000);
    str += '; expires=' + expired.toGMTString();
  }
  
  str += '; path=/';
  str += '; domain=' + this.domain;
    
  this.doc.cookie = str;

  return this._has(_callback, name);
};

/**
  @fn delete cookie by 'name'
  @param name cookie name to delete
  @param path cookie path to delete. Optional
  @param name cookie domain to delete. Optional
  @return success boolean 
*/  
$jb.Storage.DocCookies.prototype._delete = function(_callback, name)
{
  this.doc.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + 
    (path || this.path) + '; domain=' + (domain || this.domain);

  _callback && _callback(this, name, true);
  
  return true;
};

$jb.Storage.DocCookies.prototype._flush = function()
{
  return true;
};

$jb.Storage.DocCookies.prototype._enum = function(_callback)
{
  var s = this.doc.cookie;
  
  if(!s)
    return null;
  
  var p;
  
  if(_callback(s.slice(0, (p = s.indexOf('='))), s.slice(p + 1, (p = s.indexOf('; ', p + 1)) >>> 0)) === false)
    return false;
  
  while(p > -1)
  {  
    if(_callback(s.slice(p + 2, (p = s.indexOf('=', p + 2))), s.slice(p + 1, (p = s.indexOf('; ', p + 1)) >>> 0)) === false)
      return false;
  }

  return true;
};

$jb.Storage.DocCookies.prototype._keys = function()
{
  var s = this.doc.cookie;
  
  if(!s)
    return [];
    
  var p, names = [], i = 0;
  
  names[i++] = s.slice(0, (p = s.indexOf('=')));
  
  while((p = s.indexOf('; ', p + 1)) > -1)
    names[i++] = s.slice(p + 2, (p = s.indexOf('=', p + 2)));

  if((p = s.lastIndexOf('; ')) > -1)
    names[i++] = s.slice(p + 2, s.indexOf('=', p + 2));

  return names;
};
  
});
