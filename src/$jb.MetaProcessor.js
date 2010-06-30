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
_willDeclared("$jb/$jb.MetaProcessor.js").
_completed(function($G, $jb){

$jb.MetaProcessor = function(_testExpr)
{
  this._testExpr = _testExpr;
};

(function()
{
  var _minL = $G.Math.min;
  var _testExprL, pRet;

  var _skipIf = $jb.MetaProcessor.prototype.__skipIf = function(code, p, lvl)
  {
    var 
      ifp = -1,
      endifp = -1,
      _min = _minL
      ;
      
    for( ;; )
    {
      if(ifp < p)
        ifp = code.indexOf('/*#if', p) >>> 0;
      if(endifp < p)
        endifp = code.indexOf('/*#endif', p) >>> 0;
      
      switch(_min(ifp, endifp))
      {
        case 4294967295:
          return 4294967295;
        
        case ifp:
          //ifp = code.indexOf('/*#if', (p = code.indexOf('*/', ifp + 5) + 2)) >>> 0;
          p = code.indexOf('*/', ifp + 5) + 2;
          ++lvl;
          break;
        
        case endifp:
          if(--lvl == 0)
            return endifp;
          
          //endifp = code.indexOf('/*#endif', (p = code.indexOf('*/', endifp + 8) + 2)) >>> 0;
          p = code.indexOf('*/', endifp + 8) + 2;
          break;
      }
    }
  };

  var _skipIfPart = $jb.MetaProcessor.prototype.__skipIfPart = function(code, p)
  {
    var 
      ifp = -1,
      elseifp = -1,
      elsep = -1,
      endifp = -1,
      _min = _minL
      ;
      
    for( ;; )
    {
      if(ifp < p)
        ifp = code.indexOf('/*#if', p) >>> 0;
      if(elseifp < p)
        elseifp = code.indexOf('/*#elseif', p) >>> 0;
      if(elsep < p)
        elsep = code.indexOf('/*#else', p) >>> 0;
      if(endifp < p)
        endifp = code.indexOf('/*#endif', p) >>> 0;
      
      switch(_min(ifp, elseifp, elsep, endifp))
      {
        case 4294967295:
          return 4294967295;
        
        case ifp:
          p = code.indexOf(
            '*/', 
            _skipIf(
              code, 
              code.indexOf('*/', ifp + 5) + 2,
              1
            )
          );
          
          break;

        case elseifp:
          return elseifp;

        case elsep:
          return elsep;

        case endifp:
          return endifp;
      }
    }  
  };

  var _passIf = $jb.MetaProcessor.prototype.__passIf = function(code, p)
  {
    var _testExpr = _testExprL;
    var 
      ifp = -1,
      elseifp = -1,
      elsep = -1,
      endifp = -1,
      op = p, r, 
      begin = -1,  
      out = '',
      _min = _minL,
      isPUpdated
      ;
      
    
    mainLoop: for( ;; )
    {
      if(ifp < p)
        ifp = code.indexOf('/*#if', p) >>> 0;
      if(elseifp < p)
        elseifp = code.indexOf('/*#elseif', p) >>> 0;
      if(elsep < p)
        elsep = code.indexOf('/*#else', p) >>> 0;
      if(endifp < p)
        endifp = code.indexOf('/*#endif', p) >>> 0;

      isPNotUpdated = true;
      
      switch(_min(ifp, elseifp, elsep, endifp))
      {
        case 4294967295:
          pRet = 4294967295;
          
          return out + code.slice(op);
        
        case ifp:
          r = (begin = ifp) + 5;
          //ifp = code.indexOf('/*#if', (p = code.indexOf('*/', ()) + 2)) >>> 0;
          isPNotUpdated = false;
        case elseifp:
          if(isPNotUpdated)
          {  
            r = elseifp + 9;

            if(begin == -1)
            {
              pRet = elseifp;
              
              break mainLoop;
            }
          }
          
          var expr = code.slice(
            (r = code.indexOf('(', r) + 1),
            code.lastIndexOf(')', (p = code.indexOf('*/', r)))
          );
          
          //$G._log('expr', expr);
          
          if(_testExpr(expr))
          {
            out += code.slice(op, begin) + _passIf(code, p + 2);
            op = p = code.indexOf('*/', _skipIf(code, code.indexOf('*/', pRet) + 2, 1)) + 2;
            begin = -1;
          }
          else
          {
            p = _skipIfPart(code, p + 2);
            //$G._log(code.slice(p));
          }
          
          
          break;
        
        case elsep:
          if(begin == -1)
          {
            pRet = elsep;
            
            break mainLoop;
          }

          out += code.slice(op, begin) + _passIf(code, code.indexOf('*/', elsep + 7) + 2);
          op = p = code.indexOf('*/', pRet) + 2;
          begin = -1;

          break;
        
        case endifp:
          if(begin == -1)
          {
            pRet = endifp;
            
            break mainLoop;
          }
          
          op = p = code.indexOf('*/', endifp + 8) + 2;
          begin = -1;
          
          break;
      }
    }  

    return out + code.slice(op, pRet);
  };

  var 
    stripRE = /\/\*##([\s\S]*?)\*\//g,
    evalRE = /\/\*#eval\*\/([\s\S]*?)\/\*#endeval\*\//g,
    _evalREReplacer = 
      function(all, a)
      {
        return eval(a);
      }
    ;

  $jb.MetaProcessor.prototype._pass = function(code, _testExpr)
  {
    if(_testExpr != null)
      this._testExpr = _testExpr;
    
    _testExprL = this._testExpr;
    
    return _passIf(code, 0).
      replace(stripRE, '$1').
      replace(evalRE, _evalREReplacer)
    ;
  };
})();  

});