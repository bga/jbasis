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
_require("$jb/$G.String.js"). // ._escapeForRegExpReplace .trim ._optimizeCharsAccess
_require("$jb/$G.Number.js"). // ._fixupIntToUIntBug
_willDeclared("$jb/$jb.Preprocessor.js").
_completed(function($G, $jb){

var RegExp = $G.RegExp;

$jb.Preprocessor = function()
{
  this.definesMap = {'default': []};
  //this.isDefinesChanged = false;
};

/** @alias */
var PreprocessorProto = $jb.Preprocessor.prototype;

var argsSplitRE = /,\s*/,
  defaultGroupNames = ['default'];

PreprocessorProto.__defConst = function(name, expr, group)
{
  group.push
  (
    { 
      name: name,
      match: new RegExp(name._escapeForRegExpReplace(), 'g'),
      expr: expr
    }
  );
};
PreprocessorProto.__defFn = function(name, indexes, argMatches, expr, group)
{
  group.push
  (
    {
      name: name,
      indexes: indexes,
      argMatches: argMatches,
      expr: expr
    }
  );
};

(function()
{
  var argsL;
  var _cmp = function(a, b)
  {
    return argsL[b].length - argsL[a].length;
  };
  
  PreprocessorProto.__argsToIndexes = function(args)
  {
    var i = args.length,
      indexes = new Array(i);
    
    argsL = args;
    
    while(i--)
      indexes[i] = i;
    
    indexes.sort(_cmp);
    
    //console.log(args);
    //console.log(indexes);
    return indexes;
  };
})();  

PreprocessorProto.__argsToArgMatches = function(args)
{
  var i = args.length;
  
  while(i--)
    args[i] = new RegExp(args[i]._escapeForRegExpReplace(), 'g');
  
  return args;
};

PreprocessorProto._define = function(name, expr, groupNames)
{
  if(groupNames == null)
    groupNames = defaultGroupNames;
  else if(groupNames.length < 1)
    return this;
    
  var i, definesMap = this.definesMap;
  
  if((i = name.indexOf('(')) < 0)
  {  
    var j = groupNames.length; while(j--)
      this.__defConst(name, expr, definesMap[groupNames[j]] || (definesMap[groupNames[j]] = []));
  }
  else
  {
    var args = name.slice(i + 1, -1).trim().split(argsSplitRE), 
      indexes = this.__argsToIndexes(args);
      
    this.__argsToArgMatches(args);
    name = name.slice(0, i);
    
    var j = groupNames.length - 1;
    
    this.__defFn(name, indexes, args, expr, definesMap[groupNames[j]] || (definesMap[groupNames[j]] = []));

    while(j--)
      this.__defFn(name, indexes.slice(0), args.slice(0), expr, definesMap[groupNames[j]] || (definesMap[groupNames[j]] = []));
  }
  
  j = groupNames.length; while(j--)
    definesMap[groupNames[j]].isDefinesChanged = true;

  return this;
};

PreprocessorProto._defConst = function(name, expr, groupNames)
{
  if(groupNames == null)
    groupNames = defaultGroupNames;
  else if(groupNames.length < 1)
    return this;
    
  var definesMap = this.definesMap;
  
  var j = groupNames.length; while(j--)
    this.__defConst(name, expr, definesMap[groupNames[j]]);
  
  j = groupNames.length; while(j--)
    definesMap[groupNames[j]].isDefinesChanged = true;

  return this;
};
PreprocessorProto._defFn = function(name, args, expr, groupNames)
{
  if(groupNames == null)
    groupNames = defaultGroupNames;
  else if(groupNames.length < 1)
    return this;
    
  var definesMap = this.definesMap;
  
  var args = name.slice(i + 1, -1).trim().split(argsSplitRE), 
    indexes = this.__argsToIndexes(args);
    
  this.__argsToArgMatches(args);
  name = name.slice(0, i);
  
  var j = groupNames.length - 1;
  
  this.__defFn(name, indexes, args, expr, definesMap[groupNames[j]]);

  while(j--)
    this.__defFn(name, indexes.slice(0), args.slice(0), expr, definesMap[groupNames[j]]);
  
  var j = groupNames.length; while(j--)
    definesMap[groupNames[j]].isDefinesChanged = true;

  return this;
};

PreprocessorProto._undef = function(name, groupNames)
{
  if(groupNames == null)
    groupNames = defaultGroupNames;
  else if(groupNames.length < 1)
    return this;

  var definesMap = this.definesMap, ds;
  
  var j = groupNames.length; while(j--)
  {
    if((ds = definesMap[j]) && ds.length)
    {
      var dsI = -1, d;
      
      while((d = ds[++dsI]) && d.name != name)
        ;
        
      if(d)
        ds.splice(dsI, 1);
    }    
  }
};


PreprocessorProto.__matchArg = function(s, p)
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
    
    regExp = -1,
    
    op,
    
    _min = Math.min
    ;
  
  for(;;)
  {
    //console.log("p = " + p);
    if(comma < p)
    {
      comma = s.indexOf(',', p) >>> 0;
    }
    
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
    
    switch(_min(comma, openBracket, closeBracket, openSquareBracket, closeSquareBracket, openCurlyBracket, closeCurlyBracket, singleQuote, dblQuote, blockComment, lineComment, regExp))
    {
      case 4294967295:
        return 4294967295;
      
      case comma:
        //console.log('comma');
        if(bracketCount == 0)
          return comma;
        
        comma = s.indexOf(',', ++p) >>> 0;
        break;
      case openBracket:
        //console.log('openBracket');
        ++bracketCount;
        openBracket = s.indexOf('(', (p = openBracket + 1)) >>> 0;
        break;
      case closeBracket:
        //console.log('closeBracket');
        if(--bracketCount == -1)
          return closeBracket;
          
        closeBracket = s.indexOf(')', (p = closeBracket + 1)) >>> 0;
        
        break;
      case openSquareBracket:
        //console.log('openSquareBracket');
        ++bracketCount;
        openSquareBracket = s.indexOf('[', (p = openSquareBracket + 1)) >>> 0;
        break;
      case closeSquareBracket:
        //console.log('closeSquareBracket');
        if(--bracketCount == -1)
          return closeSquareBracket;
          
        closeSquareBracket = s.indexOf(']', (p = closeSquareBracket + 1)) >>> 0;
        
        break;
      case openCurlyBracket:
        //console.log('openCurlyBracket');
        ++bracketCount;
        openCurlyBracket = s.indexOf('{', (p = openCurlyBracket + 1)) >>> 0;
        break;
      case closeCurlyBracket:
        //console.log('closeCurlyBracket');
        if(--bracketCount == -1)
          return closeCurlyBracket;
          
        closeCurlyBracket = s.indexOf('}', (p = closeCurlyBracket + 1)) >>> 0;
        
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
        {
          dblQuote = s.indexOf('\'', ++p) >>> 0;
        }
        else
        {
          dblQuote = s.indexOf('\'', (p = op + 1)) >>> 0;
        }
        
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
        {
          dblQuote = s.indexOf('"', ++p) >>> 0;
        }
        else
        {
          dblQuote = s.indexOf('"', (p = op + 1)) >>> 0;
        }
        
        break;
      case blockComment:
        //console.log('blockComment');
        p = s.indexOf('*/', (op = p) + 2) >>> 0;

        if(p == 4294967295)
        {
          blockComment = p; p = op;
        }
        else
        {
          blockComment = s.indexOf('/*', p  += 2) >>> 0;
        }
        
        break;
      case lineComment:
        //console.log('lineComment');
        p = s.indexOf('\n', (op = p) + 2) >>> 0;

        if(p == 4294967295)
        {
          lineComment = p; p = op;
        }
        else
        {
          lineComment = s.indexOf('//', ++p) >>> 0;
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
        {
          regExp = s.indexOf('/', ++p) >>> 0;
        }
        else
        {
          regExp = s.indexOf('/', (p = op + 1)) >>> 0;
        }
        
        break;
    }
  }
};


(function()
{
  var a, b = a = (a  = '' + PreprocessorProto.__matchArg).
    slice(a.indexOf('{') + 1, a.lastIndexOf('}') - 1);

  a = String._optimizeCharsAccess(a);
  a = Number._fixupIntToUIntBug(a);

  if(a != b)  
    PreprocessorProto.__matchArg = new Function('s, p', a);
})();

(function()
{
  var _cmp = function(a, b)
  {
    return b.name.length - a.name.length;
  };
  
  PreprocessorProto.__sortDefines = function(groups)
  {
    var _cmpC = _cmp;
    
    var i = -1, group; while((group = groups[++i]))
    {
      if(group.isDefinesChanged)
        group.sort(_cmpC).isDefinesChanged = false;
    }
    
    /*
    var definesName, definesMap = this.definesMap;
    
    for(definesName in definesMap)
    {
      if(definesMap.hasOwnProperty(definesName) && definesMap[definesName].isDefinesChanged)
        definesMap[definesName].sort(_cmpC).isDefinesChanged = false;
    }
    */
  };
})();
  
PreprocessorProto.__pass = function(s, groupNames, evalObj)
{
  var dsm = this.definesMap,
    groups = [], groupsI,
    dsI, ds, d, name,
    out, p, op,
    argMatches, aI, aLen, argMatch, match, expr, exprs = [], indexes, temp,
    __matchArgC = this.__matchArg
    ;
    
  if(groupNames == null)
    groupNames = defaultGroupNames;
  else if(groupNames.length < 1)
    return this;
  
  groupsI = -1;
  p = groupNames.length; while(p--)
  {  
    if((name = groupNames[p]) in dsm)
      groups[++groupsI] = dsm[name];
  }

  this.__sortDefines(groups);
  
  //console.log(this.defineFns);
  
  
  do
  {
    groupsI = -1; lblMainLoop: while(ds = groups[++groupsI])
    {
      dsI = -1; while((d = ds[++dsI]))
      {
        if((p = s.indexOf((name = d.name))) < 0)
          continue;
        
        // defFn
        if((argMatches = d.argMatches))
        {
          op = 0, out = '';
        
          do
          {
            out += s.slice(op, p);
            p = s.indexOf('(', p + name.length) + 1;
            
            aI = -1; aLen = argMatches.length;
            expr = d.expr;
            exprs.length = aLen;
            
            while(
              s.charAt(p - 1) != ')' &&
              ++aI < aLen &&
              (p = __matchArgC(s, (op = p))) != 4294967295
            )
            {
              exprs[aI] = s.slice(op, p++).trim();
            }  
            //expr = expr.replace(argMatch, s.slice(op, p++).trim());
            
            //console.log(aLen - j);
            
            while(++aI < aLen)
              exprs[aI] = '';
              
            if(typeof(expr) == 'function')
            {
              out += expr.apply(evalObj, exprs);
            }  
            else
            {
              aI = -1; indexes = d.indexes;

              while(++aI < aLen)
                expr = expr.replace(argMatches[(temp = indexes[aI])], exprs[temp]);
            
              //console.log(s.charAt(p - 1));
              
              /*
              if(s.charAt(p) != ')')
              {
                --p;
                while(s.charAt(p++) != ')' && isFinite(p = this.__matchArg(s, p)))
                  console.log(s.charAt(p));
                  
                op = ++p;  
              }
              */
              
              out += expr;
            }  
          }
          while((p = s.indexOf(name, (op = p))) > -1)

          s = out + s.slice(op);
        }
        // defConst
        else
        {
          s = s.slice(0, p) + d.expr + s.slice(p + name.length).replace(d.match, d.expr);
        }
        
        break lblMainLoop;
      }
    }  
  }
  while(d);
  
  return s;
  
  /*
  // __EVAL__
  var i = -1, out = '',
    _eval = this._eval
    ;
  
  while((p  = s.indexOf('__EVAL__(', (op = ++i))) > -1 && (i = __matchArgC(s, (p + 9))) != 4294967295)
  {
    out += s.slice(op, p);
    
    switch(s.charAt((p += 9)))
    {
      case '"':
      case '\'':
        //$G._log(s.slice(p + 1, i - 1));
        out += _eval(s.slice(p + 1, i - 1));
        break;
      default:
        //$G._log(s.slice(p , i ));
        out += _eval(s.slice(p, i));
        break;
    }
  }
  
  s = out + s.slice(op);
  
  //console.log('end');
  
  return s;
  */
};

PreprocessorProto._pass = PreprocessorProto.__pass;


$jb._preprocessingTextBegin = function(_fn)
{
  return {
    _preprocessingTextEnd: function()
    {
      var t = '' + _fn;
      
      return t.slice(t.indexOf('{') + 1, -1).trim();
    }
  };
}
});