'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var fs = require('fs');
var _ = require('lodash');
var crypto = require('crypto');
var yaml = require('js-yaml');

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

  createObjectName: function() {
    for(let obj of this.props) {
      var path = 'config/samples/sample_object_name.php';
      var tObjectName = fs.readFileSync(this.templatePath('object_name.php')).toString().replace(/%%0%%/g, obj.objectName);
      var array = fs.readFileSync(path).toString().split("\n");

      var last = _.findLastIndex(array, function(n) {
        return n.indexOf('flush') != -1;
      });

      var data = fs.readFileSync(path).toString().split("\n");
      data.splice(last, 0, tObjectName);
      var text = data.join("\n");

      fs.writeFileSync(path, text);
    }
  },

  createRight: function() {
    for(let obj of this.props) {
      var path = 'config/samples/Right.php';
      var tRight = fs.readFileSync(this.templatePath('Right.php')).toString().replace(/%%0%%/g, obj.objectName);
      var array = fs.readFileSync(path).toString().split("\n");

      var last = _.findLastIndex(array, function(n) {
        return n.indexOf('flush') != -1;
      });

      var data = fs.readFileSync(path).toString().split("\n");
      data.splice(last + 1, 0, tRight);
      var text = data.join("\n");

      fs.writeFileSync(path, text);
    }
  },

  createMenu: function() {
    for(let obj of this.props) {
      if(obj.generatePages) {
        var path = 'config/samples/Menu.php';
        var tRight = fs.readFileSync(this.templatePath('Menu.php')).toString().replace(/%%0%%/g, obj.objectName).replace(/%%1%%/g, crypto.randomBytes(20).toString('hex'));
        var array = fs.readFileSync(path).toString().split("\n");

        var last = _.findLastIndex(array, function(n) {
          return n.indexOf('flush') != -1;
        });

        var data = fs.readFileSync(path).toString().split("\n");
        data.splice(last + 1, 0, tRight);
        var text = data.join("\n");

        fs.writeFileSync(path, text);
      }
    }
  },

  parseYML: function() {
    for(let obj of this.props) {
      obj.data = {id: {}, fields: [], oneToMany: [], manyToOne: [], manyToMany: []};
      var path = 'config/yml/' + obj.name;

      var doc = yaml.safeLoad(fs.readFileSync(path, 'utf8'));

      for (let elm in doc) {

        for(let id in doc[elm]['id']) {
          obj.data.id = {name: id, camel: _.chain(id).camelCase().capitalize().value(), type: doc[elm]['id'][id]['type']}
        }

        for(let field in doc[elm]['fields']) {
          var type = doc[elm]['fields'][field]['type'];

          if(type.indexOf('string') != -1) {
            type = "string";
          } else if(type.indexOf('text') != -1) {
            type = "text";
          } else if(type.indexOf('int') != -1) {
            type = "integer";
          } else if(type.indexOf('float') != -1 || type.indexOf('double') != -1) {
            type = "float";
          } else if(type.indexOf('boolean') != -1) {
            type = "boolean";
          }  else if(type.indexOf('datetime') != -1) {
            type = "datetime";
          } else if(type.indexOf('date') != -1) {
            type = "date";
          } else {
            throw "Format Indisponible : " + type;
          }

          obj.data.fields.push({name: field, camel: _.chain(field).camelCase().capitalize().value(), type: type})
        }

        for(let field in doc[elm]['oneToMany']) {
          obj.data.oneToMany.push({name: field, camel: _.chain(field).camelCase().capitalize().value(), relation: doc[elm]['oneToMany'][field]['targetEntity']});
        }

        for(let field in doc[elm]['manyToOne']) {
          obj.data.manyToOne.push({name: field, camel: _.chain(field).camelCase().capitalize().value(), relation: doc[elm]['manyToOne'][field]['targetEntity']});
        }

        for(let field in doc[elm]['manyToMany']) {
          obj.data.manyToMany.push({name: field, camel: _.chain(field).camelCase().capitalize().value(), relation: doc[elm]['manyToMany'][field]['targetEntity']});
        }
      }
    }
  },

  createSerialize: function() {
    for(let obj of this.props) {
      var file = fs.readFileSync(this.templatePath('Serialize/header.php')).toString().split("\n");

      for(let mto of obj.data.manyToOne) {
        file.push('require_once(dirname(__FILE__) . "/' + mto.relation + 'Serialize.php");');
      }

      file.push(fs.readFileSync(this.templatePath('Serialize/class_header.php')).toString().replace(/%%0%%/g, obj.objectName));

      file.push("      '" + obj.data.id.name + "' => $data->get" + obj.data.id.camel + "(),");

      for(let field of obj.data.fields) {
        file.push("      '" + field.name + "' => $data->get" + field.camel + "(),");
      }

      for(let mto of obj.data.manyToOne) {
        file.push(`      '${mto.name}' => ($data->get${mto.camel}()) ? (new ${mto.relation}Serialize())->toJson($data->get${mto.camel}()) : array(),`);
      }

      file.push(fs.readFileSync(this.templatePath('Serialize/middle.php')).toString());

      for(let field of obj.data.fields) {
        file.push(`        case "${field.name}":`);

        if(field.type == "boolean") {
          file.push(`          $object->set${field.camel}(TypeUtils::parseBoolean($data[$d]));`);
        } else {
          file.push(`          $object->set${field.camel}($data[$d]);`);
        }

        file.push(`          break;`);
      }

      for(let mto of obj.data.manyToOne) {
        file.push(`        case "${mto.name}_id":`);
        file.push(`          $relation = RecordUtils::get_one_obj("${mto.relation}", $data[$d]);`);
        file.push(`          $object->set${mto.camel}($relation);`);
        file.push(`          break;`);
      }

      file.push(fs.readFileSync(this.templatePath('Serialize/end.php')).toString());

      file = file.join("\n");

      fs.writeFileSync("config/serialize/" + obj.objectName + "Serialize.php", file);
    }
  },

  createRest: function() {
    for(let obj of this.props) {
      var file = fs.readFileSync(this.templatePath('rest.php')).toString().replace(/%%0%%/g, obj.objectName);
      fs.writeFileSync("rest/" + obj.objectName + ".php", file);
    }
  },

  createPartials: function() {
    for(let obj of this.props) {
      if(obj.generatePages) {
        fs.writeFileSync("partials/" + obj.objectName + "/detail.html");
        fs.writeFileSync("partials/" + obj.objectName + "/liste.html");
      }
    }
  },

  createJs: function() {
    for(let obj of this.props) {
      if(obj.generatePages) {
        fs.writeFileSync("js/" + _.camelCase(obj.objectName) + ".js");
      }
    }
  },

});
