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
_require("$jb/$jb.Deploy.js").
_willDeclared("$jb/$jb.JSParser.js").
_completed(function($G, $jb){

if($jb.JSParser == null)
  $jb.JSParser = {};
  
var matchTml = $jb.Deploy._fnCode(
  function(s, p)
  {
    EXTRA_VARS();

    var 
      openBracket = -1,
      closeBracket = -1,
      
      bracketCount = 0,
      
      openSquareBracket = -1,
      closeSquareBracket = -1,
      
      openCurlyBracket = -1,
      closeCurlyBracket = -1,

      singleQuote = -1, 
      dblQuote = -1,
      blockComment = -1,
      lineComment = -1,
      
      regExp = -1,
      
      op,
      
      _min = Math.min
      ;
    
    for(;;)
    {
      //console.log("p = " + p);
      EXTRA_INDEXOF();
      
      if(openBracket < p)
      {
        openBracket = s.indexOf('(', p) >>> 0;
      }
      if(closeBracket < p)
      {  
        closeBracket = s.indexOf(')', p) >>> 0;
      }
      
      if(openSquareBracket < p)
      {
        openSquareBracket = s.indexOf('[', p) >>> 0;
      }
      if(closeSquareBracket < p)
      {
        closeSquareBracket = s.indexOf(']', p) >>> 0;
      }
      
      if(openCurlyBracket < p)
      {
        openCurlyBracket = s.indexOf('{', p) >>> 0;
      }
      if(closeCurlyBracket < p)
      {
        closeCurlyBracket = s.indexOf('}', p) >>> 0;
      }
      
      if(singleQuote < p)
      {
        singleQuote = (s.indexOf('\'', p)) >>> 0; 
      }
      if(dblQuote < p)
      {
        dblQuote = s.indexOf('"', p) >>> 0;
      }
      
      if(blockComment < p)
      {
        blockComment = s.indexOf('/*', p) >>> 0;
      }
      if(lineComment < p)
      {
        lineComment = s.indexOf('//', p) >>> 0;
      }
      if(regExp < p)
      {
        regExp = s.indexOf('/', p) >>> 0;
      }
      
      switch(_min(EXTRA_MIN(), openBracket, closeBracket, openSquareBracket, closeSquareBracket, openCurlyBracket, closeCurlyBracket, singleQuote, dblQuote, blockComment, lineComment, regExp))
      {
        case 4294967295:
          return 4294967295;
        
        EXTRA_CASE();
        if(bracketCount == 0)
          return p;
        
        ++p;
      break;
        case openBracket:
          //console.log('openBracket');
          ++bracketCount;
          p = openBracket + 1;
          break;
        case closeBracket:
          //console.log('closeBracket');
          if(--bracketCount == -1)
            return closeBracket;
            
          p = closeBracket + 1;
          
          break;
        case openSquareBracket:
          //console.log('openSquareBracket');
          ++bracketCount;
          p = openSquareBracket + 1;
          break;
        case closeSquareBracket:
          //console.log('closeSquareBracket');
          if(--bracketCount == -1)
            return closeSquareBracket;
            
          p = closeSquareBracket + 1;
          
          break;
        case openCurlyBracket:
          //console.log('openCurlyBracket');
          ++bracketCount;
          p = openCurlyBracket + 1;
          break;
        case closeCurlyBracket:
          //console.log('closeCurlyBracket');
          if(--bracketCount == -1)
            return closeCurlyBracket;
            
          p = closeCurlyBracket + 1;
          
          break;
        case singleQuote:
          //console.log('singleQuote');
          p = singleQuote;
          
          do
          {
            p = s.indexOf('\'',(op = p + 1));
          }
          while(p > -1  && s.charAt(p - 1) == '\\');
          
          if(p > -1)
            ++p;
          else
            p = op + 1;
          
          break;
        case dblQuote:
          //console.log('dblQuote');
          p = dblQuote;
          
          do
          {
            p = s.indexOf('"',(op = p + 1));
          }
          while(p > -1  && s.charAt(p - 1) == '\\');
          
          if(p > -1)
            ++p;
          else
            p = op + 1;
          
          break;
        case blockComment:
          //console.log('blockComment');
          p = s.indexOf('*/', blockComment + 2) >>> 0;

          if(p == 4294967295)
          {
            blockComment = p; p = blockComment;
          }
          else
          {
            p  += 2;
          }
          
          break;
        case lineComment:
          //console.log('lineComment');
          p = s.indexOf('\n', lineComment + 2) >>> 0;

          if(p == 4294967295)
          {
            lineComment = p; p = lineComment;
          }
          else
          {
            ++p;
          }
          
          break;
        case regExp:
          //console.log('regExp');
          p = regExp;
          
          do
          {
            p = s.indexOf('/',(op = p + 1));
          }
          while(p > -1  && s.charAt(p - 1) == '\\');
          
          if(p > -1)
            ++p;
          else
            p = op + 1;
          
          break;
      }
    }
  }
);  


var matchExprFnCache = {};
 
$jb.JSParser._fMatchExpr = function(termStrings)
{
  var termStringsJoined = '' + termStrings;
  
  if(matchExprFnCache[termStrings])
    return matchExprFnCache[termStrings];
    
  var extraVars = 'var ';

  var i = termStrings.length; while(i--)
    extraVars += 'v' + i + '=-1,';

  extraVars = extraVars.slice(0, -1) + ';';  

  var extraMin = '';

  var i = termStrings.length; while(i--)
    extraMin += 'v' + i + ',';

  extraMin = extraMin.slice(0, -1);  

  
  var extraIndexOf = '' 
  
  /*
    if(comma < p)
    {
      comma = s.indexOf(',', p) >>> 0;
    }
  */
  var i = termStrings.length; while(i--)
    extraIndexOf += 'if(v' + i + '<p){v' + i + '=s.indexOf("' + termStrings[i] + '",p)>>>0}';
  
  var extraCase = '';
  
  /*
    case comma: p = comma;
  */
  
  var i = termStrings.length; while(i--)
    extraCase += 'case v' + i + ':p=v' + i + ';';
  
  var code = matchTml.replace('EXTRA_VARS();', extraVars).
    replace('EXTRA_MIN()', extraMin).
    replace('EXTRA_INDEXOF();', extraIndexOf).
    replace('EXTRA_CASE();', extraCase);
  
  console.log(code);
  
  return matchExprFnCache[termStringsJoined] = new Function('s, p',
    code
  );
};  

})