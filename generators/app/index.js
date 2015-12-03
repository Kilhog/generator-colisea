'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var fs = require('fs');
var _ = require('lodash');

module.exports = yeoman.generators.Base.extend({

  intro: function() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the riveting ' + chalk.red('Colisea') + ' generator!'
    ));
  },

  askModel: function () {
    var done = this.async();

    var files = fs.readdirSync('config/yml');

    var prompts = [{
      type: 'checkbox',
      name: 'ymlModels',
      message: 'What model generate ?',
      choices: _.reject(files, function(f) { return f == "index.php" })
    }];

    this.prompt(prompts, function (props) {
      this.props = _.map(props.ymlModels, function(o, i) {return {id: i, name: o}});
      done();
    }.bind(this));
  },

  askObjectName: function() {
    var done = this.async();

    var prompts = _.map(this.props, function(o) {
      return {
        type: 'input',
        name: o.id.toString(),
        message: 'What object name for ' + o.name + ' ?',
        default: o.name.replace('.dcm.yml', '')
      }
    });

    this.prompt(prompts, function (props) {
      this.props = _.merge(this.props, _.map(props, function(o) {return {objectName: o}}));
      done();
    }.bind(this));
  },

  askPages: function() {
    var done = this.async();

    var prompts = _.map(this.props, function(o) {
      return {
        type: 'confirm',
        name: o.id.toString(),
        message: 'Generate pages for ' + o.name + ' ?',
        default: true
      }
    });

    this.prompt(prompts, function (props) {
      this.props = _.merge(this.props, _.map(props, function(o) {return {generatePages: o}}));
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
