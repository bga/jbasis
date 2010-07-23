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
_willDeclared("$jb/$jb.Loader.ImageResource.js").
_completed(function($G, $jb){

/*
if($jb.Loader == null)
  $jb.Loader = {};
*/

$jb.Loader.extToMimeMap['.jpg'] = 'image/jpeg';
$jb.Loader.extToMimeMap['.gif'] = 'image/gif';
$jb.Loader.extToMimeMap['.png'] = 'image/png';


$jb.Loader.ImageResource = function()
{

};

/** @alias */
var ImageResourceProto = $jb.Loader.ImageResource.prototype;

ImageResourceProto.canDeclareSelf = false;

(function()
{
  var re = /image\/.*/;
  
  ImageResourceProto._isSameMime = function(mime)
  {
    return re.test(mime);
  };
})();  
 
ImageResourceProto._findLoadingUrls = function(_callback)
{
};

// http://lucassmith.name/2008/11/is-my-image-loaded.html
ImageResourceProto._load = (function()
{
  var prop = ('naturalWidth' in new Image()) ? 'naturalWidth' : 'width';
  
  return function(mime, url, _result)
  {
    var L = $jb.Loader,
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
        image = image.onload = image.onerror = null;
        
        setTimeout(function(){ _result(url, true); }, 0);
      };
      image.onerror = function()
      {
        image = image.onload = image.onerror = null;
        
        setTimeout(function(){ _result(url, false); }, 0);
      };
    }  

    return null;
  };
})();

$jb.Loader.resouceTypes.push((Loader.imageResource = new $jb.Loader.ImageResource()))

});