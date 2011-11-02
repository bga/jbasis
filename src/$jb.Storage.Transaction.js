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
//_require("$jb/$jb.nav.js").
//_require("$jb/$G.Function.js").
//_require("$jb/OOP.js").
_willDeclared("js/$A.DB.Transaction.js").
_completed(function(){

if($A.DB == null)
  $A.DB = {};

$A.DB.Transaction = function(wrappedTransaction)
{
  if(wrappedTransaction != null)
  {
    this.wrappedTransaction = wrappedTransaction;
    
    if(wrappedTransaction.childTransactions)
      wrappedTransaction.childTransactions.push(this);
  }
  
  this.childTransactions = [];

  this.updatedData = {};
  this.deletedData = {};
};

$A.DB.Transaction.prototype._get = function(name)
{
  if(this.updatedData.hasOwnProperty(name))
    return this.updatedData[name];
  
  if(this.deletedData.hasOwnProperty(name))
    return;

  return this.wrappedTransaction._get(name);
};
$A.DB.Transaction.prototype._set = function(name, value)
{
  if(this.updatedData.hasOwnProperty(name))
    this.updatedData[name] = value;
  
  this.updatedData[name] = value;
  delete this.deletedData[name];
};
$A.DB.Transaction.prototype._delete = function(name)
{
  if(this.deletedData.hasOwnProperty(name))
    return;
    
  this.deletedData[name] = true;
  
  if(this.updatedData.hasOwnProperty(name))
    delete this.updatedData[name];
};
$A.DB.Transaction.prototype._has = function(name)
{
  return this.updatedData.hasOwnProperty(name) || !this.deletedData.hasOwnProperty(name) || this.wrappedTransaction._has(name); 
};
$A.DB.Transaction.prototype._apply = function()
{
  var i, obj, wrappedTransaction = this.wrappedTransaction;
  
  obj = this.deletedData; for(i in obj)
  {
    if(obj.hasOwnProperty(i))
    {
      wrappedTransaction._delete(i);
    }
  }
  obj = this.updatedData; for(i in obj)
  {
    if(obj.hasOwnProperty(i))
    {
      wrappedTransaction._set(i, obj[i]);
    }
  }
  
  if(wrappedTransaction.childTransactions)
    wrappedTransaction.childTransactions.push.apply(wrappedTransaction.childTransactions, this.childTransactions);
};
$A.DB.Transaction.prototype._truncate = function()
{
  this.updatedData = {};
  this.deletedData = {};
};

$A.DB.Transaction.prototype._serialize = function()
{
  return JSON.stringify({updatedData: this.updatedData, deletedData: this.deletedData});
};
$A.DB.Transaction.prototype._deserialize = function(str)
{
  var obj = JSON.parse(str);
  
  this.updatedData = obj.updatedData;
  this.deletedData = obj.deletedData;
};

});

/*
updatedData:
{
  'productvariants-999-parametervalues-100':'parametervalues-23',
  'productvariants-999-parametervalues-101':'parametervalues-24',
  'productvariants-999-parametervalues-uuid':102,
  
  'parametervalues-23-productvariants-34': 'productvariants-999',
  'parametervalues-23-productvariants-uuid': 35,
  
  'parametervalues-24-productvariants-56': 'productvariants-999',
  'parametervalues-24-productvariants-uuid': 57
}
*/