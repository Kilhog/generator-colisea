'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var fs = require('fs');
var _ = require('lodash');

module.exports = yeoman.generators.Base.extend({

  askModel: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the riveting ' + chalk.red('Colisea') + ' generator!'
    ));

    var files = fs.readdirSync('config/yml');

    var prompts = [{
      type: 'checkbox',
      name: 'ymlModels',
      message: 'What model generate ?',
      choices: _.reject(files, function(f) { return f == "index.php" })
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      done();
    }.bind(this));
  },

  writing: function () {
    //this.fs.copy(
    //  this.templatePath('dummyfile.txt'),
    //  this.destinationPath('dummyfile.txt')
    //);
  },

  install: function () {
    //this.installDependencies();
  }
});
