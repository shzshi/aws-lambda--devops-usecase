var assert = require('assert');
var request = require('request');
var fs = require('fs');

describe('Create, Read, Delete', function() {
	this.timeout(5000);
    it('should create a new task, read it, & delete it', function(done) {
		// Build and log the path
		var path = process.env.TASKS_ENDPOINT + "/mytasks";

		// Fetch the comparison payload
		require.extensions['.txt'] = function (module, filename) {
		    module.exports = fs.readFileSync(filename, 'utf8');
		}
		var desiredPayload = require("./data/newTask1.json");

		// Create the new task
		var options = {'url' : path, 'form': JSON.stringify(desiredPayload)};
 		request.post(options, function (err, res, body){
			if(err){
				throw new Error("Create call failed: " + err);
			}
			assert.equal(200, res.statusCode, "Create Status Code != 200 (" + res.statusCode + ")");
			var task = JSON.parse(res.body);
			// Read the item
			var specificPath = path + "/" + task.id;
			request.get(path, function (err, res, body){
				if(err){
					throw new Error("Read call failed: " + err);
				}
				assert.equal(200, res.statusCode, "Read Status Code != 200 (" + res.statusCode + ")");

				var taskList = JSON.parse(res.body);
				if(taskList.text = desiredPayload.text)	{
					// Item found, delete it
		 			request.del(specificPath, function (err, res, body){
						if(err){
							throw new Error("Delete call failed: " + err);
						}
						assert.equal(200, res.statusCode, "Delete Status Code != 200 (" + res.statusCode + ")");
						done();
		  			});
				} else {
					// Item not found, fail test
					assert.equal(true, false, "New item not found in list.");
					done();
				}
			});
  		});
    });
});
