/*
"(@Alt || @LAlt) && @K && @@==2 => \
 (@Alt || @LAlt) && @I && @@==2 => \
 @@==0";

"state.a = 2; return true => \
 keyPressedCount - @alt - @k - keyMap[345] == 0 && --state.a => \
 keyPressedCount - @alt - @i == 0 => \
 keyPressedCount == 0";

v._on('keySequence', this._onAltA, 'keyPressedCount - @alt - @a == 0 => keyPressedCount == 0'); 
*/

$jb.Loader._scope().
_require("$jb/$jb.keyMap.js").
_willDeclared("$jb/KeyManager.js").
_completed(function($G, $jb){

var OnKeySequence = $jb.CommonDOM.Event.OnKeySequence = function(v)
{
  this.rules_ = [];
  
  this.keys_ = new Array(256);
  this.keyPressedCount_ = 0;
};

OnKeySequence.prototype._onKeyUp = function(e)
{
  if(this.keys_[e.keyCode] === 1)
    --this.keyPressedCount_;
  
  this.keys_[e.keyCode] = 0;
  
  this.__processRules();
};
OnKeySequence.prototype._onKeyDown = function(e)
{
  if(this.keys_[e.keyCode] === 0)
    ++this.keyPressedCount_;
  
  this.keys_[e.keyCode] = 1;

  this.__processRules();
};
OnKeySequence.prototype.__processRules = function()
{
  var i = -1, rules = this.rules_, rule;
  var rulesWithCompletedSequence = [];
  var keys = this.keys_, keyPressedCount = this.keyPressedCount_;
  
  while((rule = rules[++i]))
  {
    if(rule._curFn(keyPressedCount, keys, rule.state))
    {
      var j = rule.curFnIndex, fns = rule.fns, state = rule.state;
      
      while(fns[++j](keyPressedCount, keys, state))
        ;
      
      if((rule._curFn = fns[j]) == null)
      {
        rule._curFn = fns[(rule.curFnIndex = 0)];
        rulesWithCompletedSequence.push(rule);
      }
    }
  }
  
  // TODO fire events here
  /*
  var i = -1; while((rule = rulesWithCompletedSequence[++i]))
    rule._onSequenceComplete(new Event(rule.v));
  */
};
OnKeySequence.prototype.__compileRule = function(t)
{
  try
  {
    return eval('0,[function(keyPressedCount, keys, state){ return ' + t.replace(
      /(?:@[A-Za-z0-9]+)/g,
      function(str)
      {
        var code=$jb.keyMap[str.substring(1).toUpperCase()];
        
        if(code!=null)
          return "keys[" + code + "]";
        else
          return "true";
      }
    ).
    replace(/@@/g, 'keyPressedCount').
    replace(/=>/, ';}, function(keyPressedCount, keys, state) { return ')+
    ";}]");
  }
  catch(err)
  {
    return null;
  };
};

});