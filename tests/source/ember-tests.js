minispade.register('ember-statechart/~tests/event_handling/advanced/respond_to_event_test', function() {
// ==========================================================================
// SC.Statechart Unit Test
// ==========================================================================
/*globals SC statechart */

var statechart, TestState, root, stateA, stateB, stateC, stateD, stateE, stateF, stateX, stateY, stateZ;

// ..........................................................
// CONTENT CHANGING
// 

module("SC.Statechart: - Respond to Actions Tests", {
  setup: function() {
    TestState = SC.State.extend({
      returnValue: null,
      handledAction: NO,
      
      handleAction: function() {
        this.set('handledAction', YES);
        return this.get('returnValue');
      },
      
      reset: function() {
        this.set('returnValue', null);
        this.set('handledAction', NO);
      }
    });
    
    statechart = SC.Statechart.create({
      
      someFunctionInvoked: NO,
      someFunctionReturnValue: null,
      
      someFunction: function() {
        this.set('someFunctionInvoked', YES);
        return this.get('someFunctionReturnValue');
      },
      
      rootState: TestState.extend({
        
        actionA: function(sender, context) {
          return this.handleAction();
        },
        
        actionHandler: function(action, sender, context) {
          return this.handleAction();
        }.handleActions('actionB'),
        
        initialSubstate: 'a',
        
        a: TestState.extend({
          foo: function(sender, context) {
            return this.handleAction();
          }
        }),
        
        b: TestState.extend({
          bar: function(sender, context) { 
            return this.handleAction();
          },
          
          actionHandler: function(action, sender, context) {
            return this.handleAction();
          }.handleActions('frozen', 'canuck')
        }),
        
        c: TestState.extend({
          actionHandlerA: function(action, sender, context) {
            return this.handleAction();
          }.handleActions('yes'),
          
          actionHandlerB: function(action, sender, context) {
            return this.handleAction();
          }.handleActions(/^num/i)
        }),
        
        d: TestState.extend({
          unknownAction: function(action, sender, context) {
            return this.handleAction();
          }
        }),
        
        e: TestState.extend({
          actionHandler: function(action,sender, context) {
            return this.handleAction();
          }.handleActions('plus', 'minus'),
          
          initialSubstate: 'f',
          
          f: TestState.extend({
            foo: function(sender, context) {
              return this.handleAction();
            }
          })
        }),
        
        z: TestState.extend({
          blue: function(sender, context) {
            return this.handleAction();
          },
          
          substatesAreConcurrent: YES,
          
          x: TestState.extend({
            yellow: function(sender, context) {
              return this.handleAction();
            }
          }),
          
          y: TestState.extend({
            orange: function(sender,context) {
              return this.handleAction();
            }
          })
        })
        
      })
      
    });
    
    statechart.initStatechart();
    root = statechart.get('rootState');
    stateA = statechart.getState('a');
    stateB = statechart.getState('b');
    stateC = statechart.getState('c');
    stateD = statechart.getState('d');
    stateE = statechart.getState('e');
    stateF = statechart.getState('f');
    stateX = statechart.getState('x');
    stateY = statechart.getState('y');
    stateZ = statechart.getState('z');
  },
  
  teardown: function() {
    statechart = TestState = root = null;
    stateA = stateB = stateC = stateD = stateE = stateF = stateX = stateY = stateZ = null;
  }
});

test("check state A", function() {
  ok(stateA.respondsToAction('foo'), 'state A should respond to action foo');
  ok(!stateA.respondsToAction('foox'), 'state A should not respond to action foox');
  ok(!stateA.respondsToAction('actionA'), 'state A should not respond to action actionA');
  ok(!stateA.respondsToAction('actionB'), 'state A should not respond to action actionB');
  
  ok(stateA.get('isCurrentState'), 'state A is current state');
  
  ok(statechart.respondsTo('foo'), 'statechart should respond to foo');
  ok(statechart.respondsTo('actionA'), 'statechart should respond to actionA');
  ok(statechart.respondsTo('actionB'), 'statechart should respond to actionB');
  ok(!statechart.respondsTo('foox'), 'statechart should respond to foox');
  ok(!statechart.respondsTo('actionC'), 'statechart should respond to actionC');
});

test("check state B", function() {
  ok(stateB.respondsToAction('bar'), 'state B should respond to action bar');
  ok(stateB.respondsToAction('frozen'), 'state B should respond to action frozen');
  ok(stateB.respondsToAction('canuck'), 'state B should respond to action canuck');
  ok(!stateB.respondsToAction('canuckx'), 'state B should not respond to action canuckx');
  ok(!stateB.respondsToAction('barx'), 'state B should not respond to action barx');
  ok(!stateB.respondsToAction('actionA'), 'state B should not respond to action actionA');
  ok(!stateB.respondsToAction('actionB'), 'state B should not respond to action actionB');

  ok(!statechart.respondsTo('bar'), 'statechart should not respond to bar');
  ok(!statechart.respondsTo('frozen'), 'statechart should not respond to frozen');
  ok(!statechart.respondsTo('canuck'), 'statechart should not respond to canuck');
  
  statechart.gotoState(stateB);
  ok(stateB.get('isCurrentState'), 'state B is current state');
  
  ok(statechart.respondsTo('bar'), 'statechart should respond to bar');
  ok(statechart.respondsTo('frozen'), 'statechart should respond to frozen');
  ok(statechart.respondsTo('canuck'), 'statechart should respond to canuck');
  ok(statechart.respondsTo('actionA'), 'statechart should respond to actionA');
  ok(statechart.respondsTo('actionB'), 'statechart should respond to actionB');
  ok(!statechart.respondsTo('canuckx'), 'statechart should not respond to canuckx');
  ok(!statechart.respondsTo('barx'), 'statechart should not respond to foox');
  ok(!statechart.respondsTo('actionC'), 'statechart should not respond to actionC');
});

test("check state C", function() {
  ok(stateC.respondsToAction('yes'), 'state C should respond to action yes');
  ok(stateC.respondsToAction('num1'), 'state C should respond to action num1');
  ok(stateC.respondsToAction('num2'), 'state C should respond to action num2');
  ok(!stateC.respondsToAction('no'), 'state C should not respond to action no');
  ok(!stateC.respondsToAction('xnum1'), 'state C should not respond to action xnum1');
  ok(!stateC.respondsToAction('actionA'), 'state C should not respond to action actionA');
  ok(!stateC.respondsToAction('actionB'), 'state C should not respond to action actionB');

  ok(!statechart.respondsTo('yes'), 'statechart should not respond to action yes');
  ok(!statechart.respondsTo('num1'), 'statechart should not respond to action num1');
  ok(!statechart.respondsTo('num2'), 'statechart should not respond to action num2');
  
  statechart.gotoState(stateC);
  ok(stateC.get('isCurrentState'), 'state C is current state');
  
  ok(statechart.respondsTo('yes'), 'statechart should respond to action yes');
  ok(statechart.respondsTo('num1'), 'statechart should respond to action num1');
  ok(statechart.respondsTo('num2'), 'statechart should respond to action num2');
  ok(statechart.respondsTo('actionA'), 'statechart should respond to action actionA');
  ok(statechart.respondsTo('actionB'), 'statechart should respond to action actionB');
  ok(!statechart.respondsTo('no'), 'statechart should not respond to action no');
  ok(!statechart.respondsTo('xnum1'), 'statechart should not respond to action xnum1');
  ok(!statechart.respondsTo('actionC'), 'statechart should not respond to action actionC');
});

test("check state D", function() {
  ok(stateD.respondsToAction('foo'), 'state D should respond to action foo');
  ok(stateD.respondsToAction('xyz'), 'state D should respond to action xyz');
  ok(stateD.respondsToAction('actionA'), 'state D should respond to action actionA');
  ok(stateD.respondsToAction('actionB'), 'state D should respond to action actionB');
  
  statechart.gotoState(stateD);
  ok(stateD.get('isCurrentState'), 'state D is current state');
  
  ok(statechart.respondsTo('foo'), 'statechart should respond to action foo');
  ok(statechart.respondsTo('xyz'), 'statechart should respond to action xyz');
  ok(statechart.respondsTo('actionA'), 'statechart should respond to action actionA');
  ok(statechart.respondsTo('actionB'), 'statechart should respond to action actionB');
  ok(statechart.respondsTo('actionC'), 'statechart should respond to action actionC');
});

test("check states E and F", function() {
  ok(stateE.respondsToAction('plus'), 'state E should respond to action plus');
  ok(stateE.respondsToAction('minus'), 'state E should respond to action minus');
  ok(!stateE.respondsToAction('actionA'), 'state E should not respond to action actionA');
  ok(!stateE.respondsToAction('actionB'), 'state E should not respond to action actionB');
  
  ok(stateF.respondsToAction('foo'), 'state F should respond to action foo');
  ok(!stateF.respondsToAction('plus'), 'state F should not respond to action plus');
  ok(!stateF.respondsToAction('minus'), 'state F should not respond to action minus');

  ok(!statechart.respondsTo('plus'), 'statechart should not respond to action plus');
  ok(!statechart.respondsTo('minus'), 'statechart should not respond to action minus');
  
  statechart.gotoState(stateE);
  ok(!stateE.get('isCurrentState'), 'state E is not current state');
  ok(stateF.get('isCurrentState'), 'state F is current state');
  
  ok(statechart.respondsTo('foo'), 'statechart should respond to action foo');
  ok(statechart.respondsTo('plus'), 'statechart should respond to action plus');
  ok(statechart.respondsTo('minus'), 'statechart should respond to action minus');
  ok(statechart.respondsTo('actionA'), 'statechart should respond to action actionA');
  ok(statechart.respondsTo('actionB'), 'statechart should respond to action actionB');
  ok(!statechart.respondsTo('foox'), 'statechart should respond to action foox');
  ok(!statechart.respondsTo('actionC'), 'statechart should not respond to action actionC');
});

test("check states X, Y and Z", function() {
  ok(stateZ.respondsToAction('blue'), 'state Z should respond to action blue');
  ok(!stateZ.respondsToAction('yellow'), 'state Z should not respond to action yellow');
  ok(!stateZ.respondsToAction('orange'), 'state Z should not respond to action orange');
  
  ok(!stateX.respondsToAction('blue'), 'state X should not respond to action blue');
  ok(stateX.respondsToAction('yellow'), 'state X should respond to action yellow');
  ok(!stateX.respondsToAction('orange'), 'state X should not respond to action orange');
  
  ok(!stateY.respondsToAction('blue'), 'state Y should not respond to action blue');
  ok(!stateY.respondsToAction('foo'), 'state Y should respond to action yellow');
  ok(stateY.respondsToAction('orange'), 'state Y should not respond to action orange');

  ok(!statechart.respondsTo('blue'), 'statechart should not respond to action blue');
  ok(!statechart.respondsTo('yellow'), 'statechart should not respond to action yellow');
  ok(!statechart.respondsTo('orange'), 'statechart should not respond to action orange');
  
  statechart.gotoState(stateZ);
  ok(!stateZ.get('isCurrentState'), 'state Z is not current state');
  ok(stateX.get('isCurrentState'), 'state X is current state');
  ok(stateY.get('isCurrentState'), 'state Y is current state');
  
  ok(statechart.respondsTo('blue'), 'statechart should respond to action blue');
  ok(statechart.respondsTo('yellow'), 'statechart should respond to action yellow');
  ok(statechart.respondsTo('orange'), 'statechart should respond to action orange');
  ok(statechart.respondsTo('actionA'), 'statechart should respond to action actionA');
  ok(statechart.respondsTo('actionB'), 'statechart should respond to action actionB');
  ok(!statechart.respondsTo('bluex'), 'statechart should not respond to action bluex');
  ok(!statechart.respondsTo('yellowx'), 'statechart should not respond to action yellowx');
  ok(!statechart.respondsTo('orangex'), 'statechart should not respond to action orangex');
  ok(!statechart.respondsTo('actionC'), 'statechart should not respond to action actionC');
});

test("try to perform 'someFunction' on statechart -- current states A", function() {
  ok(statechart.respondsTo('someFunction'), 'statechart should respond to someFunction');
  ok(!statechart.get('someFunctionInvoked'), 'someFunctionInvoked should be false');
  ok(statechart.tryToPerform('someFunction'), 'statechart should perform someFunction');
  ok(statechart.get('someFunctionInvoked'), 'someFunctionInvoked should be true');
  
  statechart.set('someFunctionInvoked', NO);
  statechart.set('someFunctionReturnValue', NO);
  
  ok(statechart.respondsTo('someFunction'), 'statechart should respond to someFunction');
  ok(!statechart.tryToPerform('someFunction'), 'statechart should perform someFunction');
  ok(statechart.get('someFunctionInvoked'), 'someFunctionInvoked should be true');
});

test("try to perform 'foo' on statechart -- current state A", function() {
  ok(statechart.tryToPerform('foo'), 'statechart should perform foo');
  ok(stateA.get('handledAction'), 'state A did handle action foo');
  ok(!root.get('handledAction'), 'root not did handle action foo');
  
  stateA.reset();
  stateA.set('returnValue', NO);
  
  ok(!statechart.tryToPerform('foo'), 'statechart should not perform foo');
  ok(stateA.get('handledAction'), 'state A did handle action foo');
  ok(!root.get('handledAction'), 'root did not handle action foo');
});

test("try to perform 'foox' on statechart -- current state A", function() {
  ok(!statechart.tryToPerform('foox'), 'statechart should perform foo');
  ok(!stateA.get('handledAction'), 'state A did handle action foo');
  ok(!root.get('handledAction'), 'root not did handle action foo');
});

test("try to perform 'actionA' on statechart -- current state A", function() {
  ok(statechart.tryToPerform('actionA'), 'statechart should perform actionA');
  ok(!stateA.get('handledAction'), 'state A did not handle action actionA');
  ok(root.get('handledAction'), 'root did handle action actionA');
  
  root.reset();
  root.set('returnValue', NO);
  stateA.reset();
  
  ok(!statechart.tryToPerform('actionA'), 'statechart should not perform actionA');
  ok(!stateA.get('handledAction'), 'state A did not handle action actionA');
  ok(root.get('handledAction'), 'root did handle action actionA');
});

test("try to perform 'yes' on statechart -- current state C", function() {
  statechart.gotoState(stateC);
  
  ok(stateC.get('isCurrentState'), 'state C should be current state');
  
  ok(statechart.tryToPerform('yes'), 'statechart should perform yes');
  ok(stateC.get('handledAction'), 'state C did handle action yes');
  ok(!root.get('handledAction'), 'root not did handle action yes');
  
  stateC.reset();
  stateC.set('returnValue', NO);
  
  ok(!statechart.tryToPerform('yes'), 'statechart should not perform yes');
  ok(stateC.get('handledAction'), 'state C did handle action yes');
  ok(!root.get('handledAction'), 'root did not handle action yes');
});

test("try to perform 'num1' on statechart -- current state C", function() {
  statechart.gotoState(stateC);
  
  ok(stateC.get('isCurrentState'), 'state C should be current state');
  
  ok(statechart.tryToPerform('num1'), 'statechart should perform num1');
  ok(stateC.get('handledAction'), 'state C did handle action num1');
  ok(!root.get('handledAction'), 'root not did handle action num1');
  
  stateC.reset();
  stateC.set('returnValue', NO);
  
  ok(!statechart.tryToPerform('num1'), 'statechart should not perform num1');
  ok(stateC.get('handledAction'), 'state C did handle action num1');
  ok(!root.get('handledAction'), 'root did not handle action num1');
});

test("try to perform 'abc' on statechart -- current state D", function() {
  statechart.gotoState(stateD);
  
  ok(stateD.get('isCurrentState'), 'state D should be current state');
  
  ok(statechart.tryToPerform('abc'), 'statechart should perform abc');
  ok(stateD.get('handledAction'), 'state D did handle action abc');
  ok(!root.get('handledAction'), 'root not did handle action abc');
  
  stateD.reset();
  stateD.set('returnValue', NO);
  
  ok(!statechart.tryToPerform('abc'), 'statechart should not perform abc');
  ok(stateD.get('handledAction'), 'state D did handle action abc');
  ok(!root.get('handledAction'), 'root did not handle action abc');
});

test("try to perform 'yellow' on statechart -- current states X and Y", function() {
  statechart.gotoState(stateZ);
  
  ok(stateX.get('isCurrentState'), 'state X should be current state');
  ok(stateY.get('isCurrentState'), 'state Y should be current state');
  
  ok(statechart.tryToPerform('yellow'), 'statechart should perform yellow');
  ok(stateX.get('handledAction'), 'state X did handle action yellow');
  ok(!stateY.get('handledAction'), 'state Y did not handle action yellow');
  ok(!stateZ.get('handledAction'), 'state Z did not handle action yellow');
  ok(!root.get('handledAction'), 'root not did handle action yellow');
  
  stateX.reset();
  stateX.set('returnValue', NO);
  
  ok(!statechart.tryToPerform('yellow'), 'statechart should not perform yellow');
  ok(stateX.get('handledAction'), 'state X did handle action yellow');
  ok(!stateY.get('handledAction'), 'state Y did not handle action yellow');
  ok(!stateZ.get('handledAction'), 'state Z did not handle action yellow');
  ok(!root.get('handledAction'), 'root not did handle action yellow');
});
});
minispade.register('ember-statechart/~tests/event_handling/advanced/without_concurrent_states_test', function() {
// ==========================================================================
// SC.Statechart Unit Test
// ==========================================================================
/*globals SC */

var statechart1 = null;
var statechart2 = null;
var statechart3 = null;
var statechart4 = null;
var TestState = null;

module("Ki.Statechart: No Concurrent States - Advanced Action Handling Tests", {
  setup: function() {
    
    TestState = SC.State.extend({
      action: null,
      sender: null,
      context: null,
      handler: null,
      
      _handledAction: function(handler, action, sender, context) {
        this.set('handler', handler);
        this.set('action', action);
        this.set('sender', sender);
        this.set('context', context);
      },
      
      reset: function() {
        this.set('handler', null);
        this.set('action', null);
        this.set('sender', null);
        this.set('context', null);
      }
    });

    statechart1 = SC.Statechart.create({
      
      rootState: TestState.extend({
      
        foo: function(sender, context) {
          this._handledAction('foo', null, sender, context);
        },
        
        actionHandlerA: function(action, sender, context) {
          this._handledAction('actionHandlerA', action, sender, context);
        }.handleActions('plus', 'minus', 'mulitply', 'divide'),
        
        actionHandlerB: function(action, sender, context) {
          this._handledAction('actionHandlerB', action, sender, context);
        }.handleActions(/num\d/),
        
        unknownAction: function(action, sender, context) {
          this._handledAction('unknownAction', action, sender, context);
        }
        
      })
      
    });
    
    statechart2 = SC.Statechart.create({
      
      rootState: TestState.extend({
        
        foo: function(sender, context) {
          this._handledAction('foo', null, sender, context);
        }
        
      })
      
    });
    
    statechart3 = SC.Statechart.create({
      
      rootState: TestState.extend({
        
        actionHandlerA: function(action, sender, context) {
          this._handledAction('actionHandlerA', action, sender, context);
        }.handleActions(/num\d/, 'decimal'),
        
        actionHandlerB: function(action, sender, context) {
          this._handledAction('actionHandlerB', action, sender, context);
        }.handleActions(/foo/, /bar/)
        
      })
      
    });
    
    statechart4 = SC.Statechart.create({
      
      rootState: TestState.extend({
        
        initialSubstate: 'a',
        
        foo: function(sender, context) {
          this._handledAction('foo', null, sender, context);
        },
        
        actionHandlerRoot: function(action, sender, context) {
          this._handledAction('actionHandlerRoot', action, sender, context);
        }.handleActions('yes', 'no'),
        
        unknownAction: function(action, sender, context) {
          this._handledAction('unknownAction', action, sender, context);
        },
        
        a: TestState.extend({
          
          initialSubstate: 'b',
          
          bar: function(sender, context) {
            this._handledAction('bar', null, sender, context);
          },
          
          actionHandlerA: function(action, sender, context) {
            this._handledAction('actionHandlerA', action, sender, context);
          }.handleActions('frozen', 'canuck'),
          
          b: TestState.extend({
            
            cat: function(sender, context) {
              this._handledAction('cat', null, sender, context);
            },
            
            actionHandlerB: function(action, sender, context) {
              this._handledAction('actionHandlerB', action, sender, context);
            }.handleActions(/apple/, /orange/)
            
          })
          
        })
        
      })
      
    });
    
    statechart1.initStatechart();
    statechart2.initStatechart();
    statechart3.initStatechart();
    statechart4.initStatechart();
  },
  
  teardown: function() {
    statechart1.destroy();
    statechart2.destroy();
    statechart3.destroy();
    statechart4.destroy();
    statechart1 = null;
    statechart2 = null;
    statechart3 = null;
    statechart4 = null;
  }
});

test("check statechart1 action handling", function() {
  var state = statechart1.get('rootState'),
      sender = SC.Object.create(),
      context = SC.Object.create();
  
  state.reset();
  statechart1.sendAction('foo', sender, context);
  equals(state.get('handler'), 'foo', 'action handler should be foo');
  equals(state.get('action'), null, 'action should be null');
  equals(state.get('sender'), sender, 'sender should be sender object');
  equals(state.get('context'), context, 'context should be context object');
  
  state.reset();
  statechart1.sendAction('plus', sender, context);
  equals(state.get('handler'), 'actionHandlerA', 'action handler should be actionHandlerA');
  equals(state.get('action'), 'plus', 'action should be plus');
  equals(state.get('sender'), sender, 'sender should be sender object');
  equals(state.get('context'), context, 'context should be context object');
  
  state.reset();
  statechart1.sendAction('divide', sender, context);
  equals(state.get('handler'), 'actionHandlerA', 'action handler should be actionHandlerA');
  equals(state.get('action'), 'divide', 'action should be divide');
  equals(state.get('sender'), sender, 'sender should be sender object');
  equals(state.get('context'), context, 'context should be context object');
  
  state.reset();
  statechart1.sendAction('num1', sender, context);
  equals(state.get('handler'), 'actionHandlerB', 'action handler should be actionHandlerB');
  equals(state.get('action'), 'num1', 'action should be num1');
  equals(state.get('sender'), sender, 'sender should be sender object');
  equals(state.get('context'), context, 'context should be context object');
  
  state.reset();
  statechart1.sendAction('bar', sender, context);
  equals(state.get('handler'), 'unknownAction', 'action handler should be unknownAction');
  equals(state.get('action'), 'bar', 'action should be bar');
  equals(state.get('sender'), sender, 'sender should be sender object');
  equals(state.get('context'), context, 'context should be context object');
});

test("check statechart2 action handling", function() {
  var state = statechart2.get('rootState'),
      sender = SC.Object.create(),
      context = SC.Object.create();
  
  state.reset();
  statechart2.sendAction('foo', sender, context);
  equals(state.get('handler'), 'foo', 'action handler should be foo');
  equals(state.get('action'), null, 'action should be null');
  equals(state.get('sender'), sender, 'sender should be sender object');
  equals(state.get('context'), context, 'context should be context object');
  
  state.reset();
  statechart2.sendAction('bar', sender, context);
  equals(state.get('handler'), null, 'action handler should be null');
  equals(state.get('action'), null, 'action should be null');
  equals(state.get('sender'), null, 'sender should be sender null');
  equals(state.get('context'), null, 'context should be context null');
});

test("check statechart3 action handling", function() {
  var state = statechart3.get('rootState');
  
  state.reset();
  statechart3.sendAction('num2');
  equals(state.get('handler'), 'actionHandlerA', 'action handler should be actionHandlerA');
  equals(state.get('action'), 'num2', 'action should be num2');
  
  state.reset();
  statechart3.sendAction('decimal');
  equals(state.get('handler'), 'actionHandlerA', 'action handler should be actionHandlerA');
  equals(state.get('action'), 'decimal', 'action should be decimal');
  
  state.reset();
  statechart3.sendAction('foo');
  equals(state.get('handler'), 'actionHandlerB', 'action handler should be actionHandlerB');
  equals(state.get('action'), 'foo', 'action should be foo');
  
  state.reset();
  statechart3.sendAction('bar');
  equals(state.get('handler'), 'actionHandlerB', 'action handler should be actionHandlerB');
  equals(state.get('action'), 'bar', 'action should be bar');
});

test("check statechart4 action handling", function() {
  var root = statechart4.get('rootState'),
      stateA = statechart4.getState('a'),
      stateB = statechart4.getState('b');
  
  root.reset(); stateA.reset(); stateB.reset();
  statechart4.sendAction('foo');
  equals(root.get('handler'), 'foo', 'root state action handler should be foo');
  equals(root.get('action'), null, 'root state action should be null');
  equals(stateA.get('handler'), null, 'state A action handler should be null');
  equals(stateA.get('action'), null, 'state A action should be null');
  equals(stateB.get('handler'), null, 'state B action handler should be null');
  equals(stateB.get('action'), null, 'state B action should be null');
  
  root.reset(); stateA.reset(); stateB.reset();
  statechart4.sendAction('yes');
  equals(root.get('handler'), 'actionHandlerRoot', 'root state action handler should be actionHandlerRoot');
  equals(root.get('action'), 'yes', 'root state action should be yes');
  equals(stateA.get('handler'), null, 'state A action handler should be null');
  equals(stateA.get('action'), null, 'state A action should be null');
  equals(stateB.get('handler'), null, 'state B action handler should be null');
  equals(stateB.get('action'), null, 'state B action should be null');
  
  root.reset(); stateA.reset(); stateB.reset();
  statechart4.sendAction('xyz');
  equals(root.get('handler'), 'unknownAction', 'root state action handler should be unknownAction');
  equals(root.get('action'), 'xyz', 'root state action should be xyz');
  equals(stateA.get('handler'), null, 'state A action handler should be null');
  equals(stateA.get('action'), null, 'state A action should be null');
  equals(stateB.get('handler'), null, 'state B action handler should be null');
  equals(stateB.get('action'), null, 'state B action should be null');
  
  root.reset(); stateA.reset(); stateB.reset();
  statechart4.sendAction('bar');
  equals(root.get('handler'), null, 'root state action handler should be null');
  equals(root.get('action'), null, 'root state action should be null');
  equals(stateA.get('handler'), 'bar', 'state A action handler should be bar');
  equals(stateA.get('action'), null, 'state A action should be null');
  equals(stateB.get('handler'), null, 'state B action handler should be null');
  equals(stateB.get('action'), null, 'state B action should be null');
  
  root.reset(); stateA.reset(); stateB.reset();
  statechart4.sendAction('canuck');
  equals(root.get('handler'), null, 'root state action handler should be null');
  equals(root.get('action'), null, 'root state action should be null');
  equals(stateA.get('handler'), 'actionHandlerA', 'state A action handler should be actionHandlerA');
  equals(stateA.get('action'), 'canuck', 'state A action should be canuck');
  equals(stateB.get('handler'), null, 'state B action handler should be null');
  equals(stateB.get('action'), null, 'state B action should be null');
  
  root.reset(); stateA.reset(); stateB.reset();
  statechart4.sendAction('cat');
  equals(root.get('handler'), null, 'root state action handler should be null');
  equals(root.get('action'), null, 'root state action should be null');
  equals(stateA.get('handler'), null, 'state A action handler should be null');
  equals(stateA.get('action'), null, 'state A action should be null');
  equals(stateB.get('handler'), 'cat', 'state B action handler should be cat');
  equals(stateB.get('action'), null, 'state B action should be null');
  
  root.reset(); stateA.reset(); stateB.reset();
  statechart4.sendAction('orange');
  equals(root.get('handler'), null, 'root state action handler should be null');
  equals(root.get('action'), null, 'root state action should be null');
  equals(stateA.get('handler'), null, 'state A action handler should be null');
  equals(stateA.get('action'), null, 'state A action should be null');
  equals(stateB.get('handler'), 'actionHandlerB', 'state B action handler should be actionHandlerB');
  equals(stateB.get('action'), 'orange', 'state B action should be orange');
});
});
minispade.register('ember-statechart/~tests/event_handling/basic/with_concurrent_states_test', function() {
// ==========================================================================
// SC.Statechart Unit Test
// ==========================================================================
/*globals SC */

var statechart = null;

// ..........................................................
// CONTENT CHANGING
// 

module("SC.Statechart: With Concurrent States - Send Event Tests", {
  setup: function() {

    statechart = SC.Statechart.create({
      
      monitorIsActive: YES,
      
      rootState: SC.State.extend({
        
        initialSubstate: 'x',
        
        x: SC.State.extend({
          
          substatesAreConcurrent: YES,
          
          a: SC.State.extend({

            initialSubstate: 'c',

            eventAInvoked: NO,

            eventA: function() { this.set('eventAInvoked', YES); },

            c: SC.State.extend({
              eventB: function() { this.gotoState('d'); },
              eventD: function() { this.gotoState('y'); }
            }),

            d: SC.State.extend({
              eventC: function() { this.gotoState('c'); }
            })

          }),

          b: SC.State.extend({

            initialSubstate: 'e',

            eventAInvoked: NO,

            eventA: function() { this.set('eventAInvoked', YES); },

            e: SC.State.extend({
              eventB: function() { this.gotoState('f'); },
              eventD: function() { this.gotoState('y'); }
            }),

            f: SC.State.extend({
              eventC: function() { this.gotoState('e'); }
            })

          })
          
        }),
        
        y: SC.State.extend()
        
      })
      
    });
    
    statechart.initStatechart();
  },
  
  teardown: function() {
    statechart.destroy();
    statechart = null;
  }
});

test("send event eventA", function() {
  var monitor = statechart.get('monitor'),
      stateA = statechart.getState('a'),
      stateB = statechart.getState('b');
      
  monitor.reset();

  equals(stateA.get('eventAInvoked'), false);
  equals(stateB.get('eventAInvoked'), false);

  statechart.sendAction('eventA');
  
  equals(monitor.get('length'), 0, 'state sequence should be of length 0');
  equals(statechart.stateIsCurrentState('c'), true, 'current state should be c');
  equals(statechart.stateIsCurrentState('e'), true, 'current state should be e');
  equals(stateA.get('eventAInvoked'), true);
  equals(stateB.get('eventAInvoked'), true);
});

test("send event eventB", function() {
  var monitor = statechart.get('monitor');
      
  monitor.reset();
  
  equals(statechart.stateIsCurrentState('c'), true, 'current state should be c');
  equals(statechart.stateIsCurrentState('e'), true, 'current state should be e');
  
  statechart.sendAction('eventB');
  
  equals(statechart.get('currentStateCount'), 2, 'current state count should be 2');
  equals(statechart.stateIsCurrentState('d'), true, 'current state should be d');
  equals(statechart.stateIsCurrentState('f'), true, 'current state should be f');
  
  equals(monitor.get('length'), 4, 'state sequence should be of length 4');
  equals(monitor.matchSequence().begin()
                  .beginConcurrent()
                    .beginSequence()
                      .exited('c')
                      .entered('d')
                    .endSequence()
                    .beginSequence()
                      .exited('e')
                      .entered('f')
                    .endSequence()
                  .endConcurrent()
                .end(), 
          true, 'sequence should be exited[c], entered[d], exited[e], entered[f]');
});

test("send event eventB then eventC", function() {
  var monitor = statechart.get('monitor');

  statechart.sendAction('eventB');
  
  equals(statechart.stateIsCurrentState('d'), true, 'current state should be d');
  equals(statechart.stateIsCurrentState('f'), true, 'current state should be f');

  monitor.reset();
  
  statechart.sendAction('eventC');

  equals(statechart.stateIsCurrentState('c'), true, 'current state should be c');
  equals(statechart.stateIsCurrentState('e'), true, 'current state should be e');

  equals(monitor.get('length'), 4, 'state sequence should be of length 4');
  equals(monitor.matchSequence().begin()
                  .beginConcurrent()
                    .beginSequence()
                      .exited('d').entered('c')
                    .endSequence()
                    .beginSequence()
                      .exited('f').entered('e')
                    .endSequence()
                  .endConcurrent()
                .end(), 
          true, 'sequence should be exited[d], entered[c], exited[f], entered[e]');
});

test("send event eventD", function() {
  var monitor = statechart.get('monitor');
      
  monitor.reset();
  
  equals(statechart.stateIsCurrentState('c'), true, 'current state should be c');
  equals(statechart.stateIsCurrentState('e'), true, 'current state should be e');
  
  statechart.sendAction('eventD');
  
  equals(monitor.get('length'), 6, 'state sequence should be of length 6');
  equals(monitor.matchSequence().begin()
                  .beginConcurrent()
                    .beginSequence()
                      .exited('c', 'a')
                    .endSequence()
                    .beginSequence()
                      .exited('e', 'b')
                    .endSequence()
                  .endConcurrent()
                  .exited('x')
                  .entered('y')
                .end(), 
          true, 'sequence should be exited[c, a, e, b, x], entered[y]');
          
  equals(statechart.get('currentStateCount'), 1, 'statechart should only have 1 current state');
  equals(statechart.stateIsCurrentState('c'), false, 'current state not should be c');
  equals(statechart.stateIsCurrentState('e'), false, 'current state not should be e');
  equals(statechart.stateIsCurrentState('y'), true, 'current state should be y');
});

test("send event eventZ", function() {
  var monitor = statechart.get('monitor');
      
  monitor.reset();
  
  equals(statechart.stateIsCurrentState('c'), true, 'current state should be c');
  equals(statechart.stateIsCurrentState('e'), true, 'current state should be e');
  
  equals(monitor.get('length'), 0, 'state sequence should be of length 0');
  
  equals(statechart.stateIsCurrentState('c'), true, 'current state should be c');
  equals(statechart.stateIsCurrentState('e'), true, 'current state should be e');
});

});
minispade.register('ember-statechart/~tests/event_handling/basic/without_concurrent_states_test', function() {
// ==========================================================================
// SC.Statechart Unit Test
// ==========================================================================
/*globals SC */

var statechart = null;

// ..........................................................
// CONTENT CHANGING
// 

module("SC.Statechart: No Concurrent States - Send Event Tests", {
  setup: function() {

    statechart = SC.Statechart.create({
      
      monitorIsActive: YES,
      
      rootState: SC.State.extend({
        
        initialSubstate: 'a',
        
        a: SC.State.extend({
        
          initialSubstate: 'c',
          
          eventB: function() {
            this.gotoState('b');
          },
          
          c: SC.State.extend({
            eventA: function() { this.gotoState('d'); }
          }),
          
          d: SC.State.extend({
            sender: null,
            context: null,
            eventC: function(sender, context) {
              this.set('sender', sender);
              this.set('context', context);
              this.gotoState('f');
            }
          })
          
        }),
        
        b: SC.State.extend({
          
          initialSubstate: 'e',
          
          e: SC.State.extend(),
          
          f: SC.State.extend()
          
        })
        
      })
      
    });
    
    statechart.initStatechart();
  },
  
  teardown: function() {
    statechart.destroy();
  }
});

test("send event eventA while in state C", function() {
  var monitor = statechart.get('monitor');
  monitor.reset();
  statechart.sendAction('eventA');
  
  equals(monitor.get('length'), 2, 'state sequence should be of length 2');
  equals(monitor.matchSequence().begin().exited('c').entered('d').end(), true, 'sequence should be exited[c], entered[d]');
  equals(statechart.stateIsCurrentState('d'), true, 'current state should be d');
});

test("send event eventB while in parent state A", function() {
  var monitor = statechart.get('monitor');
  monitor.reset();
  statechart.sendAction('eventB');
  
  equals(monitor.get('length'), 4, 'state sequence should be of length 4');
  equals(monitor.matchSequence().begin().exited('c', 'a').entered('b', 'e').end(), true, 'sequence should be exited[c, a], entered[b, e]');
  equals(statechart.stateIsCurrentState('e'), true, 'current state should be e');
});

test("send event eventC while in state D", function() {
  var monitor = statechart.get('monitor'),
      stateD = statechart.getState('d');
  
  statechart.gotoState('d');
  
  monitor.reset();
  
  statechart.sendAction('eventC', statechart, 'foobar');
  
  equals(monitor.get('length'), 4, 'state sequence should be of length 4');
  equals(monitor.matchSequence().begin().exited('d', 'a').entered('b', 'f').end(), true, 'sequence should be exited[d, a], entered[b, f]');
  equals(statechart.stateIsCurrentState('f'), true, 'current state should be f');
  equals(stateD.get('sender'), statechart);
  equals(stateD.get('context'), 'foobar');
});

test("send event eventC while in state C", function() {
  var monitor = statechart.get('monitor');
  monitor.reset();
  statechart.sendAction('eventC');
  
  equals(monitor.get('length'), 0, 'state sequence should be of length 0');
  equals(statechart.stateIsCurrentState('c'), true, 'current state should be c');
});

test("send event eventD while in state C", function() {
  var monitor = statechart.get('monitor');
  monitor.reset();
  statechart.sendAction('eventD');
  
  equals(monitor.get('length'), 0, 'state sequence should be of length 0');
  equals(statechart.stateIsCurrentState('c'), true, 'current state should be c');
});
});
minispade.register('ember-statechart/~tests/state/initial_substate_test', function() {
// ==========================================================================
// SC.State Unit Test
// ==========================================================================
/*globals SC externalState1 externalState2 */

var statechart, root, monitor, stateA, stateB, stateC, stateD, stateE, stateF;

module("SC.Statechart: State Initial Substate Tests", {
  setup: function() {

    statechart = SC.Statechart.create({
      
      monitorIsActive: YES,
      
      rootState: SC.State.extend({
        
        initialSubstate: 'a',
        
        a: SC.State.extend({
          initialSubstate: 'c',
          c: SC.State.extend(),
          d: SC.State.extend()
        }),
        
        b: SC.State.extend({
          e: SC.State.extend(),
          f: SC.State.extend()
        })
        
      })
      
    });
    
    statechart.initStatechart();
    
    root = statechart.get('rootState');
    monitor = statechart.get('monitor');
    stateA = statechart.getState('a');
    stateB = statechart.getState('b');
    stateC = statechart.getState('c');
    stateD = statechart.getState('d');
    stateE = statechart.getState('e');
    stateF = statechart.getState('f');
  },
  
  teardown: function() {
    statechart = root = stateA = stateB = stateC = stateD = stateE = stateF = null;
  }
});

test("check initial substates", function() {
  equals(root.get('initialSubstate'), stateA, "root state's initial substate should be state A");
  equals(stateA.get('initialSubstate'), stateC, "state a's initial substate should be state c");
  equals(stateC.get('initialSubstate'), null, "state c's initial substate should be null");
  equals(stateD.get('initialSubstate'), null, "state d's initial substate should be null");
  equals(stateB.get('initialSubstate') instanceof SC.EmptyState, true, "state b's initial substate should be an empty state");
  equals(stateE.get('initialSubstate'), null, "state e's initial substate should be null");
  equals(stateF.get('initialSubstate'), null, "state f's initial substate should be null");
});

test("go to state b and confirm current state is an empty state", function() {
  equals(stateC.get('isCurrentState'), true);
  monitor.reset();
  statechart.gotoState(stateB);
  ok(monitor.matchSequence().begin().exited(stateC, stateA).entered(stateB, stateB.get('initialSubstate')).end(), "state sequence should match expected");
  equals(stateB.getPath('initialSubstate.isCurrentState'), true, "state b\'s initial substate should be the current state");
});
});
minispade.register('ember-statechart/~tests/state/is_current_state_test', function() {
// ==========================================================================
// SC.Statechart Unit Test
// ==========================================================================
/*globals SC */

var statechart = null;

module("SC.Statechart: State - isCurrentState Property Tests", {
  setup: function() {

    statechart = SC.Statechart.create({
      
      monitorIsActive: YES,
      
      rootState: SC.State.extend({
        
        initialSubstate: 'a',
        
        a: SC.State.extend(),
        
        b: SC.State.extend()
        
      })
      
    });
    
    statechart.initStatechart();
  },
  
  teardown: function() {
    statechart.destroy();
    statechart = null;
  }
});

test("check observing isCurrentState", function() {
  var a = statechart.getState('a'),
      value;

  SC.addObserver(a, 'isCurrentState', function() {
    value = a.get('isCurrentState');
  });
  
  equals(a.get('isCurrentState'), true);
  
  SC.run(function() { statechart.gotoState('b'); });
  equals(a.get('isCurrentState'), false);
  equals(value, false);
  
  SC.run(function() { statechart.gotoState('a'); });
  equals(a.get('isCurrentState'), true);
  equals(value, true);
  
  SC.run(function() { statechart.gotoState('b'); });
  equals(a.get('isCurrentState'), false);
  equals(value, false);

});
});
minispade.register('ember-statechart/~tests/state/namespacing_test', function() {
// ==========================================================================
// SC Unit Test
// ==========================================================================
/*globals SC */

var statechart1, statechart2, statechart3, statechart4;

module("SC.Statechart: Namespace - Access Substate Tests", {
  setup: function() {
    
    statechart1 = SC.Statechart.create({
      
      rootState: SC.State.extend({
        initialSubstate: 'a',
        a: SC.State.extend({ value: 'state A' }),
        b: SC.State.extend({ value: 'state B' })
      })
      
    });
    
    statechart2 = SC.Statechart.create({
      
      rootState: SC.State.extend({
        initialSubstate: 'a',
        a: SC.State.extend({
          value: 'state A',
          initialSubstate: 'c',
          c: SC.State.extend({ value: 'state C' }),
          d: SC.State.extend({ value: 'state D' })
        }),
        
        b: SC.State.extend({
          value: 'state B',
          initialSubstate: 'e',
          e: SC.State.extend({ value: 'state E' }),
          f: SC.State.extend({ value: 'state F' })
        })
      })
      
    });
    
    statechart3 = SC.Statechart.create({
      
      rootState: SC.State.extend({
        initialSubstate: 'a',
        a: SC.State.extend({ value: 'state A' }),
        b: SC.State.extend({
          value: 'state B',
          initialSubstate: 'a',
          a: SC.State.extend({ value: 'state B.A' }),
          c: SC.State.extend({
            value: 'state C',
            initialSubstate: 'a',
            a: SC.State.extend({ value: 'state B.C.A' }),
            d: SC.State.extend({ value: 'state D' })
          })
        })
      })
      
    });
    
    statechart4 = SC.Statechart.create({
      
      rootState: SC.State.extend({
        initialSubstate: 'a',
        a: SC.State.extend({
          value: 'state A',
          initialSubstate: 'x',
          x: SC.State.extend({ value: 'state A.X' }),
          y: SC.State.extend({ value: 'state A.Y' })
        }),
        
        b: SC.State.extend({
          value: 'state B',
          initialSubstate: 'x',
          x: SC.State.extend({ value: 'state B.X' }),
          y: SC.State.extend({ value: 'state B.Y' })
        })
      })
      
    });
    
    statechart1.initStatechart();
    statechart2.initStatechart();
    statechart3.initStatechart();
    statechart4.initStatechart();
  },
  
  teardown: function() {
    statechart1.destroy();
    statechart2.destroy();
    statechart3.destroy();
    statechart4.destroy();
    statechart1 = statechart2 = statechart3 = statechart4 = null;
  }
});

test("access statechart1 states", function() {
  var state;
      
  state = statechart1.getState('a');
  equals(SC.none(state), false, 'state a should not be null');
  equals(state.get('value'), 'state A', 'state a should have value "state A"');
  
  state = statechart1.getState('b');
  equals(SC.none(state), false, 'state b should not be null');
  equals(state.get('value'), 'state B', 'state a should have value "state B"');
});

test("access statechart2 states", function() {
  var state;
      
  state = statechart2.getState('a');
  equals(SC.none(state), false, 'state a should not be null');
  equals(state.get('value'), 'state A', 'state a should have value "state A"');
  
  state = statechart2.getState('b');
  equals(SC.none(state), false, 'state b should not be null');
  equals(state.get('value'), 'state B', 'state b should have value "state B"');
  
  state = statechart2.getState('c');
  equals(SC.none(state), false, 'state c should not be null');
  equals(state.get('value'), 'state C', 'state c should have value "state C"');
  
  state = statechart2.getState('d');
  equals(SC.none(state), false, 'state d should not be null');
  equals(state.get('value'), 'state D', 'state d should have value "state D"');
  
  state = statechart2.getState('e');
  equals(SC.none(state), false, 'state e should not be null');
  equals(state.get('value'), 'state E', 'state d should have value "state E"');
  
  state = statechart2.getState('f');
  equals(SC.none(state), false, 'state f should not be null');
  equals(state.get('value'), 'state F', 'state d should have value "state F"');
  
  state = statechart2.getState('a.c');
  equals(SC.none(state), false, 'state a.c should not be null');
  equals(state, statechart2.getState('c'), 'state a.c should be equal to state c');
  equals(state.get('value'), 'state C', 'state a.c should have value "state C"');
  
  state = statechart2.getState('a.d');
  equals(SC.none(state), false, 'state a.d should not be null');
  equals(state, statechart2.getState('d'), 'state a.d should be equal to state d');
  equals(state.get('value'), 'state D', 'state a.d should have value "state D"');
  
  state = statechart2.getState('b.e');
  equals(SC.none(state), false, 'state b.e should not be null');
  equals(state, statechart2.getState('e'), 'state b.e should be equal to state e');
  equals(state.get('value'), 'state E', 'state b.e should have value "state E"');
  
  state = statechart2.getState('b.f');
  equals(SC.none(state), false, 'state b.f should not be null');
  equals(state, statechart2.getState('f'), 'state b.f should be equal to state f');
  equals(state.get('value'), 'state F', 'state b.f should have value "state F"');
});

test("access all A states in statechart3", function() {
  var state;
      
  state = statechart3.getState('a');
  equals(SC.none(state), false, 'state a should not be null');
  equals(state.get('value'), 'state A', 'state a should have value "state A"');
  
  state = statechart3.getState('b.a');
  equals(SC.none(state), false, 'state b.a should not be null');
  equals(state.get('value'), 'state B.A', 'state a should have value "state B.A"');
  
  state = statechart3.getState('b.c.a');
  equals(SC.none(state), false, 'state b.c.a should not be null');
  equals(state.get('value'), 'state B.C.A', 'state a should have value "state B.C.A"');
});

test("access all A states relative to state B in statechart3", function() {
  var state,
      stateB = statechart3.getState('b');
      
  state = stateB.getSubstate('a');
  equals(SC.none(state), false, 'state a should not be null');
  equals(state.get('value'), 'state B.A', 'state a should have value "state B.A"');
  
  state = stateB.getSubstate('c.a');
  equals(SC.none(state), false, 'state c.a should not be null');
  equals(state.get('value'), 'state B.C.A', 'state a should have value "state B.C.A"');
});

test("access all A states relative to state C in statechart3", function() {
  var state,
      stateC = statechart3.getState('c');
      
  state = stateC.getSubstate('a');
  equals(SC.none(state), false, 'state a should not be null');
  equals(state.get('value'), 'state B.C.A', 'state a should have value "state B.C.A"');
});

test("access all states in statechart4", function() {
  var state, 
      stateA = statechart4.getState('a'),
      stateB = statechart4.getState('b');
      
  state = statechart4.getState('a');
  equals(SC.none(state), false, 'state a should not be null');
  equals(state.get('value'), 'state A', 'state a should have value "state A"');
  
  state = statechart4.getState('a.x');
  equals(SC.none(state), false, 'state a.x should not be null');
  equals(state.get('value'), 'state A.X', 'state a should have value "state A.X"');
  
  state = statechart4.getState('a.y');
  equals(SC.none(state), false, 'state a.y should not be null');
  equals(state.get('value'), 'state A.Y', 'state a should have value "state A.Y"');
  
  state = statechart4.getState('b');
  equals(SC.none(state), false, 'state a should not be null');
  equals(state.get('value'), 'state B', 'state b should have value "state B"');
  
  state = statechart4.getState('b.x');
  equals(SC.none(state), false, 'state b.x should not be null');
  equals(state.get('value'), 'state B.X', 'state b should have value "state B.X"');
  
  state = statechart4.getState('b.y');
  equals(SC.none(state), false, 'state b.y should not be null');
  equals(state.get('value'), 'state B.Y', 'state a should have value "state B.Y"');
  
  console.log('expecting to get an error message...');
  state = statechart4.getState('x');
  equals(SC.none(state), true, 'state x should be null');
  
  console.log('expecting to get an error message...');
  state = statechart4.getState('y');
  equals(SC.none(state), true, 'state y should be null');
  
  state = stateA.getSubstate('x');
  equals(SC.none(state), false, 'state a.x should not be null');
  equals(state.get('value'), 'state A.X', 'state a should have value "state A.X"');
  
  state = stateA.getSubstate('y');
  equals(SC.none(state), false, 'state a.y should not be null');
  equals(state.get('value'), 'state A.Y', 'state a should have value "state A.Y"');
  
  state = stateB.getSubstate('x');
  equals(SC.none(state), false, 'state b.x should not be null');
  equals(state.get('value'), 'state B.X', 'state a should have value "state B.X"');
  
  state = stateB.getSubstate('y');
  equals(SC.none(state), false, 'state b.y should not be null');
  equals(state.get('value'), 'state B.Y', 'state a should have value "state B.Y"');
});
});
minispade.register('ember-statechart/~tests/state/plugin/mixin_test', function() {
// ==========================================================================
// SC.Statechart Unit Test
// ==========================================================================
/*globals SC TestState */

TestState = null;
var obj, MixinA, MixinB, stateA, stateB, stateC;

module("SC.State.plugin: Mixin Tests", {
  setup: function() {
    
    MixinA = {
      isMixinA: YES
    };
    
    MixinB = {
      isMixinB: YES
    };

    TestState = SC.State.extend({
      isTestState: YES
    });

    obj = SC.Object.create(SC.StatechartManager, {
      
      initialState: 'stateA',
      
      stateA: SC.State.plugin('TestState'),
      
      stateB: SC.State.plugin('TestState', MixinA),
      
      stateC: SC.State.plugin('TestState', MixinA, MixinB)
      
    });
    
    stateA = obj.getState('stateA');
    stateB = obj.getState('stateB');
    stateC = obj.getState('stateC');

  },
  
  teardown: function() {
    obj = TestState = MixinA = MixinB = null;
    stateA = stateB = stateC = null;
  }

});

test("check plugin state A", function() {
  ok(stateA instanceof TestState);
  ok(stateA.get('isTestState'));
  ok(!stateA.get('isMixinA'));
  ok(!stateA.get('isMixinB'));
});

test("check plugin state B", function() {
  ok(stateB instanceof TestState);
  ok(stateB.get('isTestState'));
  ok(stateB.get('isMixinA'));
  ok(!stateB.get('isMixinB'));
});

test("check plugin state C", function() {
  ok(stateC instanceof TestState);
  ok(stateC.get('isTestState'));
  ok(stateC.get('isMixinA'));
  ok(stateC.get('isMixinB'));
});
});
minispade.register('ember-statechart/~tests/state/plugin/nesting_test', function() {
// ==========================================================================
// SC.State Unit Test
// ==========================================================================
/*globals SC externalState1 externalState2 */

var statechart = null;
externalState1 = null;
externalState2 = null;

module("SC.State.plugin: Nest States Tests", {
  setup: function() {
    
    externalState1 = SC.State.extend({
      
      message: 'external state 1'
      
    });
    
    externalState2 = SC.State.extend({
      
      initialSubstate: 'd',
      
      message: 'external state 2',
      
      d: SC.State.extend(),
      
      e: SC.State.plugin('externalState1')
      
    });
    
    statechart = SC.Statechart.create({
      
      monitorIsActive: YES,
      
      rootState: SC.State.extend({
        
        initialSubstate: 'a',
        
        a: SC.State.plugin('externalState1'),
        
        b: SC.State.plugin('externalState2'),
        
        c: SC.State.extend()
        
      })
      
    });
    
    statechart.initStatechart();
  },
  
  teardown: function() {
    statechart.destroy();
    externalState1 = null;
    externalState2 = null;
  }
});

test("check statechart states", function() {
  var stateA = statechart.getState('a'),
      stateB = statechart.getState('b'),
      stateC = statechart.getState('c'),
      stateD = statechart.getState('d'),
      stateE = statechart.getState('e');

  equals(stateA instanceof externalState1, true, 'state a should be kind of externalState1');
  equals(stateB instanceof externalState2, true, 'state b should be kind of externalState2');
  equals(stateE instanceof externalState1, true, 'state e should be kind of externalState1');
  equals(stateC instanceof externalState1, false, 'state c should not be kind of externalState1');
  equals(stateD instanceof externalState1, false, 'state d should not be kind of externalState1');
  
  equals(stateA !== stateE, true, 'state a should not be equal to state e');
});

test("check statechart initialization", function() {
  var monitor = statechart.get('monitor');
  var root = statechart.get('rootState');
  
  equals(monitor.get('length'), 2, 'initial state sequence should be of length 2');
  equals(monitor.matchSequence().begin().entered(root, 'a').end(), true, 'initial sequence should be entered[ROOT, a]');
  equals(statechart.get('currentStateCount'), 1, 'current state count should be 1');
  equals(statechart.stateIsCurrentState('a'), true, 'current state should be a');
});

test("go to state e", function() {
  var monitor = statechart.get('monitor');
      
  monitor.reset();
  statechart.gotoState('e');
  
  equals(monitor.get('length'), 3, 'initial state sequence should be of length 3');
  equals(monitor.matchSequence().begin().exited('a').entered('b', 'e').end(), true, 'initial sequence should be exited[a], entered[b, e]');
  equals(statechart.get('currentStateCount'), 1, 'current state count should be 1');
  equals(statechart.stateIsCurrentState('e'), true, 'current state should be e');
});
});
minispade.register('ember-statechart/~tests/state/state_observes_test', function() {
// ==========================================================================
// SC.State Unit Test
// ==========================================================================
/*globals SC Obj1 Obj2 Obj3 */

window.Obj1 = null;
window.Obj2 = null;
window.Obj3 = null;
var statechart1, statechart2, TestState;
var stateA, stateB, stateC, stateD;

module("SC.Statechart: stateObserves Tests", {
	
  setup: function() {

    Obj1 = SC.Object.create({
      foo: 'abc'
    });
    
    Obj2 = SC.Object.create({
      bar: 'xyz'
    });
    
    Obj3 = SC.Object.create({
      mah: 123
    });
    
    TestState = SC.State.extend({
      
      notifyStateObserveHandlerInvoked: function(handler, target, key) {
        this['%@Invoked'.fmt(handler)] = {
          target: target,
          key: key
        };
      }
      
    });

    statechart1 = SC.Statechart.create({
		
		  autoInitStatechart: YES,
		  
		  initialState: 'stateA',
		
      stateA: TestState.extend({
        
        testProp: null,
        
        testProp2: Obj3,
        
        testPropChanged: function(target, key) {
          this.notifyStateObserveHandlerInvoked('testPropChanged', target, key);
        }.stateObserves('testProp'),
        
        testProp2Changed: function(target, key) {
          this.notifyStateObserveHandlerInvoked('testProp2Changed', target, key);
        }.stateObserves('.testProp2.mah'),
        
    	  fooChanged: function(target, key) {
          this.notifyStateObserveHandlerInvoked('fooChanged', target, key);
    		}.stateObserves('Obj1.foo'),
    		
    		barChanged: function(target, key) {
    		  this.notifyStateObserveHandlerInvoked('barChanged', target, key);
    		}.stateObserves('Obj2.bar')
        
      }),
      
      stateB: TestState.extend()
		
    });
    
    stateA = statechart1.getState('stateA');
    stateB = statechart1.getState('stateB');
    
    statechart2 = SC.Statechart.create({
      
      autoInitStatechart: YES,
      
      initialState: 'stateC',
      
      stateC: TestState.extend({
      
        mahChanged: function(target, key) {
          this.notifyStateObserveHandlerInvoked('mahChanged', target, key);
        }.stateObserves('Obj1.foo', 'Obj2.bar')
        
      }),
      
      stateD: TestState.extend()
      
    });
    
    stateC = statechart2.getState('stateC');
    stateD = statechart2.getState('stateD');

  },
  
  teardown: function() {
    window.Obj1 = undefined;
    window.Obj2 = undefined;
    window.Obj3 = undefined;
    statechart1 = statechart2 = null;
    stateA = stateB = stateC = stateD = null;
    TestState = null;
  }

});

test("check state observe handlers when Obj1's foo is changed", function() {
  ok(!stateA.fooChangedInvoked, "state A's fooChanged should not be invoked");
  ok(!stateA.barChangedInvoked, "state A's barChanged should not be invoked");
  ok(!stateC.mahChangedInvoked, "state C's mahChanged should not be invoked");
  ok(Obj1.hasObserverFor('foo'), "Obj1 should have observers for property foo");
  
  Obj1.set('foo', 100);
  
  ok(stateA.fooChangedInvoked, "state A's fooChanged should be invoked");
  equals(stateA.fooChangedInvoked.target, Obj1, "target should be Obj1");
  equals(stateA.fooChangedInvoked.key, 'foo', "key should be foo");
  
  ok(!stateA.barChangedInvoked, "state A's barChanged should not be invoked");
  
  ok(stateC.mahChangedInvoked, "state C's mahChanged should be invoked");
  equals(stateC.mahChangedInvoked.target, Obj1, "target should be Obj1");
  equals(stateC.mahChangedInvoked.key, 'foo', "key should be foo");
});

test("check state observe handlers when Obj2's bar is changed", function() {
  ok(!stateA.fooChangedInvoked, "state A's fooChanged should not be invoked");
  ok(!stateA.barChangedInvoked, "state A's barChanged should not be invoked");
  ok(!stateC.mahChangedInvoked, "state C's mahChanged should not be invoked");
  ok(Obj2.hasObserverFor('bar'), "Obj2 should have observers for property bar");
  
  Obj2.notifyPropertyChange('bar');
  
  ok(!stateA.fooChangedInvoked, "state A's fooChanged should not be invoked");
  
  ok(stateA.barChangedInvoked, "state A's barChanged should be invoked");
  equals(stateA.barChangedInvoked.target, Obj2, "target should be Obj2");
  equals(stateA.barChangedInvoked.key, 'bar', "key should be bar");
  
  ok(stateC.mahChangedInvoked, "state C's mahChanged should be invoked");
  equals(stateC.mahChangedInvoked.target, Obj2, "target should be Obj1");
  equals(stateC.mahChangedInvoked.key, 'bar', "key should be bar");
});

test("check state observe handlers when state A's testProp is changed", function() {
  ok(!stateA.testPropChangedInvoked, "state A's testPropChanged should not be invoked");
  ok(stateA.hasObserverFor('testProp'), "state A should have observers for property testProp");
  
  stateA.notifyPropertyChange('testProp');
  
  ok(stateA.testPropChangedInvoked, "state A's testPropChanged should be invoked");
  equals(stateA.testPropChangedInvoked.target, stateA, "target should be stateA");
  equals(stateA.testPropChangedInvoked.key, 'testProp', "key should be testProp");
});

test("check state observe handlers when state A's testProp2.mah is changed", function() {
  ok(!stateA.testProp2ChangedInvoked, "state A's testProp2Changed should not be invoked");
  ok(!stateA.hasObserverFor('testProp2'), "state A should not have observers for property testProp2");
  ok(stateA.get('testProp2').hasObserverFor('mah'), "state A's testProp2 should have observers for property mah");
  
  stateA.notifyPropertyChange('testProp2');
  
  ok(!stateA.testProp2ChangedInvoked, "state A's testProp2Changed should not be invoked");
  
  stateA.get('testProp2').notifyPropertyChange('mah');
  
  ok(stateA.testProp2ChangedInvoked, "state A's testProp2Changed should be invoked");
  equals(stateA.testProp2ChangedInvoked.target, Obj3, "target should be Obj3");
  equals(stateA.testProp2ChangedInvoked.key, 'mah', "key should be mah");
});

test("change current states and check state observe handlers when Objs' property change", function() {
  ok(!stateA.fooChangedInvoked, "state A's fooChanged should not be invoked");
  ok(!stateA.barChangedInvoked, "state A's barChanged should not be invoked");
  ok(!stateA.testPropChangedInvoked, "state A's testPropChanged should not be invoked");
  ok(!stateA.testProp2ChangedInvoked, "state A's testProp2Changed should not be invoked");
  ok(!stateC.mahChangedInvoked, "state C's mahChanged should not be invoked");
  
  statechart1.gotoState('stateB');
  statechart2.gotoState('stateD');
  
  ok(!Obj1.hasObserverFor('foo'), "Obj1 should not have observers for property foo");
  ok(!Obj2.hasObserverFor('bar'), "Obj2 should not have observers for property bar");
  ok(!stateA.hasObserverFor('testProp'), "state A should not have observers for property testProp");
  ok(!stateA.get('testProp2').hasObserverFor('mah'), "state A's testProp2 should not have observers for property mah");
  
  Obj1.notifyPropertyChange('foo');
  Obj2.notifyPropertyChange('bar');
  stateA.notifyPropertyChange('testProp');
  stateA.get('testProp2').notifyPropertyChange('mah');
  
  ok(!stateA.fooChangedInvoked, "state A's fooChanged should not be invoked");
  ok(!stateA.barChangedInvoked, "state A's barChanged should not be invoked");
  ok(!stateA.testPropChangedInvoked, "state A's testPropChanged should not be invoked");
  ok(!stateA.testProp2ChangedInvoked, "state A's testProp2Changed should not be invoked");
  ok(!stateC.mahChangedInvoked, "state C's mahChanged should not be invoked");
  
  statechart1.gotoState('stateA');
  statechart2.gotoState('stateC');
  
  ok(Obj1.hasObserverFor('foo'), "Obj1 should have observers for property foo");
  ok(Obj2.hasObserverFor('bar'), "Obj2 should have observers for property bar");
  ok(stateA.hasObserverFor('testProp'), "state A should have observers for property testProp");
  ok(stateA.get('testProp2').hasObserverFor('mah'), "state A's testProp2 should not have observers for property mah");
  
  Obj1.notifyPropertyChange('foo');
  Obj2.notifyPropertyChange('bar');
  stateA.notifyPropertyChange('testProp');
  stateA.get('testProp2').notifyPropertyChange('mah');
  
  ok(stateA.fooChangedInvoked, "state A's fooChanged should be invoked");
  ok(stateA.barChangedInvoked, "state A's barChanged should be invoked");
  ok(stateA.testPropChangedInvoked, "state A's testPropChanged should be invoked");
  ok(stateA.testProp2ChangedInvoked, "state A's testProp2Changed should be invoked");
  ok(stateC.mahChangedInvoked, "state C's mahChanged should be invoked");
});

test("destroy statecharts and check that Objs have not observers", function() {
  ok(Obj1.hasObserverFor('foo'), "Obj1 should have observers for property foo");
  ok(Obj2.hasObserverFor('bar'), "Obj2 should have observers for property bar");
  ok(stateA.hasObserverFor('testProp'), "state A should have observers for property testProp");
  ok(stateA.get('testProp2').hasObserverFor('mah'), "state A's testProp2 should have observers for property mah");
  
  statechart1.destroy();
  statechart2.destroy();
  
  ok(!Obj1.hasObserverFor('foo'), "Obj1 should not have observers for property foo");
  ok(!Obj2.hasObserverFor('bar'), "Obj2 should not have observers for property bar");
  ok(!stateA.hasObserverFor('testProp'), "state A should not have observers for property testProp");
  ok(!stateA.get('testProp2').hasObserverFor('mah'), "state A's testProp2 should not have observers for property mah");
});


});
minispade.register('ember-statechart/~tests/state_transitioning/async/core_test', function() {
// ==========================================================================
// SC.Statechart Unit Test
// ==========================================================================
/*globals SC */

var Obj, obj, async, func;

// ..........................................................
// CONTENT CHANGING
// 

module("SC.Async Tests", {
  setup: function() {
    Obj = SC.Object.extend({
      fooInvoked: NO,
      arg1: null,
      arg2: null,

      foo: function(arg1, arg2) {
        this.set('fooInvoked', YES);
        this.set('arg1', arg1);
        this.set('arg2', arg2);
      }
    });
  },
  
  teardown: function() {
    Obj = obj = async = func = null;
  }
});

test("test async - SC.Async.perform('foo')", function() {
  async = SC.Async.perform('foo');
  equals(async instanceof SC.Async, YES);
  equals(async.get('func'), 'foo');
  equals(async.get('arg1'), null);
  equals(async.get('arg2'), null);
  
  obj = Obj.create();
  async.tryToPerform(obj);
  equals(obj.get('fooInvoked'), YES);
  equals(obj.get('arg1'), null);
  equals(obj.get('arg2'), null);
});

test("test async - SC.Async.perform('foo', 'hello', 'world')", function() {  
  async = SC.Async.perform('foo', 'hello', 'world');
  equals(async.get('func'), 'foo');
  equals(async.get('arg1'), 'hello');
  equals(async.get('arg2'), 'world');
  
  obj = Obj.create();
  async.tryToPerform(obj);
  equals(obj.get('fooInvoked'), YES);
  equals(obj.get('arg1'), 'hello');
  equals(obj.get('arg2'), 'world');
});

test("test async - SC.Async.perform(function() { ... })", function() {    
  func = function() { this.foo(); };
  async = SC.Async.perform(func);
  equals(async.get('func'), func);
  equals(async.get('arg1'), null);
  equals(async.get('arg2'), null);
  
  obj = Obj.create();
  async.tryToPerform(obj);
  equals(obj.get('fooInvoked'), YES);
  equals(obj.get('arg1'), null);
  equals(obj.get('arg2'), null);
});
  
test("test async - SC.Async.perform(function() { ... }, 'aaa', 'bbb')", function() {  
  func = function(arg1, arg2) { this.foo(arg1, arg2); };
  async = SC.Async.perform(func, 'aaa', 'bbb');
  equals(async.get('func'), func);
  equals(async.get('arg1'), 'aaa');
  equals(async.get('arg2'), 'bbb');
  
  obj = Obj.create();
  async.tryToPerform(obj);
  equals(obj.get('fooInvoked'), YES);
  equals(obj.get('arg1'), 'aaa');
  equals(obj.get('arg2'), 'bbb');
});

test("test async - SC.Async.perform('bar')", function() {  
  async = SC.Async.perform('bar');
  equals(async.get('func'), 'bar');
  
  obj = Obj.create();
  async.tryToPerform(obj);
  equals(obj.get('fooInvoked'), NO);
});
});
minispade.register('ember-statechart/~tests/state_transitioning/async/with_concurrent_states_test', function() {
// ==========================================================================
// SC.Statechart Unit Test
// ==========================================================================
/*globals SC */

var statechart = null;

// ..........................................................
// CONTENT CHANGING
// 

module("SC.Statechart: With Concurrent States - Goto State Asynchronous Tests", {
  setup: function() {
    
    var StateMixin = {
      
      counter: 0,
      
      foo: function() {
        this.set('counter', this.get('counter') + 1);
        this.resumeGotoState();
      },
      
      enterState: function() {
        return this.performAsync('foo');
      },
      
      exitState: function() {
        return this.performAsync(function() { this.foo(); });
      }
    };
  
    statechart = SC.Statechart.create({
      
      monitorIsActive: YES,
      
      rootState: SC.State.extend({
        
        initialSubstate: 'a',
        
        a: SC.State.extend(),
        
        b: SC.State.extend({
          
          substatesAreConcurrent: YES,
          
          c: SC.State.extend(StateMixin),
          
          d: SC.State.extend(StateMixin)
          
        })
        
      })
      
    });
    
    statechart.initStatechart();
  },
  
  teardown: function() {
    statechart.destroy();
    statechart = null;
  }
});

test("go to state b", function() {
  var monitor = statechart.get('monitor'),
      stateA = statechart.getState('a'),
      stateC = statechart.getState('c'),
      stateD = statechart.getState('d');
  
  monitor.reset();
  
  equals(statechart.get('gotoStateActive'), NO, "statechart should not have active gotoState");
  equals(statechart.get('gotoStateSuspended'), NO, "statechart should not have active gotoState suspended");
  
  stateA.gotoState('b');
  
  equals(statechart.get('gotoStateActive'), NO, "statechart should not have active gotoState");
  equals(statechart.get('gotoStateSuspended'), NO, "statechart should not have active gotoState suspended");
  
  equals(monitor.matchSequence().begin()
                  .exited('a')
                  .entered('b')
                  .beginConcurrent()
                    .entered('c', 'd')
                  .endConcurrent()
                .end(), 
          true, 'sequence should be exited[a], entered[b, c, d]');
  equals(statechart.get('currentStateCount'), 2, 'current state count should be 2');
  equals(stateC.get('isCurrentState'), true, 'current state should be c');
  equals(stateD.get('isCurrentState'), true, 'current state should be d');
  equals(stateC.get('counter'), 1, "state c should have counter equal to 1");
  equals(stateD.get('counter'), 1, "state d should have counter equal to 1");
});

test("go to state b, then back to state a", function() {
  var monitor = statechart.get('monitor'),
      stateA = statechart.getState('a'),
      stateB = statechart.getState('b'),
      stateC = statechart.getState('c'),
      stateD = statechart.getState('d');
  
  stateA.gotoState('b');
  
  monitor.reset();
  
  stateC.gotoState('a');
  
  equals(statechart.get('gotoStateActive'), NO, "statechart should not have active gotoState");
  equals(statechart.get('gotoStateSuspended'), NO, "statechart should not have active gotoState suspended");
  
  equals(monitor.matchSequence()
                .begin()
                .exited('c', 'd', 'b')
                .entered('a')
                .end(), 
          true, 'sequence should be exited[c, d, b], entered[a]');
  equals(statechart.get('currentStateCount'), 1, 'current state count should be 1');
  equals(stateA.get('isCurrentState'), true, 'current state should not be a');
  equals(stateC.get('isCurrentState'), false, 'current state should not be c');
  equals(stateD.get('isCurrentState'), false, 'current state should not be d');
  equals(stateC.get('counter'), 2, "state c should have counter equal to 2");
  equals(stateD.get('counter'), 2, "state d should have counter equal to 2");
});
});
minispade.register('ember-statechart/~tests/state_transitioning/async/without_concurrent_states_test', function() {
// ==========================================================================
// SC.Statechart Unit Test
// ==========================================================================
/*globals SC */

var statechart = null;

// ..........................................................
// CONTENT CHANGING
// 

module("SC.Statechart: No Concurrent States - Goto State Asynchronous Tests", {
  setup: function() {
    
    var StateMixin = {
      
      counter: 0,
      
      foo: function() {
        this.set('counter', this.get('counter') + 1);
        this.resumeGotoState();
      },
      
      enterState: function() {
        return this.performAsync('foo');
      },
      
      exitState: function() {
        return this.performAsync(function() { this.foo(); });
      }
    };
  
    statechart = SC.Statechart.create({
      
      monitorIsActive: YES,
      
      rootState: SC.State.extend({
        
        initialSubstate: 'a',
        
        a: SC.State.extend(),
        
        b: SC.State.extend({
          
          methodInvoked: null,
          
          enterState: function() {
            return this.performAsync('foo');
          },
          
          exitState: function() {
            return this.performAsync('bar');
          },
          
          foo: function(arg1, arg2) {
            this.set('methodInvoked', 'foo');
          },

          bar: function(arg1, arg2) {
            this.set('methodInvoked', 'bar');
          }
          
        }),
        
        c: SC.State.extend(StateMixin, {
          
          initialSubstate: 'd',
          
          d: SC.State.extend(StateMixin, {
            
            initialSubstate: 'e',
            
            e: SC.State.extend(StateMixin)
            
          })
          
        })
        
      })
      
    });
    
    statechart.initStatechart();
  },
  
  teardown: function() {
    statechart.destroy();
  }
});

test("go to state b", function() {
  var stateB = statechart.getState('b'),
      monitor = statechart.get('monitor');
  
  monitor.reset();
  
  equals(statechart.get('gotoStateActive'), NO, "statechart should not have active gotoState");
  equals(statechart.get('gotoStateSuspended'), NO, "statechart should not have active gotoState suspended");
  
  statechart.gotoState(stateB);
  
  equals(statechart.get('gotoStateActive'), YES, "statechart should have active gotoState");
  equals(statechart.get('gotoStateSuspended'), YES, "statechart should have active gotoState suspended");
  
  statechart.resumeGotoState();
  
  equals(statechart.get('gotoStateActive'), NO, "statechart should not have active gotoState");
  equals(statechart.get('gotoStateSuspended'), NO, "statechart should not have active gotoState suspended");
  
  equals(monitor.matchSequence().begin().exited('a').entered('b').end(), true, 'sequence should be exited[a], entered[b]');
  equals(statechart.get('currentStateCount'), 1, 'current state count should be 1');
  equals(statechart.stateIsCurrentState('a'), false, 'current state should not be a');
  equals(statechart.stateIsCurrentState('b'), true, 'current state should be b');
  equals(stateB.get('methodInvoked'), 'foo', "state b should have invoked method foo");
});

test("go to state b and then back to state a", function() {
  var stateA = statechart.getState('a'),
      stateB = statechart.getState('b'),
      monitor = statechart.get('monitor');
  
  statechart.gotoState(stateB);
  statechart.resumeGotoState();
  
  monitor.reset();
  
  statechart.gotoState(stateA);
  
  equals(statechart.get('gotoStateActive'), YES, "statechart should have active gotoState");
  equals(statechart.get('gotoStateSuspended'), YES, "statechart should have active gotoState suspended");
  
  statechart.resumeGotoState();
  
  equals(statechart.get('gotoStateActive'), NO, "statechart should not have active gotoState");
  equals(statechart.get('gotoStateSuspended'), NO, "statechart should not have active gotoState suspended");
  
  equals(monitor.matchSequence().begin().exited('b').entered('a').end(), true, 'sequence should be exited[b], entered[a]');
  equals(statechart.get('currentStateCount'), 1, 'current state count should be 1');
  equals(statechart.stateIsCurrentState('a'), true, 'current state should be a');
  equals(statechart.stateIsCurrentState('b'), false, 'current state should not be b');
  equals(stateB.get('methodInvoked'), 'bar', "state b should have invoked method bar");
});

test("go to state c", function() {
  var stateC = statechart.getState('c'),
      stateD = statechart.getState('d'),
      stateE = statechart.getState('e'),
      monitor = statechart.get('monitor');
  
  monitor.reset();
  
  statechart.gotoState(stateC);
  
  equals(statechart.get('gotoStateActive'), NO, "statechart should not have active gotoState");
  equals(statechart.get('gotoStateSuspended'), NO, "statechart should not have active gotoState suspended");
  
  equals(monitor.matchSequence().begin().exited('a').entered('c', 'd', 'e').end(), true, 
        'sequence should be exited[a], entered[c, d, e]');
  equals(statechart.get('currentStateCount'), 1, 'current state count should be 1');
  equals(statechart.stateIsCurrentState('a'), false, 'current state should not be a');
  equals(statechart.stateIsCurrentState('e'), true, 'current state should be e');
  equals(stateC.get('counter'), 1, 'state c counter should be 1');
  equals(stateD.get('counter'), 1, 'state d counter should be 1');
  equals(stateE.get('counter'), 1, 'state e counter should be 1');
});

test("go to state c and then back to state a", function() {
  var stateA = statechart.getState('a'),
      stateC = statechart.getState('c'),
      stateD = statechart.getState('d'),
      stateE = statechart.getState('e'),
      monitor = statechart.get('monitor');
  
  statechart.gotoState(stateC);
  
  monitor.reset();
  
  statechart.gotoState(stateA);
  
  equals(statechart.get('gotoStateActive'), NO, "statechart should not have active gotoState");
  equals(statechart.get('gotoStateSuspended'), NO, "statechart should not have active gotoState suspended");
  
  equals(monitor.matchSequence().begin().exited('e', 'd', 'c').entered('a').end(), true, 
        'sequence should be exited[e, d, c], entered[a]');
  equals(statechart.get('currentStateCount'), 1, 'current state count should be 1');
  equals(statechart.stateIsCurrentState('a'), true, 'current state should be a');
  equals(statechart.stateIsCurrentState('e'), false, 'current state should not be e');
  equals(stateC.get('counter'), 2, 'state c counter should be 2');
  equals(stateD.get('counter'), 2, 'state d counter should be 2');
  equals(stateE.get('counter'), 2, 'state e counter should be 2');
});
});
minispade.register('ember-statechart/~tests/state_transitioning/history_state/initial_substate/core_test', function() {
// ==========================================================================
// SC.Statechart Unit Test
// ==========================================================================
/*globals SC */

var statechart, stateA, stateB, stateC;

module("SC.HistoryState Tests", {
  setup: function() {
    statechart = SC.Statechart.create({initialState: 'a', a: SC.State.extend()});
    stateA = SC.State.create({ name: 'stateA' });
    stateB = SC.State.create({ name: 'stateB' });
    stateC = SC.State.create({ name: 'stateC' });
  },
  
  teardown: function() {
    statechart = stateA = stateB = stateC = null;
  }
});

test("Check default history state", function() {
  var historyState = SC.HistoryState.create();
  
  equals(historyState.get('isRecursive'), false);
});

test("Check assigned history state", function() {  
  var historyState = SC.HistoryState.create({
    isRecursive: YES,
    statechart: statechart,
    parentState: stateA,
    defaultState: stateB
  });
  
  equals(historyState.get('statechart'), statechart);
  equals(historyState.get('parentState'), stateA);
  equals(historyState.get('defaultState'), stateB);
  equals(historyState.get('isRecursive'), true);
  equals(historyState.get('state'), stateB);
  
  stateA.set('historyState', stateC);
  
  equals(historyState.get('state'), stateC);
  
  stateA.set('historyState', null);
  
  equals(historyState.get('state'), stateB);
});
});
minispade.register('ember-statechart/~tests/state_transitioning/history_state/initial_substate/without_concurrent_states_test', function() {
// ==========================================================================
// SC.Statechart Unit Test
// ==========================================================================
/*globals SC statechart */

window.statechart = null;

// ..........................................................
// CONTENT CHANGING
// 

module("SC.HistoryState - Without Concurrent States Tests", {
  setup: function() {
   
    statechart = SC.Statechart.create({
      
      monitorIsActive: YES,
      
      rootState: SC.State.extend({
      
        initialSubstate: 'a',
        
        a: SC.State.extend({
          
          initialSubstate: SC.HistoryState.extend({
            defaultState: 'c'
          }),
          
          c: SC.State.extend({
            initialSubstate: 'g',
            
            g: SC.State.extend(),
            h: SC.State.extend()
          }),
          
          d: SC.State.extend({
            initialSubstate: 'i',
            
            i: SC.State.extend(),
            j: SC.State.extend()
          })
          
        }),
        
        b: SC.State.extend({
          
          initialSubstate: SC.HistoryState.extend({
            isRecursive: YES,
            defaultState: 'e'
          }),
          
          e: SC.State.extend({
            initialSubstate: 'k',
            
            k: SC.State.extend(),
            l: SC.State.extend()
          }),
          
          f: SC.State.extend({
            initialSubstate: 'm',
            
            m: SC.State.extend(),
            n: SC.State.extend()
          })
          
        })
      
      })
      
    });
    
    statechart.initStatechart();
    
  },  
  
  teardown: function() {
    window.statechart = null;
  }
});

test("check initial substate after statechart init", function() {
  var monitor = statechart.get('monitor'),
      root = statechart.get('rootState'),
      a = statechart.getState('a'),
      b = statechart.getState('b'),
      c = statechart.getState('c'),
      d = statechart.getState('d'),
      e = statechart.getState('e'),
      f = statechart.getState('f'),
      g = statechart.getState('g'),
      h = statechart.getState('h'),
      i = statechart.getState('i'),
      j = statechart.getState('j'),
      k = statechart.getState('k'),
      l = statechart.getState('l'),
      m = statechart.getState('m'),
      n = statechart.getState('n'),
      aInitSubstate = a.get('initialSubstate'),
      bInitSubstate = b.get('initialSubstate');
  
  equals(monitor.get('length'), 4, 'initial state sequence should be of length 4');
  equals(monitor.matchSequence().begin().entered(root, a, c, g).end(), true, 'initial sequence should be entered[root, a, c, g]');
      
  equals(root.get('initialSubstate'), a, "root state's initial substate should be state a");
  equals(c.get('initialSubstate'), g, "c state's initial substate should be state g");
  equals(d.get('initialSubstate'), i, "d state's initial substate should be state i");
  equals(e.get('initialSubstate'), k, "e state's initial substate should be state k");
  equals(f.get('initialSubstate'), m, "f state's initial substate should be state m");

  equals(aInitSubstate instanceof SC.HistoryState, true, "a state's initial substate should be of type SC.HistoryState");
  equals(aInitSubstate.get('isRecursive'), false, "a's initial substate should not be recursive");
  equals(aInitSubstate.get('defaultState'), c, "a's initial substate should have default state c");
  equals(aInitSubstate.get('statechart'), statechart, "a's initial substate should have an assigned statechart");
  equals(aInitSubstate.get('parentState'), a, "a's initial substate should have parent state a");
  equals(aInitSubstate.get('state'), c, "a's initial substate state should be state c");

  equals(bInitSubstate instanceof SC.HistoryState, true, "b state's initial substate should be of type SC.HistoryState");
  equals(bInitSubstate.get('isRecursive'), true, "b's initial substate should be recursive");
  equals(bInitSubstate.get('defaultState'), e, "b's initial substate should have default state e");
  equals(bInitSubstate.get('statechart'), statechart, "b's initial substate should have an assigned statechart");
  equals(bInitSubstate.get('parentState'), b, "b's initial substate should have parent state b");
  equals(bInitSubstate.get('state'), e, "b's initial substate state should be state e");
  
  equals(a.get('historyState'), c);
  equals(b.get('historyState'), null);
});

test("check state sequence after going to state b", function() {
  var monitor = statechart.get('monitor'),
      root = statechart.get('rootState'),
      b = statechart.getState('b'),
      e = statechart.getState('e');

  monitor.reset();
  
  statechart.gotoState('b');
  
  equals(b.get('historyState'), e);  
  equals(b.getPath('initialSubstate.state'), e);
  
  equals(monitor.get('length'), 6, 'initial state sequence should be of length 6');
  equals(monitor.matchSequence()
                  .begin()
                  .exited('g', 'c', 'a')
                  .entered('b', 'e', 'k')
                  .end(), true,
        'sequence should be exited[g, c, a], entered[b, e, k]');
});

test("check state sequence with state a's historyState assigned", function() {
  var monitor = statechart.get('monitor'),
      root = statechart.get('rootState'),
      a = statechart.getState('a'),
      b = statechart.getState('b'),
      c = statechart.getState('c'),
      d = statechart.getState('d'),
      e = statechart.getState('e'),
      f = statechart.getState('f'),
      g = statechart.getState('g'),
      h = statechart.getState('h'),
      i = statechart.getState('i'),
      j = statechart.getState('j'),
      k = statechart.getState('k'),
      l = statechart.getState('l'),
      m = statechart.getState('m'),
      n = statechart.getState('n');
  
  statechart.gotoState('j');
  
  equals(a.get('historyState'), d);
  equals(d.get('historyState'), j);
  
  equals(a.getPath('initialSubstate.state'), d);
  
  statechart.gotoState('b');
  
  monitor.reset();
  
  statechart.gotoState('a');
  
  equals(monitor.get('length'), 6, 'initial state sequence should be of length 6');
  equals(monitor.matchSequence()
                  .begin()
                  .exited(k, e, b)
                  .entered(a, d, i)
                  .end(), true,
        'sequence should be exited[k, e, b], entered[a, d, i]');
  
});

test("check state sequence with state b's historyState assigned", function() {
  var monitor = statechart.get('monitor'),
      root = statechart.get('rootState'),
      b = statechart.getState('b'),
      f = statechart.getState('f'),
      n = statechart.getState('n');
  
  statechart.gotoState('n');
  
  equals(b.get('historyState'), f);
  equals(f.get('historyState'), n);
  
  equals(b.getPath('initialSubstate.state'), f);
  
  statechart.gotoState('a');
  
  monitor.reset();
  
  statechart.gotoState('b');
  
  equals(monitor.get('length'), 6, 'initial state sequence should be of length 6');
  equals(monitor.matchSequence()
                  .begin()
                  .exited('g', 'c', 'a')
                  .entered('b', 'f', 'n')
                  .end(), true,
        'sequence should be exited[g, c, a], entered[b, f, n]');
});
});
minispade.register('ember-statechart/~tests/state_transitioning/history_state/standard/with_concurrent_states_test', function() {
// ==========================================================================
// SC Unit Test
// ==========================================================================
/*globals Ki */

var statechart = null;

// ..........................................................
// CONTENT CHANGING
// 

module("SC.Statechart: With Concurrent States - Goto History State Tests", {
  setup: function() {
    
    statechart = SC.Statechart.create({
      
      monitorIsActive: YES,
      
      rootState: SC.State.extend({
        
        initialSubstate: 'x',
        
        x: SC.State.extend({
                
          substatesAreConcurrent: YES,
          
          a: SC.State.extend({
            initialSubstate: 'c',
            c: SC.State.extend(),
            d: SC.State.extend()
          }),

          b: SC.State.extend({
            initialSubstate: 'e',
            e: SC.State.extend(),
            f: SC.State.extend()
          })
          
        }),

        z: SC.State.extend()
        
      })
      
    });
    
    statechart.initStatechart();
  },
  
  teardown: function() {
    statechart.destroy();
    statechart = null;
  }
});

test("send event eventA", function() {
  var monitor = statechart.get('monitor'),
      stateA = statechart.getState('a'),
      stateB = statechart.getState('b'),
      stateC = statechart.getState('c'),
      stateD = statechart.getState('d'),
      stateE = statechart.getState('e'),
      stateF = statechart.getState('f'),
      stateZ = statechart.getState('z');

  stateC.gotoState('d');
  stateE.gotoState('f');
  
  equals(stateA.get('historyState'), stateD, 'state a should have state d as its history state');
  equals(stateB.get('historyState'), stateF, 'state b should have state f as its history state');
  equals(stateD.get('isCurrentState'), true, 'state d should be current state');
  equals(stateF.get('isCurrentState'), true, 'state f should be current state');
  equals(stateE.get('isCurrentState'), false, 'state e should not be current state');
  
  monitor.reset();
  
  stateD.gotoState('z');
  equals(stateZ.get('isCurrentState'), true, 'state z should be current state');
  
  stateZ.gotoHistoryState('a');
  
  equals(stateA.get('historyState'), stateD, 'state a should have state d as its history state');
  equals(stateB.get('historyState'), stateE, 'state b should have state e as its history state');
  equals(stateD.get('isCurrentState'), true, 'state d should be current state');
  equals(stateF.get('isCurrentState'), false, 'state f should not be current state');
  equals(stateE.get('isCurrentState'), true, 'state e should be current state');
  
});
});
minispade.register('ember-statechart/~tests/state_transitioning/history_state/standard/without_concurrent_states/context_test', function() {
// ==========================================================================
// SC Unit Test
// ==========================================================================
/*globals SC */

var statechart,
    TestState,
    context,
    monitor,
    root,
    stateA,
    stateB,
    stateC,
    stateD,
    stateE,
    stateF;

module("SC.Statechart: Supply Context Parameter gotoHistoryState - Without Concurrent States", {
  setup: function() {
    
    TestState = SC.State.extend({
      enterStateContext: null,
      exitStateContext: null,
      
      enterState: function(context) {
        this.set('enterStateContext', context);
      },
      
      exitState: function(context) {
        this.set('exitStateContext', context);
      }
    });
    
    statechart = SC.Statechart.create({
      
      monitorIsActive: YES,
      
      rootState: TestState.extend({
        
        initialSubstate: 'a',
        
        a: TestState.extend({
          initialSubstate: 'c',
          c: TestState.extend(),
          d: TestState.extend()
        }),
        
        b: TestState.extend({
          initialSubstate: 'e',
          e: TestState.extend(),
          f: TestState.extend()
        })
      })
      
    });
    
    statechart.initStatechart();
    
    statechart.gotoState('d');
    
    context = { foo: 100 };
    
    monitor = statechart.get('monitor');
    root = statechart.get('rootState');
    stateA = statechart.getState('a');
    stateB = statechart.getState('b');
    stateC = statechart.getState('c');
    stateD = statechart.getState('d');
    stateE = statechart.getState('e');
    stateF = statechart.getState('f');
  },
  
  teardown: function() {
    statechart = TestState = monitor = context = null;
    root = stateA = stateB = stateC = stateD = stateE = stateF;
  }
});

test("check statechart initialization", function() {
  equals(root.get('enterStateContext'), null);
  equals(stateA.get('enterStateContext'), null);
  equals(stateD.get('enterStateContext'), null);
});

test("pass no context when going to state a's history state using statechart", function() {  
  statechart.gotoState('f');
  statechart.gotoHistoryState('a');
  equals(stateD.get('isCurrentState'), true);
  equals(stateD.get('enterStateContext'), null);
  equals(stateA.get('enterStateContext'), null);
  equals(stateB.get('exitStateContext'), null);
  equals(stateF.get('exitStateContext'), null);
});

test("pass no context when going to state a's history state using state", function() {  
  stateD.gotoState('f');
  stateF.gotoHistoryState('a');
  equals(stateD.get('isCurrentState'), true);
  equals(stateD.get('enterStateContext'), null);
  equals(stateA.get('enterStateContext'), null);
  equals(stateB.get('exitStateContext'), null);
  equals(stateF.get('exitStateContext'), null);
});

test("pass context when going to state a's history state using statechart - gotoHistoryState('f', context)", function() {  
  statechart.gotoState('f');
  statechart.gotoHistoryState('a', context);
  equals(stateD.get('isCurrentState'), true);
  equals(stateD.get('enterStateContext'), context, 'state d should have context upon entering');
  equals(stateA.get('enterStateContext'), context, 'state a should have context upon entering');
  equals(stateB.get('exitStateContext'), context, 'state b should have context upon exiting');
  equals(stateF.get('exitStateContext'), context, 'state f should have context upon exiting');
});

test("pass context when going to state a's history state using state - gotoHistoryState('f', context)", function() {  
  statechart.gotoState('f');
  stateF.gotoHistoryState('a', context);
  equals(stateD.get('isCurrentState'), true);
  equals(stateD.get('enterStateContext'), context, 'state d should have context upon entering');
  equals(stateA.get('enterStateContext'), context, 'state a should have context upon entering');
  equals(stateB.get('exitStateContext'), context, 'state b should have context upon exiting');
  equals(stateF.get('exitStateContext'), context, 'state f should have context upon exiting');
});

test("pass context when going to state a's history state using statechart - gotoHistoryState('f', stateF, context)", function() {  
  statechart.gotoState('f');
  statechart.gotoHistoryState('a', stateF, context);
  equals(stateD.get('isCurrentState'), true);
  equals(stateD.get('enterStateContext'), context, 'state d should have context upon entering');
  equals(stateA.get('enterStateContext'), context, 'state a should have context upon entering');
  equals(stateB.get('exitStateContext'), context, 'state b should have context upon exiting');
  equals(stateF.get('exitStateContext'), context, 'state f should have context upon exiting');
});

test("pass context when going to state a's history state using statechart - gotoHistoryState('f', true, context)", function() {  
  statechart.gotoState('f');
  statechart.gotoHistoryState('a', true, context);
  equals(stateD.get('isCurrentState'), true);
  equals(stateD.get('enterStateContext'), context, 'state d should have context upon entering');
  equals(stateA.get('enterStateContext'), context, 'state a should have context upon entering');
  equals(stateB.get('exitStateContext'), context, 'state b should have context upon exiting');
  equals(stateF.get('exitStateContext'), context, 'state f should have context upon exiting');
});

test("pass context when going to state a's history state using statechart - gotoHistoryState('f', stateF, true, context)", function() {  
  statechart.gotoState('f');
  statechart.gotoHistoryState('a', stateF, true, context);
  equals(stateD.get('isCurrentState'), true);
  equals(stateD.get('enterStateContext'), context, 'state d should have context upon entering');
  equals(stateA.get('enterStateContext'), context, 'state a should have context upon entering');
  equals(stateB.get('exitStateContext'), context, 'state b should have context upon exiting');
  equals(stateF.get('exitStateContext'), context, 'state f should have context upon exiting');
});

test("pass context when going to state a's history state using state - gotoHistoryState('f', true, context)", function() {  
  statechart.gotoState('f');
  stateF.gotoHistoryState('a', true, context);
  equals(stateD.get('isCurrentState'), true);
  equals(stateD.get('enterStateContext'), context, 'state d should have context upon entering');
  equals(stateA.get('enterStateContext'), context, 'state a should have context upon entering');
  equals(stateB.get('exitStateContext'), context, 'state b should have context upon exiting');
  equals(stateF.get('exitStateContext'), context, 'state f should have context upon exiting');
});

// 
// test("pass context when going to state f using state - gotoState('f', context)", function() {  
//   stateC.gotoState('f', context);
//   equals(stateF.get('isCurrentState'), true);
//   equals(stateC.get('exitStateContext'), context, 'state c should have context upon exiting');
//   equals(stateA.get('exitStateContext'), context, 'state a should have context upon exiting');
//   equals(stateB.get('enterStateContext'), context, 'state b should have context upon entering');
//   equals(stateF.get('enterStateContext'), context, 'state f should have context upon entering');
// });
// 
// test("pass context when going to state f using statechart - gotoState('f', stateC, context) ", function() {  
//   statechart.gotoState('f', stateC, context);
//   equals(stateF.get('isCurrentState'), true);
//   equals(stateC.get('exitStateContext'), context, 'state c should have context upon exiting');
//   equals(stateA.get('exitStateContext'), context, 'state a should have context upon exiting');
//   equals(stateB.get('enterStateContext'), context, 'state b should have context upon entering');
//   equals(stateF.get('enterStateContext'), context, 'state f should have context upon entering');
// });
// 
// test("pass context when going to state f using statechart - gotoState('f', stateC, false, context) ", function() {  
//   statechart.gotoState('f', stateC, false, context);
//   equals(stateF.get('isCurrentState'), true);
//   equals(stateC.get('exitStateContext'), context, 'state c should have context upon exiting');
//   equals(stateA.get('exitStateContext'), context, 'state a should have context upon exiting');
//   equals(stateB.get('enterStateContext'), context, 'state b should have context upon entering');
//   equals(stateF.get('enterStateContext'), context, 'state f should have context upon entering');
// });
});
minispade.register('ember-statechart/~tests/state_transitioning/history_state/standard/without_concurrent_states/core_test', function() {
// ==========================================================================
// SC.Statechart Unit Test
// ==========================================================================
/*globals SC */

var statechart = null;

// ..........................................................
// CONTENT CHANGING
// 

module("SC.Statechart: No Concurrent States - Goto History State Tests", {
  setup: function() {

    statechart = SC.Statechart.create({
      
      monitorIsActive: YES,
      
      rootState: SC.State.extend({
        
        initialSubstate: 'a',
        
        a: SC.State.extend({
        
          initialSubstate: 'c',
          
          c: SC.State.extend({
            initialSubstate: 'g',
            g: SC.State.extend(),
            h: SC.State.extend()
          }),
          
          d: SC.State.extend({
            initialSubstate: 'i',
            i: SC.State.extend(),
            j: SC.State.extend()
          })
          
        }),
        
        b: SC.State.extend({
          
          initialSubstate: 'e',
          
          e: SC.State.extend({
            initialSubstate: 'k',
            k: SC.State.extend(),
            l: SC.State.extend()
          }),
          
          f: SC.State.extend({
            initialSubstate: 'm',
            m: SC.State.extend(),
            n: SC.State.extend()
          })
          
        })
        
      })
      
    });
    
    statechart.initStatechart();
  },
  
  teardown: function() {
    statechart.destroy();
  }
});

test("check initial statechart history states", function() {
  equals(statechart.get('rootState').get('historyState'), statechart.getState('a'), 'root state\'s history state should be state a');
  
  equals(statechart.getState('a').get('historyState'), statechart.getState('c'), 'state a\'s history state should be state c');
  equals(statechart.getState('c').get('historyState'), statechart.getState('g'), 'state c\'s history state should be state g');
  equals(statechart.getState('g').get('historyState'), null, 'state g\'s history state should be null');
  
  equals(statechart.getState('h').get('historyState'), null, 'state h\'s history state should be null');
  equals(statechart.getState('d').get('historyState'), null, 'state d\'s history state should be null');

  equals(statechart.getState('b').get('historyState'), null, 'state b\'s history state should be null');
  equals(statechart.getState('e').get('historyState'), null, 'state e\'s history state should be null');
  equals(statechart.getState('f').get('historyState'), null, 'state f\'s history state should be null');
});

test("go to state h and check history states", function() {
  var monitor = statechart.get('monitor');
  monitor.reset();
  
  statechart.gotoState('h');
  equals(monitor.matchSequence().begin().exited('g').entered('h').end(), true, 'sequence should be exited[f], entered[h]');
  
  equals(statechart.getState('a').get('historyState'), statechart.getState('c'), 'state a\'s history state should be state c');
  equals(statechart.getState('c').get('historyState'), statechart.getState('h'), 'state c\'s history state should be state h');
  equals(statechart.getState('h').get('historyState'), null, 'state h\'s history state should be null');
  equals(statechart.getState('g').get('historyState'), null, 'state g\'s history state should be null');
  
  equals(statechart.getState('d').get('historyState'), null, 'state d\'s history state should be null');
  equals(statechart.getState('b').get('historyState'), null, 'state b\'s history state should be null');
});

test("go to state d and check history states", function() {
  var monitor = statechart.get('monitor');
  monitor.reset();
  
  statechart.gotoState('d');
  equals(monitor.matchSequence().begin().exited('g', 'c').entered('d', 'i').end(), true, 'sequence should be exited[g, c], entered[d, i]');
  
  equals(statechart.getState('a').get('historyState'), statechart.getState('d'), 'state a\'s history state should be state d');
  equals(statechart.getState('d').get('historyState'), statechart.getState('i'), 'state d\'s history state should be state i');
  equals(statechart.getState('c').get('historyState'), statechart.getState('g'), 'state c\'s history state should be state g');
  equals(statechart.getState('h').get('historyState'), null, 'state h\'s history state should be null');
  equals(statechart.getState('g').get('historyState'), null, 'state g\'s history state should be null');
  equals(statechart.getState('i').get('historyState'), null, 'state i\'s history state should be null');
  equals(statechart.getState('j').get('historyState'), null, 'state j\'s history state should be null');
  
  equals(statechart.getState('b').get('historyState'), null, 'state b\'s history state should be null');
});

test("go to state b and check history states", function() {
  var monitor = statechart.get('monitor');
  monitor.reset();
  
  statechart.gotoState('b');
  equals(monitor.matchSequence().begin().exited('g', 'c', 'a').entered('b', 'e', 'k').end(), true, 'sequence should be exited[g, c, a], entered[b, e, k]');
  
  equals(statechart.get('rootState').get('historyState'), statechart.getState('b'), 'root state\'s history state should be state b');
  equals(statechart.getState('b').get('historyState'), statechart.getState('e'), 'state b\'s history state should be e');
  equals(statechart.getState('e').get('historyState'), statechart.getState('k'), 'state e\'s history state should be k');
  equals(statechart.getState('a').get('historyState'), statechart.getState('c'), 'state a\'s history state should be state c');
  equals(statechart.getState('c').get('historyState'), statechart.getState('g'), 'state c\'s history state should be state g');
});

test("go to state j, then state m, then go to state a's history state (non-recursive)", function() {
  var monitor = statechart.get('monitor');
  
  statechart.gotoState('j');
  statechart.gotoState('m');

  monitor.reset();
  statechart.gotoHistoryState('a');
  
  equals(monitor.get('length'), 6, 'initial state sequence should be of length 6');
  equals(monitor.matchSequence().begin().exited('m', 'f', 'b').entered('a', 'd', 'i').end(), true, 'sequence should be exited[m, f, b], entered[a, d, i]');
  equals(statechart.get('currentStateCount'), 1, 'current state count should be 1');
  equals(statechart.stateIsCurrentState('i'), true, 'current state should be i');
  equals(statechart.get('rootState').get('historyState'), statechart.getState('a'), 'root state\'s history state should be state a');
  equals(statechart.getState('a').get('historyState'), statechart.getState('d'), 'state a\'s history state should be state d');
  equals(statechart.getState('d').get('historyState'), statechart.getState('i'), 'state d\'s history state should be state i');
  
});

test("go to state j, then state m, then go to state a's history state (recursive)", function() {
  var monitor = statechart.get('monitor');
  
  statechart.gotoState('j');
  statechart.gotoState('m');

  monitor.reset();
  statechart.gotoHistoryState('a', null, YES);
  
  equals(monitor.get('length'), 6, 'initial state sequence should be of length 6');
  equals(monitor.matchSequence().begin().exited('m', 'f', 'b').entered('a', 'd', 'j').end(), true, 'sequence should be exited[m, f, b], entered[a, d, j]');
  equals(statechart.get('currentStateCount'), 1, 'current state count should be 1');
  equals(statechart.stateIsCurrentState('j'), true, 'current state should be j');
  equals(statechart.get('rootState').get('historyState'), statechart.getState('a'), 'root state\'s history state should be state a');
  equals(statechart.getState('a').get('historyState'), statechart.getState('d'), 'state a\'s history state should be state d');
  equals(statechart.getState('d').get('historyState'), statechart.getState('j'), 'state d\'s history state should be state j');
});


test("go to state b's history state (non-recursive)", function() {
  var monitor = statechart.get('monitor');
  monitor.reset();

  statechart.gotoHistoryState('b');
  
  equals(monitor.get('length'), 6, 'initial state sequence should be of length 6');
  equals(monitor.matchSequence().begin().exited('g', 'c', 'a').entered('b', 'e', 'k').end(), true, 'sequence should be exited[g, c, a], entered[b, e, k]');
  equals(statechart.get('currentStateCount'), 1, 'current state count should be 1');
  equals(statechart.stateIsCurrentState('k'), true, 'current state should be k');
  equals(statechart.get('rootState').get('historyState'), statechart.getState('b'), 'root state\'s history state should be state b');
  equals(statechart.getState('b').get('historyState'), statechart.getState('e'), 'state b\'s history state should be state e');
  equals(statechart.getState('e').get('historyState'), statechart.getState('k'), 'state e\'s history state should be state k');
});

test("go to state b's history state (recursive)", function() {
  var monitor = statechart.get('monitor');
  monitor.reset();

  statechart.gotoHistoryState('b', null, YES);
  
  equals(monitor.get('length'), 6, 'initial state sequence should be of length 6');
  equals(monitor.matchSequence().begin().exited('g', 'c', 'a').entered('b', 'e', 'k').end(), true, 'sequence should be exited[g, c, a], entered[b, e, k]');
  equals(statechart.get('currentStateCount'), 1, 'current state count should be 1');
  equals(statechart.stateIsCurrentState('k'), true, 'current state should be k');
  equals(statechart.get('rootState').get('historyState'), statechart.getState('b'), 'root state\'s history state should be state b');
  equals(statechart.getState('b').get('historyState'), statechart.getState('e'), 'state b\'s history state should be state e');
  equals(statechart.getState('e').get('historyState'), statechart.getState('k'), 'state e\'s history state should be state k');
});
});
minispade.register('ember-statechart/~tests/state_transitioning/standard/with_concurrent_states/advanced_test', function() {
// ==========================================================================
// SC.State Unit Test
// ==========================================================================
/*globals SC */

var statechart = null;
var monitor, root, stateA, stateB, stateC, stateD, stateE, stateF, stateG;
var stateH, stateI, stateJ, stateK, stateL, stateM, stateN, stateO, stateP;
var stateQ, stateR, stateS, stateZ;

// ..........................................................
// CONTENT CHANGING
// 

module("SC.Statechart: With Concurrent States - Goto State Advanced Tests", {
  setup: function() {
    
    statechart = SC.Statechart.create({
      
      monitorIsActive: YES,
      
      rootState: SC.State.extend({
        
        initialSubstate: 'a',

        a: SC.State.extend({
          substatesAreConcurrent: YES,
          
          b: SC.State.extend({
            initialSubstate: 'd',
            d: SC.State.extend(),
            e: SC.State.extend()
          }),
          
          c: SC.State.extend({
            
            initialSubstate: 'f',
            
            f: SC.State.extend({
              substatesAreConcurrent: YES,

              h: SC.State.extend({
                initialSubstate: 'l',
                l: SC.State.extend(),
                m: SC.State.extend()
              }),
              
              i: SC.State.extend({
                initialSubstate: 'n',
                n: SC.State.extend(),
                o: SC.State.extend()
              })
            }),
            
            g: SC.State.extend({
              substatesAreConcurrent: YES,

              j: SC.State.extend({
                initialSubstate: 'p',
                p: SC.State.extend(),
                q: SC.State.extend()
              }),
              
              k: SC.State.extend({
                initialSubstate: 'r',
                r: SC.State.extend(),
                s: SC.State.extend()
              })
            })
          
          })
        }),

        z: SC.State.extend()
      })
      
    });
    
    statechart.initStatechart();
    
    monitor = statechart.get('monitor');
    root = statechart.get('rootState');
    stateA = statechart.getState('a');
    stateB = statechart.getState('b');
    stateC = statechart.getState('c');
    stateD = statechart.getState('d');
    stateE = statechart.getState('e');
    stateF = statechart.getState('f');
    stateG = statechart.getState('g');
    stateH = statechart.getState('h');
    stateI = statechart.getState('i');
    stateJ = statechart.getState('j');
    stateK = statechart.getState('k');
    stateL = statechart.getState('l');
    stateM = statechart.getState('m');
    stateN = statechart.getState('n');
    stateO = statechart.getState('o');
    stateP = statechart.getState('p');
    stateQ = statechart.getState('q');
    stateR = statechart.getState('r');
    stateS = statechart.getState('s');
    stateZ = statechart.getState('z');
  },
  
  teardown: function() {
    statechart.destroy();
    monitor = root = stateA = stateB = stateC = stateD = stateE = stateF = stateG = null;
    stateH = stateI = stateJ = stateK = stateL = stateM = stateN = stateO = stateP = null;
    stateQ = stateR = stateS = stateZ = null;
  }
});

test("check statechart initialization", function() {
  equals(monitor.get('length'), 10, 'initial state sequence should be of length 10');
  equals(monitor.matchSequence().begin()
                                  .entered(root, 'a')
                                  .beginConcurrent()
                                    .beginSequence()
                                      .entered('b', 'd')
                                    .endSequence()
                                    .beginSequence()
                                      .entered('c', 'f')
                                      .beginConcurrent()
                                        .beginSequence()
                                          .entered('h', 'l')
                                        .endSequence()
                                        .beginSequence()
                                          .entered('i', 'n')
                                        .endSequence()
                                      .endConcurrent()
                                    .endSequence()
                                  .endConcurrent()
                                  .entered()
                                .end(), 
    true, 'initial sequence should be entered[ROOT, a, b, d, c, f, h, l, i, n]');
  
  equals(statechart.get('currentStateCount'), 3, 'current state count should be 3');
  equals(statechart.stateIsCurrentState('d'), true, 'current state should be d');
  equals(statechart.stateIsCurrentState('l'), true, 'current state should be l');
  equals(statechart.stateIsCurrentState('n'), true, 'current state should be n');
  
  equals(statechart.stateIsCurrentState('h'), false, 'current state should not be h');
  equals(statechart.stateIsCurrentState('i'), false, 'current state should not be i');
  equals(statechart.stateIsCurrentState('p'), false, 'current state should not be p');
  equals(statechart.stateIsCurrentState('q'), false, 'current state should not be q');
  equals(statechart.stateIsCurrentState('r'), false, 'current state should not be r');
  equals(statechart.stateIsCurrentState('s'), false, 'current state should not be s');
  
  equals(stateA.getPath('currentSubstates.length'), 3, 'state a should have 3 current substates');
  equals(stateA.stateIsCurrentSubstate('d'), true, 'state a\'s current substate should be state d');
  equals(stateA.stateIsCurrentSubstate('l'), true, 'state a\'s current substate should be state l');
  equals(stateA.stateIsCurrentSubstate('n'), true, 'state a\'s current substate should be state n');
  
  equals(stateC.getPath('currentSubstates.length'), 2, 'state a should have 2 current substates');
  equals(stateC.stateIsCurrentSubstate('l'), true, 'state c\'s current substate should be state l');
  equals(stateC.stateIsCurrentSubstate('n'), true, 'state c\'s current substate should be state n');
  
  equals(stateF.getPath('currentSubstates.length'), 2, 'state f should have 2 current substates');
  equals(stateF.stateIsCurrentSubstate('l'), true, 'state f\'s current substate should be state l');
  equals(stateF.stateIsCurrentSubstate('n'), true, 'state f\'s current substate should be state n');
  
  equals(stateG.getPath('currentSubstates.length'), 0, 'state g should have no current substates');  
  
  ok(monitor.matchEnteredStates(root, 'a', 'b', 'd', 'c', 'f', 'h', 'i', 'l', 'n'), 'states root, A, B, C, D, F, H, I, L and N should all be entered');
});

test("from state l, go to state g", function() {
  monitor.reset();
  stateL.gotoState('g');
  
  equals(monitor.get('length'), 10, 'initial state sequence should be of length 10');
  equals(monitor.matchSequence().begin()
                  .beginConcurrent()
                    .beginSequence()
                      .exited('l', 'h')
                    .endSequence()
                    .beginSequence()
                      .exited('n', 'i')
                    .endSequence()
                  .endConcurrent()
                  .exited('f')
                  .entered('g')
                  .beginConcurrent()
                    .beginSequence()
                      .entered('j', 'p')
                    .endSequence()
                    .beginSequence()
                      .entered('k', 'r')
                    .endSequence()
                  .endConcurrent()
                .end(), 
         true, 'initial sequence should be exited[l, h, n, i, f], entered[g, j, p, k, r]');
  
  equals(statechart.get('currentStateCount'), 3, 'current state count should be 3');
  equals(statechart.stateIsCurrentState('d'), true, 'current state should be d');
  equals(statechart.stateIsCurrentState('l'), false, 'current state should not be l');
  equals(statechart.stateIsCurrentState('n'), false, 'current state should not be n');
  equals(statechart.stateIsCurrentState('p'), true, 'current state should be p');
  equals(statechart.stateIsCurrentState('r'), true, 'current state should be r');
  
  equals(stateA.getPath('currentSubstates.length'), 3, 'state a should have 3 current substates');
  equals(stateA.stateIsCurrentSubstate('d'), true, 'state a\'s current substate should be state d');
  equals(stateA.stateIsCurrentSubstate('p'), true, 'state a\'s current substate should be state p');
  equals(stateA.stateIsCurrentSubstate('r'), true, 'state a\'s current substate should be state r');
  
  equals(stateC.getPath('currentSubstates.length'), 2, 'state a should have 2 current substates');
  equals(stateC.stateIsCurrentSubstate('p'), true, 'state c\'s current substate should be state p');
  equals(stateC.stateIsCurrentSubstate('r'), true, 'state c\'s current substate should be state r');
  
  equals(stateF.getPath('currentSubstates.length'), 0, 'state f should have no current substates');
  
  equals(stateG.getPath('currentSubstates.length'), 2, 'state g should have 2 current substates');
  equals(stateG.stateIsCurrentSubstate('p'), true, 'state g\'s current substate should be state p');
  equals(stateG.stateIsCurrentSubstate('r'), true, 'state g\'s current substate should be state r');
  
  ok(monitor.matchEnteredStates(root, 'a', 'b', 'd', 'c', 'g', 'j', 'k', 'p', 'r'), 'states root, A, B, C, D, G, J, K, P and R should all be entered');
});

test('from state l, go to state z', function() {
  monitor.reset();
  stateL.gotoState('z');
  
  equals(monitor.get('length'), 10, 'initial state sequence should be of length 10');
  equals(monitor.matchSequence()
                .begin()
                .exited('l', 'h', 'n', 'i', 'f', 'c', 'd', 'b', 'a')
                .entered('z')
                .end(), 
         true, 'sequence should be exited[l, h, n, i, f, c, d, b, a], entered[z]');
         
   equals(statechart.get('currentStateCount'), 1, 'current state count should be 1');
   equals(statechart.stateIsCurrentState('z'), true, 'current state should be z');
   equals(statechart.stateIsCurrentState('l'), false, 'current state should not be l');
   equals(statechart.stateIsCurrentState('n'), false, 'current state should not be n');
   equals(statechart.stateIsCurrentState('d'), false, 'current state should not be d');
   
   equals(stateA.getPath('currentSubstates.length'), 0, 'state a should have no current substates');
   equals(stateB.getPath('currentSubstates.length'), 0, 'state b should have no current substates');
   equals(stateC.getPath('currentSubstates.length'), 0, 'state c should have no current substates');
   equals(stateF.getPath('currentSubstates.length'), 0, 'state f should have no current substates');
   equals(stateG.getPath('currentSubstates.length'), 0, 'state g should have no current substates');
   
   ok(monitor.matchEnteredStates(root, 'z'), 'states root and Z should all be entered');
});

test('from state l, go to state z, and then go to state s', function() {
  stateL.gotoState('z');
  
  monitor.reset();
  stateZ.gotoState('s');
  
  equals(monitor.get('length'), 10, 'initial state sequence should be of length 10');
  equals(monitor.matchSequence()
                .begin()
                .exited('z')
                .entered('a', 'c', 'g', 'k', 's', 'j', 'p', 'b', 'd')
                .end(), 
         true, 'sequence should be exited[z], entered[a, c, g, k, s, j, p, b, d]');
         
   equals(statechart.get('currentStateCount'), 3, 'current state count should be 1');
   equals(statechart.stateIsCurrentState('z'), false, 'current state should not be z');
   equals(statechart.stateIsCurrentState('s'), true, 'current state should be s');
   equals(statechart.stateIsCurrentState('p'), true, 'current state should be p');
   equals(statechart.stateIsCurrentState('d'), true, 'current state should be d');
   
   equals(stateA.getPath('currentSubstates.length'), 3, 'state a should have 3 current substates');
   equals(stateB.getPath('currentSubstates.length'), 1, 'state b should have 1 current substates');
   equals(stateC.getPath('currentSubstates.length'), 2, 'state c should have 2 current substates');
   equals(stateF.getPath('currentSubstates.length'), 0, 'state f should have no current substates');
   equals(stateG.getPath('currentSubstates.length'), 2, 'state g should have 2 current substates');
   
   ok(monitor.matchEnteredStates(root, 'a', 'b', 'd', 'c', 'g', 'j', 'k', 'p', 's'), 'states root, A, B, C, D, G, J, K, P and S should all be entered');
});
});
minispade.register('ember-statechart/~tests/state_transitioning/standard/with_concurrent_states/basic_test', function() {
// ==========================================================================
// SC Unit Test
// ==========================================================================
/*globals SC */

var statechart = null;
var monitor, root, stateA, stateB, stateC, stateD, stateE, stateF;

module("SC.Statechart: With Concurrent States - Goto State Basic Tests", {
  setup: function() {
    
    statechart = SC.Statechart.create({
      
      monitorIsActive: YES,
      
      rootState: SC.State.extend({
        
        substatesAreConcurrent: YES,

        a: SC.State.extend({
          initialSubstate: 'c',
          c: SC.State.extend(),
          d: SC.State.extend()
        }),

        b: SC.State.extend({
          initialSubstate: 'e',
          e: SC.State.extend(),
          f: SC.State.extend()
        })
      })
      
    });
    
    statechart.initStatechart();
    
    monitor = statechart.get('monitor');
    root = statechart.get('rootState');
    stateA = statechart.getState('a');
    stateB = statechart.getState('b');
    stateC = statechart.getState('c');
    stateD = statechart.getState('d');
    stateE = statechart.getState('e');
    stateF = statechart.getState('f');
  },
  
  teardown: function() {
    statechart.destroy();
    statechart = monitor = root = stateA = stateB = stateC = stateD = stateE = stateF = null;
  }
});

test("check statechart initialization", function() {
  equals(monitor.get('length'), 5, 'initial state sequence should be of length 5');
  equals(monitor.matchSequence().begin()
                                  .entered(root)
                                  .beginConcurrent()
                                    .beginSequence()
                                      .entered('a', 'c')
                                    .endSequence()
                                    .beginSequence()
                                      .entered('b', 'e')
                                    .endSequence()
                                  .endConcurrent()
                                .end(), 
    true, 'initial sequence should be entered[ROOT, a, c, b, e]');
  equals(monitor.matchSequence().begin()
                                  .entered(root)
                                  .beginConcurrent()
                                    .entered('a', 'b')
                                  .endConcurrent()
                                  .beginConcurrent()
                                    .entered('c', 'e')
                                  .endConcurrent()
                                .end(), 
    false, 'initial sequence should not be entered[ROOT, a, b, c, e]');
  
  equals(statechart.get('currentStateCount'), 2, 'current state count should be 2');
  
  equals(statechart.stateIsCurrentState('c'), true, 'current state should be c');
  equals(statechart.stateIsCurrentState('e'), true, 'current state should be e');
  equals(statechart.stateIsCurrentState('d'), false, 'current state should not be d');
  equals(statechart.stateIsCurrentState('f'), false, 'current state should not be f');
  
  equals(stateA.stateIsCurrentSubstate('c'), true, 'state a\'s current substate should be state c');
  equals(stateA.stateIsCurrentSubstate('d'), false, 'state a\'s current substate should not be state d');
  equals(stateB.stateIsCurrentSubstate('e'), true, 'state a\'s current substate should be state e');
  equals(stateB.stateIsCurrentSubstate('f'), false, 'state a\'s current substate should not be state f');
  
  equals(stateA.get('isCurrentState'), false, 'state a should not be current state');
  equals(stateB.get('isCurrentState'), false, 'state b should not be current state');
  equals(stateC.get('isCurrentState'), true, 'state c should be current state');
  equals(stateD.get('isCurrentState'), false, 'state d should not be current state');
  equals(stateE.get('isCurrentState'), true, 'state e should be current state');
  equals(stateF.get('isCurrentState'), false, 'state f should not be current state');
  
  ok(monitor.matchEnteredStates(root, 'a', 'c', 'b', 'e'), 'states root, A, C, B and E should all be entered');
});

test("from state c, go to state d, and from state e, go to state f", function() {
  monitor.reset();
  
  stateC.gotoState('d');
  equals(monitor.get('length'), 2, 'state sequence should be of length 2');
  equals(monitor.matchSequence().begin().exited('c').entered('d').end(), true, 'sequence should be exited[c], enterd[d]');
  
  monitor.reset();
  
  stateE.gotoState('f');
  equals(monitor.get('length'), 2, 'state sequence should be of length 2');
  equals(monitor.matchSequence().begin().exited('e').entered('f').end(), true, 'sequence should be exited[e], enterd[f]');
  
  equals(statechart.get('currentStateCount'), 2, 'current state count should be 2');
  
  equals(statechart.stateIsCurrentState('d'), true, 'current state should be d');
  equals(statechart.stateIsCurrentState('f'), true, 'current state should be f');
  
  equals(stateA.stateIsCurrentSubstate('c'), false, 'state a\'s current substate should not be state c');
  equals(stateA.stateIsCurrentSubstate('d'), true, 'state a\'s current substate should be state d');
  equals(stateB.stateIsCurrentSubstate('e'), false, 'state b\'s current substate should not be state e');
  equals(stateB.stateIsCurrentSubstate('f'), true, 'state b\'s current substate should be state f');
  
  equals(stateA.get('isCurrentState'), false, 'state a should not be current state');
  equals(stateB.get('isCurrentState'), false, 'state b should not be current state');
  equals(stateC.get('isCurrentState'), false, 'state c should not be current state');
  equals(stateD.get('isCurrentState'), true, 'state d should be current state');
  equals(stateE.get('isCurrentState'), false, 'state e should not be current state');
  equals(stateF.get('isCurrentState'), true, 'state f should be current state');
  
  ok(monitor.matchEnteredStates(root, 'a', 'd', 'b', 'f'), 'states root, A, D, B and F should all be entered');
});

test("from state a, go to sibling concurrent state b", function() {
  monitor.reset();
  
  // Expect to get an error to be outputted in the JS console, which is what we want since
  // the pivot state is the root state and it's substates are concurrent
  console.log('expecting to get an error...');
  stateA.gotoState('b');
  
  equals(monitor.get('length'), 0, 'state sequence should be of length 0');
  equals(statechart.get('currentStateCount'), 2, 'current state count should be 2');
  equals(statechart.stateIsCurrentState('c'), true, 'current state should be c');
  equals(statechart.stateIsCurrentState('e'), true, 'current state should be e');
  equals(stateA.stateIsCurrentSubstate('c'), true, 'state a\'s current substate should be state c');
  equals(stateA.stateIsCurrentSubstate('d'), false, 'state a\'s current substate should not be state d');
  equals(stateB.stateIsCurrentSubstate('e'), true, 'state a\'s current substate should be state e');
  equals(stateB.stateIsCurrentSubstate('f'), false, 'state a\'s current substate should not be state f');
  
  ok(monitor.matchEnteredStates(root, 'a', 'c', 'b', 'e'), 'states root, A, C, B and E should all be entered');
});
});
minispade.register('ember-statechart/~tests/state_transitioning/standard/with_concurrent_states/intermediate_test', function() {
// ==========================================================================
// SC.State Unit Test
// ==========================================================================
/*globals SC */

var statechart = null;
var monitor, root, stateA, stateB, stateC, stateD, stateE, stateF, stateG, stateZ;

module("SC.Statechart: With Concurrent States - Goto State Intermediate Tests", {
  setup: function() {
    
    statechart = SC.Statechart.create({
      
      monitorIsActive: YES,
      
      rootState: SC.State.extend({
        
        initialSubstate: 'a',

        a: SC.State.extend({
          substatesAreConcurrent: YES,
          
          b: SC.State.extend({
            initialSubstate: 'd',
            d: SC.State.extend(),
            e: SC.State.extend()
          }),
          
          c: SC.State.extend({
            initialSubstate: 'f',
            f: SC.State.extend(),
            g: SC.State.extend()
          })
        }),

        z: SC.State.extend()
      })
      
    });
    
    statechart.initStatechart();
    
    monitor = statechart.get('monitor');
    root = statechart.get('rootState');
    stateA = statechart.getState('a');
    stateB = statechart.getState('b');
    stateC = statechart.getState('c');
    stateD = statechart.getState('d');
    stateE = statechart.getState('e');
    stateF = statechart.getState('f');
    stateZ = statechart.getState('z');
  },
  
  teardown: function() {
    statechart.destroy();
    statechart = monitor = root = null;
    stateA = stateB = stateC = stateD = stateE = stateF = stateG = stateZ = null;
  }
});

test("check statechart initialization", function() {  
  equals(monitor.get('length'), 6, 'initial state sequence should be of length 5');
  
  equals(monitor.matchSequence().begin()
                                  .entered(root, 'a')
                                  .beginConcurrent()
                                    .beginSequence()
                                      .entered('b', 'd')
                                    .endSequence()
                                    .beginSequence()
                                      .entered('c', 'f')
                                    .endSequence()
                                  .endConcurrent()
                                .end(), 
    true, 'initial sequence should be entered[ROOT, a, b, d, c, f]');
  
  equals(statechart.get('currentStateCount'), 2, 'current state count should be 2');
  equals(statechart.stateIsCurrentState('d'), true, 'current state should be d');
  equals(statechart.stateIsCurrentState('f'), true, 'current state should be f');
  equals(stateA.stateIsCurrentSubstate('d'), true, 'state a\'s current substate should be state d');
  equals(stateA.stateIsCurrentSubstate('f'), true, 'state a\'s current substate should be state f');
  equals(stateA.stateIsCurrentSubstate('e'), false, 'state a\'s current substate should not be state e');
  equals(stateA.stateIsCurrentSubstate('g'), false, 'state a\'s current substate should not be state g');
  equals(stateB.stateIsCurrentSubstate('d'), true, 'state b\'s current substate should be state d');
  equals(stateB.stateIsCurrentSubstate('e'), false, 'state b\'s current substate should not be state e');
  equals(stateC.stateIsCurrentSubstate('f'), true, 'state c\'s current substate should be state f');
  equals(stateC.stateIsCurrentSubstate('g'), false, 'state c\'s current substate should not be state g');
  
  ok(monitor.matchEnteredStates(root, 'a', 'b', 'c', 'd', 'f'), 'states root, A, B, C, D and F should all be entered');
});

test("from state d, go to state z", function() {   
  monitor.reset();
  stateD.gotoState('z');
  
  equals(monitor.get('length'), 6, 'initial state sequence should be of length 6');
  equals(monitor.matchSequence().begin().exited('d', 'b', 'f', 'c', 'a').entered('z').end(), true, 'sequence should be exited[d, b, f, c, a], entered[z]');
  equals(statechart.get('currentStateCount'), 1, 'current state count should be 1');
  equals(statechart.stateIsCurrentState('z'), true, 'current state should be z');
  equals(stateA.getPath('currentSubstates.length'), 0, 'state a should have 0 current substates');
  equals(stateA.stateIsCurrentSubstate('d'), false, 'state a\'s current substate should not be state d');
  equals(stateA.stateIsCurrentSubstate('f'), false, 'state a\'s current substate should not be state f');
  equals(stateA.stateIsCurrentSubstate('e'), false, 'state a\'s current substate should not be state e');
  equals(stateA.stateIsCurrentSubstate('g'), false, 'state a\'s current substate should not be state g');
  
  ok(monitor.matchEnteredStates(root, 'z'), 'states root and Z should all be entered');
});

test("from state a, go to state z and then back to state a", function() { 
  monitor.reset();
  stateA.gotoState('z');

  equals(monitor.get('length'), 6, 'initial state sequence should be of length 6');
  
  equals(monitor.matchSequence().begin()
                                  .beginConcurrent()
                                    .beginSequence()
                                      .exited('d', 'b')
                                    .endSequence()
                                    .beginSequence()
                                      .exited('f', 'c')
                                    .endSequence()
                                  .endConcurrent()
                                  .exited('a')
                                  .entered('z')
                                .end(), 
    true, 'sequence should be exited[d, b, f, c, a], entered[z]');
  
  equals(statechart.get('currentStateCount'), 1, 'current state count should be 1');
  equals(statechart.stateIsCurrentState('z'), true, 'current state should be z');
  
  monitor.reset();
  stateZ.gotoState('a');
  
  equals(monitor.get('length'), 6, 'initial state sequence should be of length 6');
  
  equals(monitor.matchSequence().begin()
                                  .exited('z')
                                  .entered('a')
                                  .beginConcurrent()
                                    .beginSequence()
                                      .entered('b', 'd')
                                    .endSequence()
                                    .beginSequence()
                                      .entered('c', 'f')
                                    .endSequence()
                                  .endConcurrent()
                                .end(), 
    true, 'sequence should be exited[z], entered[a, b, d, c, f]');
  
  equals(statechart.get('currentStateCount'), 2, 'current state count should be 1');
  equals(statechart.stateIsCurrentState('d'), true, 'current state should be d');
  equals(statechart.stateIsCurrentState('f'), true, 'current state should be f');
  equals(stateA.getPath('currentSubstates.length'), 2, 'state a should have 2 current substates');
  equals(stateA.stateIsCurrentSubstate('d'), true, 'state a\'s current substate should be state d');
  equals(stateA.stateIsCurrentSubstate('e'), false, 'state a\'s current substate should not be state e');
  equals(stateA.stateIsCurrentSubstate('f'), true, 'state a\'s current substate should be state f');
  equals(stateA.stateIsCurrentSubstate('g'), false, 'state a\'s current substate should not be state g');
  
  ok(monitor.matchEnteredStates(root, 'a', 'b', 'c', 'd', 'f'), 'states root, A, B, C, D and F should all be entered');
});
});
minispade.register('ember-statechart/~tests/state_transitioning/standard/without_concurrent_states/context_test', function() {
// ==========================================================================
// SC Unit Test
// ==========================================================================
/*globals SC */

var statechart,
    TestState,
    context,
    monitor,
    root,
    stateA,
    stateB,
    stateC,
    stateD,
    stateE,
    stateF;

module("SC.Statechart: Supply Context Parameter to gotoState - Without Concurrent States", {
  setup: function() {
    
    TestState = SC.State.extend({
      enterStateContext: null,
      exitStateContext: null,
      
      enterState: function(context) {
        this.set('enterStateContext', context);
      },
      
      exitState: function(context) {
        this.set('exitStateContext', context);
      }
    });
    
    statechart = SC.Statechart.create({
      
      monitorIsActive: YES,
      
      rootState: TestState.extend({
        
        initialSubstate: 'a',
        
        a: TestState.extend({
          initialSubstate: 'c',
          c: TestState.extend(),
          d: TestState.extend()
        }),
        
        b: TestState.extend({
          initialSubstate: 'e',
          e: TestState.extend(),
          f: TestState.extend()
        })
      })
      
    });
    
    statechart.initStatechart();
    
    context = { foo: 100 };
    
    monitor = statechart.get('monitor');
    root = statechart.get('rootState');
    stateA = statechart.getState('a');
    stateB = statechart.getState('b');
    stateC = statechart.getState('c');
    stateD = statechart.getState('d');
    stateE = statechart.getState('e');
    stateF = statechart.getState('f');
  },
  
  teardown: function() {
    statechart = TestState = monitor = context = null;
    root = stateA = stateB = stateC = stateD = stateE = stateF;
  }
});

test("check statechart initialization", function() {
  equals(root.get('enterStateContext'), null);
  equals(stateA.get('enterStateContext'), null);
  equals(stateC.get('enterStateContext'), null);
});

test("pass no context when going to state f using statechart", function() {  
  statechart.gotoState('f');
  equals(stateF.get('isCurrentState'), true);
  equals(stateC.get('exitStateContext'), null);
  equals(stateA.get('exitStateContext'), null);
  equals(stateB.get('enterStateContext'), null);
  equals(stateF.get('enterStateContext'), null);
});

test("pass no context when going to state f using state", function() {  
  stateC.gotoState('f');
  equals(stateF.get('isCurrentState'), true);
  equals(stateC.get('exitStateContext'), null);
  equals(stateA.get('exitStateContext'), null);
  equals(stateB.get('enterStateContext'), null);
  equals(stateF.get('enterStateContext'), null);
});

test("pass context when going to state f using statechart - gotoState('f', context)", function() {  
  statechart.gotoState('f', context);
  equals(stateF.get('isCurrentState'), true);
  equals(stateC.get('exitStateContext'), context, 'state c should have context upon exiting');
  equals(stateA.get('exitStateContext'), context, 'state a should have context upon exiting');
  equals(stateB.get('enterStateContext'), context, 'state b should have context upon entering');
  equals(stateF.get('enterStateContext'), context, 'state f should have context upon entering');
});

test("pass context when going to state f using state - gotoState('f', context)", function() {  
  stateC.gotoState('f', context);
  equals(stateF.get('isCurrentState'), true);
  equals(stateC.get('exitStateContext'), context, 'state c should have context upon exiting');
  equals(stateA.get('exitStateContext'), context, 'state a should have context upon exiting');
  equals(stateB.get('enterStateContext'), context, 'state b should have context upon entering');
  equals(stateF.get('enterStateContext'), context, 'state f should have context upon entering');
});

test("pass context when going to state f using statechart - gotoState('f', stateC, context) ", function() {  
  statechart.gotoState('f', stateC, context);
  equals(stateF.get('isCurrentState'), true);
  equals(stateC.get('exitStateContext'), context, 'state c should have context upon exiting');
  equals(stateA.get('exitStateContext'), context, 'state a should have context upon exiting');
  equals(stateB.get('enterStateContext'), context, 'state b should have context upon entering');
  equals(stateF.get('enterStateContext'), context, 'state f should have context upon entering');
});

test("pass context when going to state f using statechart - gotoState('f', false, context) ", function() {  
  statechart.gotoState('f', false, context);
  equals(stateF.get('isCurrentState'), true);
  equals(stateC.get('exitStateContext'), context, 'state c should have context upon exiting');
  equals(stateA.get('exitStateContext'), context, 'state a should have context upon exiting');
  equals(stateB.get('enterStateContext'), context, 'state b should have context upon entering');
  equals(stateF.get('enterStateContext'), context, 'state f should have context upon entering');
});

test("pass context when going to state f using statechart - gotoState('f', stateC, false, context) ", function() {  
  statechart.gotoState('f', stateC, false, context);
  equals(stateF.get('isCurrentState'), true);
  equals(stateC.get('exitStateContext'), context, 'state c should have context upon exiting');
  equals(stateA.get('exitStateContext'), context, 'state a should have context upon exiting');
  equals(stateB.get('enterStateContext'), context, 'state b should have context upon entering');
  equals(stateF.get('enterStateContext'), context, 'state f should have context upon entering');
});
});
minispade.register('ember-statechart/~tests/state_transitioning/standard/without_concurrent_states/core_test', function() {
// ==========================================================================
// SC.Statechart Unit Test
// ==========================================================================
/*globals SC */

var statechart = null;
var root, stateA, stateB, stateC, stateD, stateE, stateF, stateG, stateH; 
var stateI, stateJ, stateK, stateL, stateM, stateN, monitor;
var allState;

module("SC.Statechart: No Concurrent States - Goto State Tests", {
  setup: function() {

    statechart = SC.Statechart.create({
      
      monitorIsActive: YES,
      
      rootState: SC.State.extend({
        
        initialSubstate: 'a',
        
        a: SC.State.extend({
        
          initialSubstate: 'c',
          
          c: SC.State.extend({
            initialSubstate: 'g',
            g: SC.State.extend(),
            h: SC.State.extend()
          }),
          
          d: SC.State.extend({
            initialSubstate: 'i',
            i: SC.State.extend(),
            j: SC.State.extend()
          })
          
        }),
        
        b: SC.State.extend({
          
          initialSubstate: 'e',
          
          e: SC.State.extend({
            initialSubstate: 'k',
            k: SC.State.extend(),
            l: SC.State.extend()
          }),
          
          f: SC.State.extend({
            initialSubstate: 'm',
            m: SC.State.extend(),
            n: SC.State.extend()
          })
          
        })
        
      })
      
    });
    
    statechart.initStatechart();
    
    monitor = statechart.get('monitor');
    root = statechart.get('rootState');
    stateA = statechart.getState('a');
    stateB = statechart.getState('b');
    stateC = statechart.getState('c');
    stateD = statechart.getState('d');
    stateE = statechart.getState('e');
    stateF = statechart.getState('f');
    stateG = statechart.getState('g');
    stateH = statechart.getState('h');
    stateI = statechart.getState('i');
    stateJ = statechart.getState('j');
    stateK = statechart.getState('k');
    stateL = statechart.getState('l');
    stateM = statechart.getState('m');
    stateN = statechart.getState('n');
  },
  
  teardown: function() {
    statechart.destroy();
    statechart = monitor = root = null;
    stateA = stateB = stateC = stateD = stateE = stateF = stateG = stateH = stateI = stateJ = null;
    stateK = stateL = stateM = stateN = null;
  }
});

test("check statechart state objects", function() {
  equals(SC.none(stateG), false, 'statechart should return a state object for state with name "g"');
  equals(stateG.get('stateName'), 'g', 'state g should have name "g"');
  equals(stateG.get('isCurrentState'), true, 'state G should be current state');
  equals(stateG.stateIsCurrentSubstate('g'), true, 'state g should have current substate g');
  equals(statechart.stateIsCurrentState('g'), true, 'statechart should have current state g');
  equals(statechart.stateIsCurrentState(stateG), true, 'statechart should have current state g');
  
  equals(SC.none(stateM), false, 'statechart should return a state object for state with name "m"');
  equals(stateM.get('stateName'), 'm', 'state m should have name "m"');
  equals(stateM.get('isCurrentState'), false, 'state m should not be current state');
  equals(stateG.stateIsCurrentSubstate('m'), false, 'state m should not have current substate m');
  equals(statechart.stateIsCurrentState('m'), false, 'statechart should not have current state m');
  equals(statechart.stateIsCurrentState(stateM), false, 'statechart should not have current state m');
  
  equals(SC.none(stateA), false, 'statechart should return a state object for state with name "a"');
  equals(stateA.get('isCurrentState'), false, 'state m should not be current state');
  equals(stateA.stateIsCurrentSubstate('a'), false, 'state a should not have current substate g');
  equals(stateA.stateIsCurrentSubstate('c'), false, 'state a should not have current substate c');
  equals(stateA.stateIsCurrentSubstate('g'), true, 'state a should have current substate g');
  equals(stateA.stateIsCurrentSubstate(stateG), true, 'state a should have current substate g');
  equals(stateA.stateIsCurrentSubstate(stateM), false, 'state a should not have current substate m');
  
  var stateX = statechart.getState('x');
  equals(SC.none(stateX), true, 'statechart should not have a state with name "x"');
});

test("check statechart initialization", function() {
  equals(monitor.get('length'), 4, 'initial state sequence should be of length 4');
  equals(monitor.matchSequence().begin().entered(root, 'a', 'c', 'g').end(), true, 'initial sequence should be entered[ROOT, a, c, g]');
  equals(monitor.matchSequence().begin().entered(root, 'a', 'c', 'h').end(), false, 'initial sequence should not be entered[ROOT, a, c, h]');
  
  equals(statechart.get('currentStateCount'), 1, 'current state count should be 1');
  equals(statechart.stateIsCurrentState('g'), true, 'current state should be g');
  
  ok(monitor.matchEnteredStates(root, 'a', 'c', 'g'), 'states root, A, C and G should all be entered');
});

test("go to state h", function() {
  monitor.reset();
  statechart.gotoState('h');
  
  equals(monitor.get('length'), 2, 'state sequence should be of length 2');
  equals(monitor.matchSequence().begin().exited('g').entered('h').end(), true, 'sequence should be exited[g], entered[h]');
  equals(monitor.matchSequence().begin().exited('h').entered('g').end(), false, 'sequence should not be exited[h], entered[g]');
  
  equals(statechart.get('currentStateCount'), 1, 'current state count should be 1');
  equals(statechart.stateIsCurrentState('h'), true, 'current state should be h');
  
  ok(monitor.matchEnteredStates(root, 'a', 'c', 'h'), 'states root, A, C and H should all be entered');
});

test("go to states: h, d", function() {
  statechart.gotoState('h');
  
  monitor.reset();
  statechart.gotoState('d');
  
  equals(monitor.get('length'), 4, 'state sequence should be of length 4');
  equals(monitor.matchSequence().begin().exited('h', 'c').entered('d', 'i').end(), true, 'sequence should be exited[h, c], entered[d, i]');
  equals(monitor.matchSequence().begin().exited('h', 'c').entered('d', 'f').end(), false, 'sequence should not be exited[h, c], entered[d, f]');
  equals(monitor.matchSequence().begin().exited('g', 'c').entered('d', 'i').end(), false, 'sequence should not be exited[g, c], entered[d, f]');
  equals(statechart.get('currentStateCount'), 1, 'current state count should be 1');
  equals(statechart.stateIsCurrentState('i'), true, 'current state should be i');
  
  ok(monitor.matchEnteredStates(root, 'a', 'd', 'i'), 'states root, A, D and I should all be entered');
});

test("go to states: h, d, h", function() {
  statechart.gotoState('h');
  statechart.gotoState('d');
  
  monitor.reset();
  statechart.gotoState('h');
  
  equals(monitor.get('length'), 4, 'state sequence should be of length 4');
  equals(monitor.matchSequence().begin().exited('i', 'd').entered('c', 'h').end(), true, 'sequence should be exited[i, d], entered[c, h]');
  equals(statechart.get('currentStateCount'), 1, 'current state count should be 1');
  equals(statechart.stateIsCurrentState('h'), true, 'current state should be h');
  
  ok(monitor.matchEnteredStates(root, 'a', 'c', 'h'), 'states root, A, C and H should all be entered');
});

test("go to state b", function() {
  monitor.reset();
  statechart.gotoState('b');
  
  equals(monitor.get('length'), 6, 'state sequence should be of length 6');
  equals(monitor.matchSequence().begin().exited('g', 'c', 'a').entered('b', 'e', 'k').end(), true, 'sequence should be exited[g, c, a], entered[b, e, k]');
  equals(monitor.matchSequence().begin().exited('g', 'a', 'c').entered('b', 'e', 'k').end(), false, 'sequence should not be exited[g, a, c], entered[b, e, k]');
  equals(monitor.matchSequence().begin().exited('g', 'c', 'a').entered('b', 'k', 'e').end(), false, 'sequence should not be exited[g, c, a], entered[b, k, e]');
  equals(statechart.get('currentStateCount'), 1, 'current state count should be 1');
  equals(statechart.stateIsCurrentState('k'), true, 'current state should be k');
  
  ok(monitor.matchEnteredStates(root, 'b', 'e', 'k'), 'states root, B, E and K should all be entered');
});

test("go to state f", function() {
  monitor.reset();
  statechart.gotoState('f');
  
  equals(monitor.get('length'), 6, 'state sequence should be of length 6');
  equals(monitor.matchSequence().begin().exited('g', 'c', 'a').entered('b', 'f', 'm').end(), true, 'sequence should be exited[g, c, a], entered[b, f, m]');
  equals(statechart.get('currentStateCount'), 1, 'current state count should be 1');
  equals(statechart.stateIsCurrentState('m'), true, 'current state should be m');
  
  ok(monitor.matchEnteredStates(root, 'b', 'f', 'm'), 'states root, B, F and M should all be entered');
});

test("go to state n", function() {
  monitor.reset();
  statechart.gotoState('n');
  
  equals(monitor.get('length'), 6, 'state sequence should be of length 6');
  equals(monitor.matchSequence().begin().exited('g', 'c', 'a').entered('b', 'f', 'n').end(), true, 'sequence should be exited[g, c, a], entered[b, f, n]');
  equals(statechart.get('currentStateCount'), 1, 'current state count should be 1');
  equals(statechart.stateIsCurrentState('n'), true, 'current state should be n');
  
  ok(monitor.matchEnteredStates(root, 'b', 'f', 'n'), 'states root, B, F and N should all be entered');
});

test("re-enter state g", function() {
  monitor.reset();
  statechart.gotoState('g');
  
  equals(monitor.get('length'), 2, 'state sequence should be of length 2');
  equals(monitor.matchSequence().begin().exited('g').entered('g').end(), true, 'sequence should be exited[g], entered[g]');
  equals(statechart.get('currentStateCount'), 1, 'current state count should be 1');
  equals(statechart.stateIsCurrentState('g'), true, 'current state should be g');
  
  monitor.reset();
  equals(monitor.get('length'), 0, 'state sequence should be of length 0 after monitor reset');
  
  var state = statechart.getState('g');
  state.reenter();
  
  equals(monitor.get('length'), 2, 'state sequence should be of length 2');
  equals(monitor.matchSequence().begin().exited('g').entered('g').end(), true, 'sequence should be exited[g], entered[g]');
  equals(statechart.get('currentStateCount'), 1, 'current state count should be 1');
  equals(statechart.stateIsCurrentState('g'), true, 'current state should be g');
  
  ok(monitor.matchEnteredStates(root, 'a', 'c', 'g'), 'states root, A, C and G should all be entered');
}); 

test("go to g state's ancestor state a", function() {
  monitor.reset();
  statechart.gotoState('a');
  
  equals(monitor.get('length'), 6, 'initial state sequence should be of length 6');
  equals(monitor.matchSequence().begin().exited('g', 'c', 'a').entered('a', 'c', 'g').end(), true, 'sequence should be exited[g, c, a], entered[a, c, g]');
  equals(statechart.get('currentStateCount'), 1, 'current state count should be 1');
  equals(statechart.stateIsCurrentState('g'), true, 'current state should be g');
  
  ok(monitor.matchEnteredStates(root, 'a', 'c', 'g'), 'states root, A, C and G should all be entered');
});

test("go to state b and then go to root state", function() {
  statechart.gotoState('b');
  equals(statechart.get('currentStateCount'), 1, 'current state count should be 1');
  equals(statechart.stateIsCurrentState('k'), true, 'current state should be k');
  
  monitor.reset();
  statechart.gotoState(statechart.get('rootState'));
  
  var root = statechart.get('rootState');
  equals(monitor.get('length'), 8, 'initial state sequence should be of length 6');
  equals(monitor.matchSequence().begin().exited('k', 'e', 'b', root).entered(root, 'a', 'c', 'g').end(), 
        true, 'sequence should be exited[k, e, b, ROOT], entered[ROOT, a, c, g]');
  equals(statechart.get('currentStateCount'), 1, 'current state count should be 1');
  equals(statechart.stateIsCurrentState('g'), true, 'current state should be g');
  
  ok(monitor.matchEnteredStates(root, 'a', 'c', 'g'), 'states root, A, C and G should all be entered');
});

test("from state g, go to state m calling state g\'s gotoState", function() {
  equals(stateG.get('isCurrentState'), true, 'state g should be current state');
  equals(stateM.get('isCurrentState'), false, 'state m should not be current state');
  
  monitor.reset();
  stateG.gotoState('m');
  
  equals(monitor.get('length'), 6, 'initial state sequence should be of length 6');
  equals(monitor.matchSequence().begin().exited('g', 'c', 'a').entered('b', 'f', 'm').end(), 
        true, 'sequence should be exited[g, c, a], entered[b, f, m]');
  equals(statechart.get('currentStateCount'), 1, 'current state count should be 1');
  equals(statechart.stateIsCurrentState('m'), true, 'current state should be m');
  
  equals(stateG.get('isCurrentState'), false, 'state g should not be current state');
  equals(stateM.get('isCurrentState'), true, 'state m should be current state');
  
  ok(monitor.matchEnteredStates(root, 'b', 'f', 'm'), 'states root, B, F and M should all be entered');
});
});
minispade.register('ember-statechart/~tests/state_transitioning/transient/without_concurrent_states_test', function() {
// ==========================================================================
// SC.Statechart Unit Test
// ==========================================================================
/*globals SC */

var statechart;

// ..........................................................
// CONTENT CHANGING
// 

module("SC.Statechart: No Concurrent States - Transient State Transition Tests", {
  setup: function() {

    statechart = SC.Statechart.create({
      
      monitorIsActive: YES,
      
      rootState: SC.State.extend({
        
        initialSubstate: 'a',
        
        a: SC.State.extend({
        
          initialSubstate: 'b',
                    
          b: SC.State.extend({
            eventC: function() { this.gotoState('c'); },
            eventD: function() { this.gotoState('d'); },
            eventE: function() { this.gotoState('e'); },
            eventX: function() { this.gotoState('x'); }
          }),
          
          c: SC.State.extend({
            enterState: function() { this.gotoState('z'); }
          }),
          
          d: SC.State.extend({
            enterState: function() { this.gotoState('c'); }
          }),
          
          e: SC.State.extend({
            enterState: function() { this.gotoState('f'); }
          }),
          
          f: SC.State.extend(),
          
          g: SC.State.extend({
            
            initialSubstate: 'x',
            
            foo: function() { /* no-op */ },
            
            enterState: function() {
              return this.performAsync('foo');
            },
            
            x: SC.State.extend({
              enterState: function() { this.gotoState('h'); }
            })
  
          }),
          
          h: SC.State.extend()
          
        }),
        
        z: SC.State.extend()
        
      })
      
    });
    
    statechart.initStatechart();
  },
  
  teardown: function() {
    statechart.destroy();
    statechart = null;
  }
});

test("enter transient state C", function() {
  var monitor = statechart.get('monitor'),
      stateA = statechart.getState('a'),
      stateC = statechart.getState('c');

  monitor.reset();
  statechart.sendAction('eventC');
  
  equals(monitor.get('length'), 5, 'state sequence should be of length 5');
  equals(monitor.matchSequence()
          .begin()
            .exited('b')
            .entered('c')
            .exited('c', 'a')
            .entered('z')
          .end(), true, 
        'sequence should be exited[b], entered[c], exited[c, a], entered[z]');
  equals(statechart.stateIsCurrentState('z'), true, 'current state should be z');
  
  equals(stateA.get('historyState'), stateC);
});

test("enter transient state D", function() {
  var monitor = statechart.get('monitor'),
      stateA = statechart.getState('a'),
      stateC = statechart.getState('c');

  monitor.reset();
  statechart.sendAction('eventD');
  
  equals(monitor.get('length'), 7, 'state sequence should be of length 7');
  equals(monitor.matchSequence()
          .begin()
            .exited('b')
            .entered('d')
            .exited('d')
            .entered('c')
            .exited('c', 'a')
            .entered('z')
          .end(), true, 
        'sequence should be exited[b], entered[d], exited[d], entered[c], exited[c, a], entered[z]');
  equals(statechart.stateIsCurrentState('z'), true, 'current state should be z');
  
  equals(stateA.get('historyState'), stateC);
});

test("enter transient state X", function() {
  var monitor = statechart.get('monitor'),
      stateA = statechart.getState('a'),
      stateH = statechart.getState('h');

  monitor.reset();
  statechart.sendAction('eventX');
  
  equals(monitor.get('length'), 2, 'state sequence should be of length 2');
  equals(monitor.matchSequence()
          .begin()
            .exited('b')
            .entered('g')
          .end(), true, 
        'sequence should be exited[b], entered[g]');
  equals(statechart.get('gotoStateActive'), true, 'statechart should be in active goto state');
  equals(statechart.get('gotoStateSuspended'), true, 'statechart should have a suspended, active goto state');
  
  statechart.resumeGotoState();
  
  equals(monitor.get('length'), 6, 'state sequence should be of length 6');
  equals(monitor.matchSequence()
          .begin()
            .exited('b')
            .entered('g', 'x')
            .exited('x', 'g')
            .entered('h')
          .end(), true, 
        'sequence should be exited[b], entered[g, x], exited[x, g], entered[h]');
  equals(statechart.get('gotoStateActive'), false, 'statechart should not be in active goto state');
  equals(statechart.get('gotoStateSuspended'), false, 'statechart should not have a suspended, active goto state');
  
  equals(stateA.get('historyState'), stateH);
});
});
minispade.register('ember-statechart/~tests/statechart/create/assigned_root_state_test', function() {
// ==========================================================================
// SC.Statechart Unit Test
// ==========================================================================
/*globals SC statechart */

var obj1, rootState1, stateA, stateB;
var obj2;

module("SC.Statechart: Create Statechart with Assigned Root State Tests", {
  setup: function() {
    obj1 = SC.Object.extend(SC.StatechartManager, {
      rootState: SC.State.extend({
        
        initialSubstate: 'a',
        
        a: SC.State.extend({
          foo: function() {
            this.gotoState('b');
          }
        }),
        
        b: SC.State.extend({
          bar: function() {
            this.gotoState('a');
          }
        })
        
      })
    });
    
    obj1 = obj1.create();
    rootState1 = obj1.get('rootState');
    stateA = obj1.getState('a');
    stateB = obj1.getState('b');
    
    obj2 = SC.Object.extend(SC.StatechartManager, {
      autoInitStatechart: NO,
      rootState: SC.State.extend()
    });
    
    obj2 = obj2.create();
  },
  
  teardown: function() {
    obj1 = rootState1 = stateA = stateB = null;
    obj2 = null;
  }
});

test("check obj1", function() {
  ok(obj1.get('isStatechart'), "obj should be statechart");
  ok(obj1.get('statechartIsInitialized'), "obj should be an initialized statechart");
  ok(rootState1 instanceof SC.State, "root state should be kind of SC.State");
  equals(obj1.get('initialState'), null, "obj initialState should be null");
  
  ok(stateA.get('isCurrentState'), "state A should be current state");
  ok(!stateB.get('isCurrentState'), "state B should not be current state");
  
  equals(rootState1.get('owner'), obj1, "root state's owner should be obj");
  equals(stateA.get('owner'), obj1, "state A's owner should be obj");
  equals(stateB.get('owner'), obj1, "state B's owner should be obj");
  
  obj1.sendAction('foo');
  
  ok(!stateA.get('isCurrentState'), "state A should not be current state");
  ok(stateB.get('isCurrentState'), "state B should be current state");
});

test("check obj2", function() {
  ok(obj2.get('isStatechart'), "obj should be statechart");
  ok(!obj2.get('statechartIsInitialized'), "obj not should be an initialized statechart");
  
  obj2.initStatechart();
  
  ok(obj2.get('statechartIsInitialized'), "obj should be an initialized statechart");
});
});
minispade.register('ember-statechart/~tests/statechart/create/unassigned_root_state_test', function() {
// ==========================================================================
// SC.Statechart Unit Test
// ==========================================================================
/*globals SC statechart State */

var obj1, rootState1, stateA, stateB;
var obj2, rootState2, stateC, stateD;
var obj3, rootState3, stateE, rootStateExample;
var obj4;
var owner;

module("SC.Statechart: Create Statechart with Unassigned Root State Tests", {
  setup: function() {
    owner = SC.Object.create();
    
    obj1 = SC.Object.extend(SC.StatechartManager, {
      
      initialState: 'stateA',
      
      stateA: SC.State.extend({
        foo: function() {
          this.gotoState('stateB');
        }
      }),
      
      stateB: SC.State.extend({
        bar: function() {
          this.gotoState('stateA');
        }
      })
      
    });
    
    obj1 = obj1.create();
    rootState1 = obj1.get('rootState');
    stateA = obj1.getState('stateA');
    stateB = obj1.getState('stateB');  
    
    obj2 = SC.Object.extend(SC.StatechartManager, {
      
      statesAreConcurrent: YES,
      
      stateC: SC.State.extend({
        foo: function() {
          this.gotoState('stateD');
        }
      }),
      
      stateD: SC.State.extend({
        bar: function() {
          this.gotoState('stateC');
        }
      })
      
    });
    
    obj2 = obj2.create();
    rootState2 = obj2.get('rootState');
    stateC = obj2.getState('stateC');
    stateD = obj2.getState('stateD');  
    
    rootStateExample = SC.State.extend({ test: 'foo' });
    
    obj3 = SC.Object.extend(SC.StatechartManager, {
      owner: owner,
      initialState: 'stateE',
      rootStateExample: rootStateExample,
      stateE: SC.State.extend()
    });
    
    obj3 = obj3.create();
    rootState3 = obj3.get('rootState');
    stateE = obj3.getState('stateE');
    
    obj4 = SC.Object.extend(SC.StatechartManager, {
      autoInitStatechart: NO,
      initialState: 'stateF',
      rootStateExample: rootStateExample,
      stateF: SC.State.extend()
    });
    
    obj4 = obj4.create();
  },
  
  teardown: function() {
    obj1 = rootState1 = stateA = stateB = null;
    obj2 = rootState2 = stateC = stateD = null;
    obj3 = rootState3 = stateE = rootStateExample = null;
    obj4 = null;
  }
});

test("check obj1 statechart", function() {
  ok(obj1.get('isStatechart'), "obj should be a statechart");
  ok(obj1.get('statechartIsInitialized'), "obj should be an initialized statechart");
  ok(rootState1 instanceof SC.State, "root state should be kind of SC.State");
  ok(!rootState1.get('substateAreConcurrent'), "root state's substates should not be concurrent");
  
  equals(obj1.get('initialState'), stateA, "obj's initialState should be state A");
  equals(rootState1.get('initialSubstate'), stateA, "root state's initialState should be state A");
  equals(stateA, rootState1.getSubstate('stateA'), "obj.stateA and rootState.stateA should be equal");
  equals(stateB, rootState1.getSubstate('stateB'), "obj.stateB and rootState.stateB should be equal");
  
  equals(rootState1.get('owner'), obj1, "root state's owner should be obj");
  equals(stateA.get('owner'), obj1, "state A's owner should be obj");
  equals(stateB.get('owner'), obj1, "state B's owner should be obj");
  
  ok(stateA.get('isCurrentState'), "state A should be current state");
  ok(!stateB.get('isCurrentState'), "state B should not be current state");
  
  obj1.sendAction('foo');
  
  ok(!stateA.get('isCurrentState'), "state A should not be current state");
  ok(stateB.get('isCurrentState'), "state B should be current state");
});

test("check obj2 statechart", function() {
  ok(obj2.get('isStatechart'), "obj should be a statechart");
  ok(obj2.get('statechartIsInitialized'), "obj should be an initialized statechart");
  ok(rootState2 instanceof SC.State, "root state should be kind of SC.State");
  ok(rootState2.get('substatesAreConcurrent'), "root state's substates should be concurrent");
  
  equals(obj2.get('initialState'), null, "obj's initialState should be null");
  equals(rootState2.get('initialSubstate'), null, "root state's initialState should be null");
  equals(stateC, rootState2.getSubstate('stateC'), "obj.stateC and rootState.stateC should be equal");
  equals(stateD, rootState2.getSubstate('stateD'), "obj.stateD and rootState.stateD should be equal");
  
  equals(rootState2.get('owner'), obj2, "root state's owner should be obj");
  equals(stateC.get('owner'), obj2, "state C's owner should be obj");
  equals(stateD.get('owner'), obj2, "state D's owner should be obj");
  
  ok(stateC.get('isCurrentState'), "state C should be current state");
  ok(stateD.get('isCurrentState'), "state D should not be current state");
});

test("check obj3 statechart", function() {
  ok(obj3.get('isStatechart'), "obj should be a statechart");
  ok(obj3.get('statechartIsInitialized'), "obj should be an initialized statechart");
  ok(rootState3 instanceof rootStateExample, "root state should be kind of rootStateExample");
  ok(!rootState3.get('substatesAreConcurrent'), "root state's substates should be concurrent");
  
  equals(rootState3.get('owner'), owner, "root state's owner should be owner");
  equals(stateE.get('owner'), owner, "state C's owner should be owner");
  
  equals(obj3.get('initialState'), stateE, "obj's initialState should be stateE");
  equals(rootState3.get('initialSubstate'), stateE, "root state's initialState should be stateE");
  equals(stateE, rootState3.getSubstate('stateE'), "obj.stateE and rootState.stateE should be equal");
  
  ok(stateE.get('isCurrentState'), "state E should be current state");
});

test("check obj4 statechart", function() {
  ok(obj4.get('isStatechart'), "obj should be a statechart");
  ok(!obj4.get('statechartIsInitialized'), "obj should not be an initialized statechart");
  equals(obj4.get('rootState'), null, "obj's root state should be null");
  
  obj4.initStatechart();
  
  ok(obj4.get('statechartIsInitialized'), "obj should be an initialized statechart");
  ok(obj4.get('rootState'), "obj's root state should not be null");
  equals(obj4.get('rootState').getSubstate('stateF'), obj4.getState('stateF'), "obj.stateF should be equal to rootState.stateF");
});
});
minispade.register('ember-statechart/~tests/statechart/destroy_test', function() {
// ==========================================================================
// SC.Statechart Unit Test
// ==========================================================================
/*globals SC statechart State */

var obj, rootState, stateA, stateB;

module("SC.Statechart: Destroy Statechart Tests", {
  setup: function() {
    
    obj = SC.Object.create(SC.StatechartManager, {
      
      initialState: 'stateA',
      
      stateA: SC.State.extend(),
      
      stateB: SC.State.extend()
      
    });
    
    obj.initStatechart();
    rootState = obj.get('rootState');
    stateA = obj.getState('stateA');
    stateB = obj.getState('stateB');
  },
  
  teardown: function() {
    obj = rootState = stateA = stateB = null;
  }
});

test("check obj before and after destroy", function() {
  ok(!obj.get('isDestroyed'), "obj should not be destroyed");
  ok(obj.hasObserverFor('owner'), "obj should have observers for property owner");
  ok(obj.hasObserverFor('trace'), "obj should have observers for property trace");
  equals(obj.get('rootState'), rootState, "object should have a root state");
  
  ok(!rootState.get('isDestroyed'), "root state should not be destoryed");
  equals(rootState.getPath('substates.length'), 2, "root state should have two substates");
  equals(rootState.getPath('currentSubstates.length'), 1, "root state should one current substate");
  equals(rootState.get('historyState'), stateA, "root state should have history state of A");
  equals(rootState.get('initialSubstate'), stateA, "root state should have initial substate of A");
  equals(rootState.get('statechart'), obj, "root state's statechart should be obj");
  equals(rootState.get('owner'), obj, "root state's owner should be obj");
  
  ok(!stateA.get('isDestroyed'), "state A should not be destoryed");
  equals(stateA.get('parentState'), rootState, "state A should have a parent state of root state");
  
  ok(!stateB.get('isDestroyed'), "state B should not be destroyed");
  equals(stateB.get('parentState'), rootState, "state B should have a parent state of root state");
  
  obj.destroy();

  ok(obj.get('isDestroyed'), "obj should be destroyed");
  ok(!obj.hasObserverFor('owner'), "obj should not have observers for property owner");
  ok(!obj.hasObserverFor('trace'), "obj should not have observers for property trace");
  equals(obj.get('rootState'), null, "obj should not have a root state");
  
  ok(rootState.get('isDestroyed'), "root state should be destroyed");
  equals(rootState.get('substates'), null, "root state should not have substates");
  equals(rootState.get('currentSubstates'), null, "root state should not have current substates");
  equals(rootState.get('parentState'), null, "root state should not have a parent state");
  equals(rootState.get('historyState'), null, "root state should not have a history state");
  equals(rootState.get('initialSubstate'), null, "root state should not have an initial substate");
  equals(rootState.get('statechart'), null, "root state's statechart should be null");
  equals(rootState.get('owner'), null, "root state's owner should be null");
  
  ok(stateA.get('isDestroyed'), "state A should be destroyed");
  equals(stateA.get('parentState'), null, "state A should not have a parent state");
  
  ok(stateB.get('isDestroyed'), "state B should be destroyed");
  equals(stateB.get('parentState'), null, "state B should not have a parent state");
});
});
minispade.register('ember-statechart/~tests/statechart/invoke_state_method_test', function() {
// ==========================================================================
// SC.Statechart Unit Test
// ==========================================================================
/*globals SC statechart State */

var TestState;
var obj1, rootState1, stateA, stateB;
var obj2, rootState2, stateC, stateD;

module("SC.Statechart: invokeStateMethod Tests", {
  setup: function() {
    TestState = SC.State.extend({
      testInvokedCount: 0,
      arg1: undefined,
      arg2: undefined,
      returnValue: undefined,
      
      testInvoked: function() {
        return this.get('testInvokedCount') > 0;
      }.property('testInvokedCount'),
      
      test: function(arg1, arg2) {
        this.set('testInvokedCount', this.get('testInvokedCount') + 1);
        this.set('arg1', arg1);
        this.set('arg2', arg2);
        if (this.get('returnValue') !== undefined) {
          return this.get('returnValue');
        } 
      }
    });
    
    obj1 = SC.Object.extend(SC.StatechartManager, {
      
      initialState: 'stateA',
      
      rootStateExample: TestState.extend({
        testX: function(arg1, arg2) {
          this.set('testInvokedCount', this.get('testInvokedCount') + 1);
          this.set('arg1', arg1);
          this.set('arg2', arg2);
          if (this.get('returnValue') !== undefined) {
            return this.get('returnValue');
          } 
        }
      }),
      
      stateA: TestState.extend(),
      
      stateB: TestState.extend()
      
    });
    
    obj1 = obj1.create();
    rootState1 = obj1.get('rootState');
    stateA = obj1.getState('stateA');
    stateB = obj1.getState('stateB');
    
    obj2 = SC.Object.extend(SC.StatechartManager, {
      
      statesAreConcurrent: YES,
      
      rootStateExample: TestState.extend({
        testX: function(arg1, arg2) {
          this.set('testInvokedCount', this.get('testInvokedCount') + 1);
          this.set('arg1', arg1);
          this.set('arg2', arg2);
          if (this.get('returnValue') !== undefined) {
            return this.get('returnValue');
          } 
        }
      }),
      
      stateC: TestState.extend(),
      
      stateD: TestState.extend()
      
    });
    
    obj2 = obj2.create();
    rootState2 = obj2.get('rootState');
    stateC = obj2.getState('stateC');
    stateD = obj2.getState('stateD');
  },
  
  teardown: function() {
    TestState = obj1 = rootState1 = stateA = stateB = null;
    obj2 = rootState2 = stateC = stateD = null;
  }
});

test("check obj1 - invoke method test1", function() {
  var result = obj1.invokeStateMethod('test1');
  ok(!rootState1.get('testInvoked'), "root state test method should not have been invoked");
  ok(!stateA.get('testInvoked'), "state A's test method should not have been invoked");
  ok(!stateB.get('testInvoked'), "state B's test method should not have been invoked");
});

test("check obj1 - invoke method test, current state A, no args, no return value", function() {
  var result = obj1.invokeStateMethod('test');
  equals(stateA.get('testInvokedCount'), 1, "state A's test method should have been invoked once");
  equals(stateA.get('arg1'), undefined, "state A's arg1 method should be undefined");
  equals(stateA.get('arg2'), undefined, "state A's arg2 method should be undefined");
  equals(result, undefined, "returned result should be undefined");
  ok(!rootState1.get('testInvoked'), "root state's test method should not have been invoked");
  ok(!stateB.get('testInvoked'), "state B's test method should not have been invoked");
});

test("check obj1 - invoke method test, current state A, one args, no return value", function() {
  var result = obj1.invokeStateMethod('test', "frozen");
  ok(stateA.get('testInvoked'), "state A's test method should have been invoked");
  equals(stateA.get('arg1'), "frozen", "state A's arg1 method should be 'frozen'");
  equals(stateA.get('arg2'), undefined, "state A's arg2 method should be undefined");
  ok(!rootState1.get('testInvoked'), "root state's test method should not have been invoked");
  ok(!stateB.get('testInvoked'), "state B's test method should not have been invoked");
});

test("check obj1 - invoke method test, current state A, two args, no return value", function() {
  var result = obj1.invokeStateMethod('test', 'frozen', 'canuck');
  ok(stateA.get('testInvoked'), "state A's test method should have been invoked");
  equals(stateA.get('arg1'), "frozen", "state A's arg1 method should be 'frozen'");
  equals(stateA.get('arg2'), "canuck", "state A's arg2 method should be undefined");
  ok(!rootState1.get('testInvoked'), "root state's test method should not have been invoked");
  ok(!stateB.get('testInvoked'), "state B's test method should not have been invoked");
});

test("check obj1 - invoke method test, current state A, no args, return value", function() {
  stateA.set('returnValue', 100);
  var result = obj1.invokeStateMethod('test');
  ok(stateA.get('testInvoked'), "state A's test method should have been invoked");
  equals(result, 100, "returned result should be 100");
  ok(!rootState1.get('testInvoked'), "root state's test method should not have been invoked");
  ok(!stateB.get('testInvoked'), "state B's test method should not have been invoked");
});

test("check obj1 - invoke method test, current state B, two args, return value", function() {
  stateB.set('returnValue', 100);
  obj1.gotoState(stateB);
  ok(stateB.get('isCurrentState'), "state B should be curren state");
  var result = obj1.invokeStateMethod('test', 'frozen', 'canuck');
  ok(!stateA.get('testInvoked'), "state A's test method should not have been invoked");
  equals(stateB.get('testInvokedCount'), 1, "state B's test method should have been invoked once");
  equals(stateB.get('arg1'), 'frozen', "state B's arg1 method should be 'frozen'");
  equals(stateB.get('arg2'), 'canuck', "state B's arg2 method should be 'canuck'");
  equals(result, 100, "returned result should be 100");
  ok(!rootState1.get('testInvoked'), "root state's test method should not have been invoked");
});

test("check obj1 - invoke method test, current state A, use callback", function() {
  var callbackState, callbackResult;
  obj1.invokeStateMethod('test', function(state, result) {
    callbackState = state;
    callbackResult = result;
  });
  ok(stateA.get('testInvoked'), "state A's test method should have been invoked");
  ok(!stateB.get('testInvoked'), "state B's test method should not have been invoked");
  equals(callbackState, stateA, "state should be state A");
  equals(callbackResult, undefined, "result should be undefined");
  ok(!rootState1.get('testInvoked'), "root state's test method should not have been invoked");
});

test("check obj1- invoke method test, current state B, use callback", function() {
  var callbackState, callbackResult;
  obj1.gotoState(stateB);
  stateB.set('returnValue', 100);
  obj1.invokeStateMethod('test', function(state, result) {
    callbackState = state;
    callbackResult = result;
  });
  ok(!stateA.get('testInvoked'), "state A's test method should not have been invoked");
  ok(stateB.get('testInvoked'), "state B's test method should have been invoked");
  equals(callbackState, stateB, "state should be state B");
  equals(callbackResult, 100, "result should be 100");
  ok(!rootState1.get('testInvoked'), "root state's test method should not have been invoked");
});

test("check obj1 - invoke method testX", function() {
  rootState1.set('returnValue', 100);
  var result = obj1.invokeStateMethod('testX');
  equals(rootState1.get('testInvokedCount'), 1, "root state's testX method should not have been invoked once");
  equals(result, 100, "result should have value 100");
  ok(!stateA.get('testInvoked'), "state A's test method should have been invoked");
  ok(!stateB.get('testInvoked'), "state B's test method should not have been invoked");
});

test("check obj2 - invoke method test1", function() {
  var result = obj2.invokeStateMethod('test1');
  ok(!rootState2.get('testInvoked'), "root state test method should not have been invoked");
  ok(!stateC.get('testInvoked'), "state A's test method should not have been invoked");
  ok(!stateD.get('testInvoked'), "state B's test method should not have been invoked");
});

test("check obj2 - invoke test, no args, no return value", function() {
  var result = obj2.invokeStateMethod('test');
  equals(stateC.get('testInvokedCount'), 1, "state C's test method should have been invoked once");
  equals(stateD.get('testInvokedCount'), 1, "state D's test method should have been invoked once");
  ok(!rootState1.get('testInvoked'), "root state test method should not have been invoked");
  equals(stateC.get('arg1'), undefined, "state C's arg1 method should be undefined");
  equals(stateC.get('arg2'), undefined, "state C's arg2 method should be undefined");
  equals(stateD.get('arg1'), undefined, "state D's arg1 method should be undefined");
  equals(stateD.get('arg2'), undefined, "state D's arg2 method should be undefined");
  equals(result, undefined, "returned result should be undefined");
});

test("check obj2 - invoke test, two args, return value, callback", function() {
  var numCallbacks = 0,
      callbackInfo = {};
  stateC.set('returnValue', 100);
  stateD.set('returnValue', 200);
  var result = obj2.invokeStateMethod('test', 'frozen', 'canuck', function(state, result) {
    numCallbacks += 1;
    callbackInfo['state' + numCallbacks] = state;
    callbackInfo['result' + numCallbacks] = result;
  });
  
  ok(!rootState1.get('testInvoked'), "root state test method should not have been invoked");
  equals(stateC.get('testInvokedCount'), 1, "state C's test method should have been invoked once");
  equals(stateD.get('testInvokedCount'), 1, "state D's test method should have been invoked once");
  
  equals(stateC.get('arg1'), 'frozen', "state C's arg1 method should be 'frozen'");
  equals(stateC.get('arg2'), 'canuck', "state C's arg2 method should be 'canuck'");
  
  equals(stateD.get('arg1'), 'frozen', "state D's arg1 method should be 'frozen'");
  equals(stateD.get('arg2'), 'canuck', "state D's arg2 method should be 'canuck'");
  
  equals(numCallbacks, 2, "callback should have been invoked twice");
  equals(callbackInfo['state1'], stateC, "first callback state arg should be state C");
  equals(callbackInfo['result1'], 100, "first callback result arg should be 100");
  equals(callbackInfo['state2'], stateD, "second callback state arg should be state D");
  equals(callbackInfo['result2'], 200, "second callback result arg should be 200");
  
  equals(result, undefined, "returned result should be undefined");
});

test("check obj2 - invoke method testX", function() {
  rootState2.set('returnValue', 100);
  var result = obj2.invokeStateMethod('testX');
  equals(rootState2.get('testInvokedCount'), 1, "root state's testX method should not have been invoked once");
  equals(result, 100, "result should have value 100");
  ok(!stateA.get('testInvoked'), "state A's test method should have been invoked");
  ok(!stateB.get('testInvoked'), "state B's test method should not have been invoked");
});
});
minispade.register('ember-statechart/~tests/statechart/owner_test', function() {
// ==========================================================================
// SC.Statechart Unit Test
// ==========================================================================
/*globals SC statechart State */

var obj1, rootState1, stateA, stateB, stateX, stateY, stateZ;
var obj2, rootState2, stateC, stateD;
var obj3, rootState3, stateE, stateF;
var owner, owner2;
var TestObject, TestState;

module("SC.Statechart: Change Statechart Owner Property Tests", {
  setup: function() {
    owner = SC.Object.create({
      toString: function() { return "owner"; }
    });
    
    owner2 = SC.Object.create({
      toString: function() { return "owner2"; }
    });
    
    TestState = SC.State.extend({
      accessedOwner: null,
      
      reset: function() {
        this.set('accessedOwner', null);
      },
      
      render: function() {
        this.set('accessedOwner', this.get('owner'));
      }
    });
    
    TestObject = SC.Object.extend(SC.StatechartManager, {
      render: function() {
        this.invokeStateMethod('render');
      }
    });
    
    obj1 = TestObject.extend({
      
      initialState: 'stateA',
      
      stateA: TestState.extend({
        foo: function() {
          this.gotoState('stateB');
        }
      }),
      
      stateB: TestState.extend({
        bar: function() {
          this.gotoState('stateA');
        }
      }),
      
      stateX: TestState.extend({
        initialSubstate: 'stateY',
        
        stateY: TestState.extend({
          initialSubstate: 'stateZ',
          
          stateZ: TestState.extend()
        })
      })

    });
    
    obj1 = obj1.create();
    rootState1 = obj1.get('rootState');
    stateA = obj1.getState('stateA');
    stateB = obj1.getState('stateB');
    stateX = obj1.getState('stateX');
    stateY = obj1.getState('stateY');
    stateZ = obj1.getState('stateZ');  
    
    obj2 = TestObject.extend({
      
      owner: owner,
      
      initialState: 'stateC',
      
      stateC: TestState.extend({
        foo: function() {
          this.gotoState('stateD');
        }
      }),
      
      stateD: TestState.extend({
        bar: function() {
          this.gotoState('stateC');
        }
      })
      
    });
    
    obj2 = obj2.create();
    rootState2 = obj2.get('rootState');
    stateC = obj2.getState('stateC');
    stateD = obj2.getState('stateD');
    
    obj3 = TestObject.extend({
      
      statechartOwnerKey: 'fooOwner',
      
      fooOwner: owner,
      
      initialState: 'stateE',
      
      stateE: TestState.extend({
        foo: function() {
          this.gotoState('stateF');
        }
      }),
      
      stateF: TestState.extend({
        bar: function() {
          this.gotoState('stateE');
        }
      })
      
    });
    
    obj3 = obj3.create();
    rootState3 = obj3.get('rootState');
    stateE = obj3.getState('stateE');
    stateF = obj3.getState('stateF');
  },
  
  teardown: function() {
    obj1 = rootState1 = stateA = stateB = stateX = stateY = stateZ = null;
    obj2 = rootState2 = stateC = stateD = null;
    obj3 = rootState3 = stateE = stateF = null;
    owner = owner2 = null;
    TestObject = TestState = null;
  }
});

test("check obj1 -- basic owner get and set", function() {
  equals(rootState1.get('owner'), obj1, "root state's owner should be obj");
  equals(stateA.get('owner'), obj1, "state A's owner should be obj");
  equals(stateB.get('owner'), obj1, "state B's owner should be obj");
  equals(stateX.get('owner'), obj1, "state X's owner should be obj");
  equals(stateY.get('owner'), obj1, "state Y's owner should be obj");
  equals(stateZ.get('owner'), obj1, "state Z's owner should be obj");
  
  obj1.set('owner', owner);
  
  equals(rootState1.get('owner'), owner, "root state's owner should be owner");
  equals(stateA.get('owner'), owner, "state A's owner should be owner");
  equals(stateB.get('owner'), owner, "state B's owner should be owner");
  equals(stateX.get('owner'), owner, "state X's owner should be owner");
  equals(stateY.get('owner'), owner, "state Y's owner should be owner");
  equals(stateZ.get('owner'), owner, "state Z's owner should be owner");
  
  obj1.set('owner', null);
  
  equals(rootState1.get('owner'), obj1, "root state's owner should be obj");
  equals(stateA.get('owner'), obj1, "state A's owner should be obj");
  equals(stateB.get('owner'), obj1, "state B's owner should be obj");
  equals(stateX.get('owner'), obj1, "state X's owner should be obj");
  equals(stateY.get('owner'), obj1, "state Y's owner should be obj");
  equals(stateZ.get('owner'), obj1, "state Z's owner should be obj");
});

test("check stateA -- access owner via invokeStateMethod", function() {
  ok(stateA.get('isCurrentState'));
  equals(stateA.get('accessedOwner'), null);
  
  obj1.render();
  
  equals(stateA.get('accessedOwner'), obj1);
  
  stateA.reset();
  obj1.set('owner', owner);
  obj1.render();
  
  equals(stateA.get('accessedOwner'), owner);
});

test("check stateZ -- access owner via invokeStateMethod", function() {
  obj1.gotoState(stateZ);
  ok(stateZ.get('isCurrentState'));
  
  equals(stateZ.get('accessedOwner'), null);
  
  obj1.render();
  
  equals(stateZ.get('accessedOwner'), obj1);
  
  stateA.reset();
  obj1.set('owner', owner);
  obj1.render();
  
  equals(stateZ.get('accessedOwner'), owner);
});

test("check obj2 -- statechartOwnerKey", function() {
  equals(rootState2.get('owner'), owner, "root state's owner should be owner");
  equals(stateC.get('owner'), owner, "state C's owner should be owner");
  equals(stateD.get('owner'), owner, "state D's owner should be owner");
  
  obj2.set('owner', null);
  
  equals(rootState2.get('owner'), obj2, "root state's owner should be obj");
  equals(stateC.get('owner'), obj2, "state C's owner should be obj");
  equals(stateD.get('owner'), obj2, "state D's owner should be obj");
});

test("check obj3 -- basic owner get and set", function() {
  equals(obj3.get('statechartOwnerKey'), 'fooOwner', "obj's statechartOwnerKey should be fooOwner");
  equals(obj3.get('fooOwner'), owner, "obj's fooOwner should be owner");
  
  equals(rootState3.get('owner'), owner, "root state's owner should be owner");
  equals(stateE.get('owner'), owner, "state E's owner should be owner");
  equals(stateF.get('owner'), owner, "state F's owner should be owner");
  
  obj3.set('fooOwner', null);
  
  equals(rootState3.get('owner'), obj3, "root state's owner should be obj");
  equals(stateE.get('owner'), obj3, "state E's owner should be obj");
  equals(stateF.get('owner'), obj3, "state F's owner should be obj");
  
  obj3.set('fooOwner', owner2);
  
  equals(rootState3.get('owner'), owner2, "root state's owner2 should be owner2");
  equals(stateE.get('owner'), owner2, "state E's owner2 should be owner2");
  equals(stateF.get('owner'), owner2, "state F's owner2 should be owner2");
  
  ok(obj3.hasObserverFor('fooOwner'));
  equals(rootState3.get('owner'), owner2);
  
  obj3.destroy();
  
  ok(!obj3.hasObserverFor('fooOwner'));
  equals(rootState3.get('owner'), null);
});
});
