var _ = require('lodash');
var exec = require('child_process').exec;
var path = require('path');
var quickTemp = require('quick-temp');
var rsvp = require('rsvp');

function run(cmdLine, options) {
  return new rsvp.Promise(function(resolve, reject) {
    exec(cmdLine, {cwd: options.cwd}, function(err, stdout, stderr) {
      if (err) {
        err.message = '[broccoli-cmd] failed while executing command line\n' +
                      '[broccoli-cmd] Working directory:\n' + options.cwd + '\n' +
                      '[broccoli-cmd] Executed:\n' + cmdLine + '\n' +
                      '[broccoli-cmd] stdout:\n' + stdout + '\n' +
                      '[broccoli-cmd] stderr:\n' + stderr + '\n';

        return reject(err);
      }

      resolve();
    });
  });
}

var CmdLine = function(inputTree, options) {
  if (!(this instanceof CmdLine)) {
    return new CmdLine(inputTree, options);
  }

  this.inputTree = inputTree;
  this.options = options || {};
};

CmdLine.prototype.read = function(readTree) {
  var options = this.options;
  var destDir = quickTemp.makeOrRemake(this, 'tmpDestDir');

  return rsvp.Promise.resolve(readTree(this.inputTree).then(function (srcDir) {
      srcDir = path.resolve(srcDir);

      var cmdLine = _.template('"' + options.cmd + '" ' + options.arguments, {
        options: options,
        srcDir: srcDir,
        destDir: destDir
      });

      return run(cmdLine, options);
    }))
    .then(function() {
      return destDir;
    });
};

CmdLine.prototype.cleanup = function() {
  quickTemp.remove(this, 'tmpDestDir');
};

module.exports = CmdLine;
