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

  askModel: function() {
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

  creationObjectName: function() {

    var plop = `
      $object_name = new Base\\ObjectName();
      $object_name->setName("PhaseEtat");
      $object_name->setTitle("PhaseEtat");
      $object_name->setDescription("Gestion des PhaseEtat");
      $object_name->setModuleId($module_sample_object->getId());
      $em->persist($object_name);
    `;


    var data = fs.readFileSync("config/samples/sample_object_name.php").toString().split("\n");
    data.splice(129, 0, plop);
    var text = data.join("\n");

    fs.writeFile("config/samples/sample_object_name.php", text, function (err) {
      if (err) return console.log(err);
    });


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
