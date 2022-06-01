/*
 * Copyright (c) 2018, Oracle and/or its affiliates. All rights reserved.
 */

function CallContext(iid, location, name, receiver, parent){
    this.iid = iid;
    this.location = location;
    this.name = name ? name : 'anonymous';
    this.receiver = receiver;
    this.variableDefs = []
    this.objectAllocations = new Map()
    this.propertyDefs = []
    this.functionInvocations = new Array()
    this.parentContext = parent
}

CallContext.prototype.addInvocation = function(call){
    if (this.functionInvocations === undefined){
        console.log('Undefined for ' + call.toString())
    }
    this.functionInvocations.push(call);
}

CallContext.prototype.isImported = function(){
    return this.location.includes('node_modules');
}

let calls = new Array()
let rootCallContext = new CallContext(1, '', 'program', undefined, undefined); 
let parentContext = new CallContext(1, '', 'program', undefined, rootCallContext); 
let activeCallContext = parentContext;
let lastCall = rootCallContext;
let callStack = new Array();
let functionCalls = new Map();


// do not remove the following comment
// JALANGI DO NOT INSTRUMENT
// Check Jalangi documentation here: https://jacksongl.github.io/files/demo/jalangiff/docs/MyAnalysis.html#putFields
let startTs = Date.now();

(function (sandbox) {
    function DynCG() {

        let cg = new Map();
        let iidToLocation = new Map();
        let lastCallsite = undefined;
        let objectAllocations = new Map()
        let rootCall = undefined;
        let callbacksDisabled = false
    
        /**
        * These callbacks are called after a variable is read or written.
        */
        this.read = function (iid, name, val, isGlobal, isScriptLocal) {

            //console.log(`Read <${iid}, ${name}, ${val}>`)

            return { result: val };
        };

        this.write = function (iid, name, val, lhs, isGlobal, isScriptLocal) {

            //console.log(`Write <${iid}, ${J$.iidToLocation(iid)}, ${name}, ${val}, ${isGlobal}>`)
            if (val)
            return { result: val };
        };

        /**
           * These callbacks are called before and after a property of an object is accessed.
           **/
        this.getFieldPre = function (iid, base, offset, isComputed, isOpAssign, isMethodCall) {
            //console.log(`Get field <${iid}, ${J$.iidToLocation(iid)}, ${base}, ${offset}}>`)
            return { base: base, offset: offset, skip: true };
        };
        this.getField = function (iid, base, offset, val, isComputed, isOpAssign, isMethodCall) {
            return { result: val };
        };

        /**
         * These callbacks are called before a property of an object is written
         **/
        this.putFieldPre = function (iid, base, offset, val, isComputed, isOpAssign) {
            return { base: base, offset: offset, val: val, skip: false };
        };
        this.putField = function (iid, base, offset, val, isComputed, isOpAssign) {
            //console.log(`Setting property ${offset} for object ${base}`)
            return { result: val };
        };

        function addCallee(callsite, callee) {
            callsite = callsite === undefined ? "GraalVM" : callsite;
            cg.has(callsite) ? cg.get(callsite).add(callee) : cg.set(callsite, new Set([callee]));
        }

        /**
         * Invoked before each function invocation, either belonging to the project
         * that is part of a library
         */
        this.invokeFunPre = function (iid, f, base, args, isConstructor, isMethod) {
            let call = new CallContext(iid, J$.iidToLocation(iid), 
                f ? f.name : undefined, base, parentContext);
            //functionCalls.set
            lastCall = call;

    
            //iidToLocation.set(iid, J$.iidToLocation(iid));
            //astCallsite = iid;
            //console.log(base)
        };

        this.invokeFun = function (iid, f, base, args, result, isConstructor, isMethod) {
            lastCallsite = undefined;
        }

        /**
         * Invoked on module entry and on entry to functions that are part of the project.
         * Not invoked for binary/library functions (e.g. Math.*, )
         */
        this.functionEnter = function (iid, func, receiver, args) {

            if (!lastCall.isImported()){
                activeCallContext = lastCall;
                console.log(`Enter (${iid}): ${activeCallContext.name} `);
                callStack.push(activeCallContext);
            } 
            //iidToLocation.set(iid, J$.iidToLocation(iid));
            //addCallee(lastCallsite, iid);

            
            // if (activeCallContext){
            //     calls.push(activeCallContext)
            //     parentContext.addInvocation(activeCallContext)
            //     parentContext = activeCallContext
            // }
        
            //console.log(`*** ${iid} - ${J$.iidToLocation(iid)} - ${func.name} ***`);

            
            
        };

        this.functionExit = function(iid, returnVal, wrappedExceptionVal){
            
            if (!activeCallContext.isImported()){
                console.log(`Exit (${iid}): ${activeCallContext.name}`);
                callStack.pop();
                activeCallContext = callStack[callStack.length - 1];
            } 
            // if (activeCallContext !== undefined){
            //     parentContext = activeCallContext.parent;
            //     console.log(`--- ${iid} - ${activeCallContext.name} ---`)
            //     activeCallContext = parentContext
            // }
        }

        this.endExecution = function () {
            //Output location information
            // iidToLocation.forEach(function (value, key) {
            //     //console.log(`// ${key}: ${value}`);
            // });

            //Output dynamic call graph in Dot format
            //console.log("digraph {");
            // cg.forEach(function (value, key) {
            //     value.forEach(function (callee) {
            //         //console.log(`  ${key} -> ${callee};`);
            //     })
            // });
            //console.log("}");
            // for(let call of calls){
            //     //console.log(`call[${call.iid}, ${call.location}, ${call.name}, ${call.receiver}]`);
            // }

            let endTs = Date.now();
            console.log(`execution duration: ${ (endTs - startTs)/1000}`)
        };

    }

    function disableCallbacks(){
        callbacksDisabled = true
        this.read = undefined
        this.write = undefined
        this.getField = undefined
        this.getFieldPre = undefined
        this.putField = undefined
        this.putFieldPre = undefined
        this.invokeFun = undefined
        this.functionEnter = undefined
        this.functionExit = undefined
    }

    function printCallStack(callStack){
        let result = '';
        for (let call of callStack){
            result += call.name + ', ';
        }
        console.log(result)
    }

    sandbox.addAnalysis(new DynCG(), { excludes: 'node_modules'});
    //sandbox.addAnalysis(new DynCG());
    
})(J$);

