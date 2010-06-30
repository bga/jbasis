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
//_require("$jb/$jb.nav.js").
_require("$jb/$jb.Net.XHR.js").
_require("$jb/$jb.Template._parseTemplates.js").
_willDeclared("$jb/$jb.Loader.TemplateResource.js").
_completed(function($G, $jb){

/*
if($jb.Loader == null)
  $jb.Loader = {};
*/

$jb.Loader.extToMimeMap['.tmls'] = 'text/templates';
$jb.Loader.extToMimeMap['.asp'] = 'text/templates';


$jb.Loader.TemplateResource = function()
{
  this.loadedTemplateMap = {};
};

/** @alias */
var TemplateResourceProto = $jb.Loader.TemplateResource.prototype;

TemplateResourceProto.canDeclareSelf = false;

(function()
{
  var re = /text\/templates/;
  
  TemplateResourceProto._isSameMime = function(mime)
  {
    return re.test(mime);
  };
})();  
 
TemplateResourceProto._findLoadingUrls = function(_callback)
{
};

TemplateResourceProto._reportError = function(url, msg)
{
  console.error('$jb.Loader.TemplateResource::_load url = "' + url + '", msg = "' +msg + '"'); 
};

// http://lucassmith.name/2008/11/is-my-image-loaded.html
TemplateResourceProto._load = function(mime, url, _result)
{
  //url = $jb._metaUrl(url);
  
  var xhr = new $jb.Net.XHR();
  var self = this;
  
  xhr._attachEvent('dataReceived', 
    function(xhr)
    {
      $jb.Template._parseTemplates(
        xhr._data(),
        url,
        self.loadedTemplateMap,
        function(url, exportMap, status)
        { 
          _result(url, status); 
        },
        self._reportError
      );
    }
  ).
  _attachEvent('error', 
    function(xhr)
    {
      self._reportError(url, 'file not found');
      _result(url, false);
    }
  )._get(url)._reopen();
};


$jb.Loader.resouceTypes.push(($jb.Loader.templateResource = new $jb.Loader.TemplateResource()))

});