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
 
*/

$jb.Loader._scope().
//_require("$jb/$G.Function.js").
_willDeclared("$jb/$jb.Preprocessor.js").
_completed(function(){

$jb.Preprocessor = function()
{
  this.defineFns = new Array();
  this.defineVars = new Array();
};

$jb.Preprocessor.prototype._define = function(name, expr)
{
  var i;
  
  if((i = name.indexOf('(')) === -1)
  {
    this.defineVars.push
    (
      { 
        name: name,
        match: new RegExp(name, 'g'),
        expr: expr
      }
    );
    
    return this;
  }
  
  var argMatches = name.slice(i + 1, -1).replace(/^\s+|\s+$/, '').split(/,\s*/),
    fnName = name.slice(0, i);
  
  i = argMatches.length;
  while(i--)
    argMatches[i] = new RegExp(argMatches[i], 'g');
  
  this.defineFns.push
  (
    {
      name: fnName,
      argMatches: argMatches, 
      expr: expr
    }
  );  

  return this;
};

(function()
{
  var _inf = function(n)
  {
    return (n === -1) ? +Infinity : n;
  };
  $jb.Preprocessor.prototype.__matchArg = function(s, p)
  {
    var 
      comma = -1,
      
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
      op;
    
    for(;;)
    {
      //console.log(p);
      if(comma < p)
        comma = _inf(s.indexOf(',', p));
      
      if(openBracket < p)
        openBracket = _inf(s.indexOf('(', p));
      if(closeBracket < p)
        closeBracket = _inf(s.indexOf(')', p));
      
      if(openSquareBracket < p)
        openSquareBracket = _inf(s.indexOf('[', p));
      if(closeSquareBracket < p)
        closeSquareBracket = _inf(s.indexOf(']', p));
      
      if(openCurlyBracket < p)
        openCurlyBracket = _inf(s.indexOf('{', p));
      if(closeCurlyBracket < p)
        closeCurlyBracket = _inf(s.indexOf('}', p));
      
      if(singleQuote < p)
        singleQuote = _inf(s.indexOf('\'', p)); 
      if(dblQuote < p)
        dblQuote = _inf(s.indexOf('"', p));
      if(blockComment < p)
        blockComment = _inf(s.indexOf('/*', p));
      if(lineComment < p)
        lineComment = _inf(s.indexOf('//', p));

      switch(Math.min(comma, openBracket, closeBracket, openSquareBracket, closeSquareBracket, openCurlyBracket, closeCurlyBracket, singleQuote, dblQuote, blockComment, lineComment))
      {
        case Infinity:
          return +Infinity;
        
        case comma:
          //console.log('comma');
          if(bracketCount === 0)
            return comma;
          
          comma = _inf(s.indexOf(',', ++p));
          break;
        case openBracket:
          //console.log('openBracket');
          ++bracketCount;
          openBracket = _inf(s.indexOf('(', (p = openBracket + 1)));
          break;
        case closeBracket:
          //console.log('closeBracket');
          if(--bracketCount === -1)
            return closeBracket;
            
          closeBracket = _inf(s.indexOf(')', (p = closeBracket + 1)));
          
          break;
        case openSquareBracket:
          //console.log('openSquareBracket');
          ++bracketCount;
          openSquareBracket = _inf(s.indexOf('[', (p = openSquareBracket + 1)));
          break;
        case closeSquareBracket:
          //console.log('closeSquareBracket');
          if(--bracketCount === -1)
            return closeSquareBracket;
            
          closeSquareBracket = _inf(s.indexOf(']', (p = closeSquareBracket + 1)));
          
          break;
        case openCurlyBracket:
          //console.log('openBracket');
          ++bracketCount;
          openCurlyBracket = _inf(s.indexOf('{', (p = openCurlyBracket + 1)));
          break;
        case closeCurlyBracket:
          //console.log('closeBracket');
          if(--bracketCount === -1)
            return closeCurlyBracket;
            
          closeCurlyBracket = _inf(s.indexOf('}', (p = closeCurlyBracket + 1)));
          
          break;
        case singleQuote:
          //console.log('singleQuote');
          
          p = singleQuote;
          
          do
          {
            p = s.indexOf('\'',(op = p + 1));
          }
          while(p > -1  && s.charAt(p - 1) === '\\');
          
          singleQuote = _inf(s.indexOf('\'', (p > -1) ? p + 1 : op));
          p = op;
          
          break;
        case dblQuote:
          //console.log('dblQuote');
          
          p = dblQuote;
          
          do
          {
            p = s.indexOf('"',(op = p + 1));
          }
          while(p > -1  && s.charAt(p - 1) === '\\');
          
          dblQuote = _inf(s.indexOf('"', (p > -1) ? p + 1 : op));
          p = op;
            
          break;
        case blockComment:
          //console.log('blockComment');
          
          blockComment = _inf(s.indexOf('/*', (p = _inf(s.indexOf('*/', (op = p) + 2)) + 2)));
          
          if(!isFinite(p))
            p = op;
            
          break;
        case lineComment:
          //console.log('lineComment');
          
          lineComment = _inf(s.indexOf('//', (p = _inf(s.indexOf('\n', (op = p) + 2)) + 2)));
          
          if(!isFinite(p))
            p = op;
          
          break;
      }
    }
  };
})();


$jb.Preprocessor.prototype.__pass = function(s)
{
  var i, j, d, name,
    out, p, op,
    argMatches, j, aLen, match, expr, changeCount 
    //argMatchC = argMatch,
    ;
    
  do
  {
    changeCount = 0;
    
    i = (ds = this.defineVars).length;

    out = s;
    while(i--)
      out = out.replace((d = ds[i]).match, d.expr);

    if(s !== out)
      s = out, ++changeCount;
    
    i = (ds = this.defineFns).length;

    while(i--)
    {
      d = ds[i], name = d.name;
      p = 0, out = '';
      
      while((p = s.indexOf(name, op = p)) > -1)
      {
        out += s.slice(op, p);
        p = s.indexOf('(', p + name.length) + 1;
        
        j = -1, aLen = (argMatches = d.argMatches).length;
        expr = d.expr;
        
        while(++j < aLen && s.charAt(p - 1) !== ')' && isFinite(p = this.__matchArg(s, (op = p))))
          expr = expr.replace(argMatches[j], s.slice(op, p++).replace(/^\s+|\s+$/g, ''));
        
        //console.log(aLen - j);
        
        while(j < aLen)
          expr = expr.replace(argMatches[j++], '');
        
        //console.log(s.charAt(p));
        
        /*
        if(s.charAt(p) !== ')')
        {
          --p;
          while(s.charAt(p++) !== ')' && isFinite(p = this.__matchArg(s, p)))
            console.log(s.charAt(p));
            
          op = ++p;  
        }
        */
        
        out += expr;
      }
      
      //console.log('op = ', op);
        
      if(op > 0)
        s = out + s.slice(op), ++changeCount;
    }
  }
  while(changeCount > 0);
  
  //console.log('end');
  
  return s;
};

$jb.Preprocessor.prototype._pass = $jb.Preprocessor.prototype.__pass;


$jb._preprocessingTextBegin = function(_fn)
{
  return {
    _preprocessingTextEnd: function()
    {
      var t = "" + _fn;
      
      return t.slice(t.indexOf('{') + 1, -1);
    }
  };
}
});