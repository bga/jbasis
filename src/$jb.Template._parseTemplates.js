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
//_require("$jb/$G.Function.js").
//_require("$jb/$jb.nav.js").
//_require("$jb/$jb.Net.XHR.js").
_require("$jb/$G.String.js").
_willDeclared("$jb/$jb.Template._parseTemplates.js").
_completed(function($G, $jb){

var eval = $G.eval;

if($jb.Template == null)
  $jb.Template = {};

$jb.Template._parseTemplates = function(text, url, exportMap, _result, _error)
{
  var i = 0, j;
  var match; 
  var templateClass, templateClassFile, exportName, argNames;
  var scope = $jb.Loader._scope();
  var code = '';
  var _template;
  
  while((i = text.indexOf('<script', i)) > -1)
  {
    match = text.slice(i, (j = i = text.indexOf('>', (i += 7))));
    
    if((i = match.indexOf('class=')) > -1)
      templateClass = match.slice((i = match.indexOf('"', (i += 6)) + 1), match.indexOf('"', i));
    else
      _error(url, 'no "class" attr in $jb.Template._parseTemplates');

    if((i = match.indexOf('classFile=')) > -1)
      templateClassFile = match.slice((i = match.indexOf('"', (i += 10)) + 1), match.indexOf('"', i));
    else
      _error(url, 'no "classFile" attr in $jb.Template._parseTemplates');
      
    if((i = match.indexOf('exportName=')) > -1)
      exportName = match.slice((i = match.indexOf('"', (i += 11)) + 1), match.indexOf('"', i));
    else
      _error(url, 'no "exportName" attr in $jb.Template._parseTemplates');
      
    if((i = match.indexOf('argNames=')) > -1)
      argNames = match.slice((i = match.indexOf('"', (i += 7)) + 1), match.indexOf('"', i));
    else
      _error(url, 'no "argNames" attr in $jb.Template._parseTemplates');
      
    i = text.indexOf('</script>', ++j);
    
    try
    {
      _template = eval(templateClass);
    }
    catch(err)
    {
      _template = null;
    };
    
    if(_template != null)
    {  
      exportMap[exportName] = new _template(text.slice(j, i), argNames); 
    }
    else
    {
      scope._require(templateClassFile);
      
      code += 'exportMap["' + exportName + '"] = new ' + templateClass + '("' + text.slice(j, i)._escapeForCString() + '", "' +argNames + '");';
    }
    
    i += 9;
  }
  
  if(code != '')
  {  
    var _fn = (new Function(
      '_result, exportMap, url',
      'return function(){ ' + code + '_result(url, exportMap, true); };'
    ))(_result, exportMap, url);
    
    scope._completed(_fn);
  }
  else
  {
    _result(url, exportMap, true);
  }
};
    
});
