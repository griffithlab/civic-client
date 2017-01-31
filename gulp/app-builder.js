var through = require('through2');
var BufferStreams = require("bufferstreams");
var moduleGroups;
var files;
var skipped;
var optionList;
var core;

//Quick method to register a file to a specific app group
//Groups determine the order that files are injected
var add_to_group = function(name, toGroup){
  if (!moduleGroups[toGroup]){
    moduleGroups[toGroup] = [];
  }
  moduleGroups[toGroup].push(name);
};

//resolve the dependencies by recursively adding in groups
//Modules are loaded in the following order:
//Module declarations: angular.module(a, [b,c,d]) --> This file is saved to the 'a' group
//Module dependencies: angular.module(a, [b,c,d]) --> Modules b, c, and d are added to the 'a_deps' group
//Module children: angular.module(a) --> This file is saved to the 'a_child' group
var resolve = function(name, chain) {
  var callChain = chain;
  if (callChain === undefined) {
    callChain = [];
  }
  if (callChain.find(function(elem) { return elem == name;})) {
    console.log("---------Dependency loop detected--------");
    console.log(callChain);
    return [];
  }
  if (moduleGroups[name]) {
    //first add the file for the current module.  This is the file which actually declares the module
    var output = moduleGroups[name];
    if (moduleGroups[name+"_deps"]) { //then recurse to add in its dependencies
      moduleGroups[name+"_deps"].forEach(function(dep_name) {
        output = output.concat(resolve(dep_name, callChain.concat([name])));
      });
    }
    if (moduleGroups[name+"_child"]) { //Then add any files which belong to this module
      output = output.concat(moduleGroups[name+"_child"]);
    }
    if (moduleGroups[name+"_exceptions"]) { //Add any files with user exceptions
      output = output.concat(moduleGroups[name+"_exceptions"]);
    }
    return output;
  }
  return [];
};

//Scan a file and determine which group it belongs to
var scanner = function(path, contents) {
  if (optionList.exclude)
  {
    if (optionList.exclude.reduce(function(value, excPath){
      return value || path.includes(excPath);
    }, false)) return;
  }
  //regex to locate any calls to angular.module()
  //The arguments passed to this call determine what group the file is placed in
  var regex = /(?:angular|ng)(?:.|[\r\n])*?\.module\(((?:.|[\r\n])+?)\)/gmi;
  var raw_modules = contents.toString().match(regex);
  if (!raw_modules){
    //Skip the file if it doesn't belong to any angular module
    skipped.push(path);
    return;
  }
  raw_modules.forEach(function(elem){
    //For every call to angular.module(), find the module name
    var name_regex = /(?:angular|ng)(?:.|[\r\n])*?\.module\((?:.|[\r\n])*?[\'\"]([.\-\/\w]+)[\'\"].*?[,\)]/mi;
    var name = name_regex.exec(elem)[1];

    //And now search for the other arguments passed to angular.module, if any
    var deps_regex = RegExp(name+"[\'\"]([^\)]*)", 'gm');
    var deps = deps_regex.exec(elem);
    if (optionList.override){
      //If the file matches any user exceptions, add it to the appropriate exception group
      var group = Object.keys(optionList.override).reduce(function(value, excPath){
        return value ? value : (path.includes(excPath)? optionList.override[excPath]+"_exceptions" : false);
      }, false);
      if (group) {
        add_to_group(path, group);
      }
    }
    if (!deps[1]){
      //This is a module child
      //The call was angular.module(name)
      add_to_group(path, name+"_child");
    } else {
      //This is a module declaration
      //The call was angular.module(name, [<dependencies...>])
      add_to_group(path, name);

      //Now parse out the names of the dependency modules
      var mods_regex = /[\'\"]([.\-\w\/]+)[\'\"]/gi;
      var dependencies = deps[1].match(mods_regex);
      if (dependencies) {
        dependencies.forEach(function(dep_mod) {
          //And add these modules to the name_deps group
          add_to_group(dep_mod.slice(1,-1), name+"_deps");
        });
      }
    }
  });
};

//The main function
//Returns a through object supporting the gulp streaming api
//coreModule is the name of the angular module which forms the root of the app
//It will be the starting point for resolving the dependency tree
module.exports = function(coreModule, options) {
  moduleGroups = {};
  files = [];
  skipped = [];
  optionList = options || {};
  core = coreModule;
  console.log("Starting up angular app injection");
  return through.obj(
    //The initial handler for files in the stream
    function(file, encoding, callback) {
      //save the vinyl file object for later
      files.push(file);
      if(file.isBuffer()) {
        //If the vinyl file is a buffered type, directly scan its contents
        scanner(file.path, file.contents);
      } else {
        console.log("Streaming: "+file.path);
        //If the vinyl file is a streamed type, build a buffered stream and scan that
        file.contents.pipe(new BufferStreams(function(err, buffer, cb) {
          if(err) return cb(err);
          try {
            scanner(file.path, buffer);
          } catch(e) {
            return cb(e);
          }
        }))
      }
      //Notify gulp that we're done processing the current file
      callback();
    },
    function(callback){
      //The flush handler.  This function is called after every file in the stream
      //has been pushed through the above function.
      //This is the final step before the stream is handed off to the next stage of the pipe
      var streamCaller = this;
      console.log("Skipped files:");
      console.log(skipped);
      console.log("Resolving dependency tree from module: "+core);
      //Resolve the dependency tree for the core module (an array of filepaths)
      resolve(core).forEach(function(filepath) {
        var index = files.findIndex(function(obj) {
          return obj && obj.path == filepath;
        });
        if (index == -1) {
          return;
        }
        //for each filepath in the tree, find it's associated vinyl object that we saved before
        //and push it into the gulp stream for the next plugin to use.
        streamCaller.push(files[index]);
        //Then set that file to null, so the same file can't appear twice in the stream
        files[index] = null;
        return;
      });
      console.log("Completed app injection");
      //finally notify gulp that the flush has completed.
      //The next plugin can begin processing the stream
      callback();
    }
  );
}
