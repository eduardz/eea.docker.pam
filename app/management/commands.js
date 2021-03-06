var elastic_settings = require('nconf').get('elastic');

var esAPI = require('eea-searchserver').esAPI;

var analyzers = require('./river_config/analyzers.js');
var config = require('./river_config/config.js');

var syncReq = {
    "type": "eeaRDF",
    "eeaRDF" : {
        "endpoint" : config.endpoint,
        "queryType" : config.queryType,
        "query" : config.query,
        "addLanguage" : false,
        "includeResourceURI" : false
    },
    "index" : {
        "index" : elastic_settings.index,
        "type" : elastic_settings.type
    }
};

function getOptions() {
    var nconf = require('nconf')
    var elastic = nconf.get()['elastic'];
    return {
        'es_host': elastic.host + ':' + elastic.port + elastic.path
    };
}

var analyzers = analyzers.mappings;

var callback = function(text) {
    return function(err, statusCode, header, body) {
        console.log(text);
        if (err) {
            console.log(err.message);
        } else {
            console.log('  Successfuly ran query');
            console.log('  ResponseCode: ' + statusCode);
            console.log('  ' + body);
        }
    };
}

function removeData() {
    var elastic = require('nconf').get('elastic');
    new esAPI(getOptions())
        .DELETE(elastic.index, callback('Deleting index! (if it exists)'))
        .execute();
}

function reindex() {
    createIndex();
}

function createIndex() {
    var elastic = require('nconf').get('elastic');
    new esAPI(getOptions())
            .indexFromQuery(config.endpoint, config.queryTemplate, null, elastic, analyzers);
}


function showHelp() {
    console.log('List of available commands:');
    console.log(' runserver: Run the app web server');
    console.log('');
    console.log(' create_index: Setup Elastic index and trigger indexing');
    console.log(' reindex: Remove data and recreate index');
    console.log('');
    console.log(' remove_data: Remove the ES index of this application');
    console.log('');
    console.log(' help: Show this menu');
    console.log('');
}

module.exports = { 
    'remove_data': removeData,
    'reindex': reindex,
    'create_index': createIndex,
    'help': showHelp
}
