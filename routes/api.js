var express = require('express');
var router = express.Router();
var xlsx = require('node-xlsx');
var fs = require('fs');

//xls下载测试
router.get('/', function(req, res, next) {
	function writeXls(datas) {
		var buffer = xlsx.build([{
			"name": "Group",
			"data": datas
		}]);
		fs.writeFileSync("./public/xlsx/Group.csv", buffer, 'binary');
	}

	function parseXls() {
		var obj = xlsx.parse('myFile.xlsx');
		console.log(obj);
	}
	var datas = [{
			name: 'aaa',
			age: 10
		},
		{
			name: 'bbb',
			age: 20
		},
		{
			name: 'ccc',
			age: 30
		}
	];
	var myDatas = [];
	for(var index in datas) {
		var account = datas[index];
		var colum = [];
		var names;
		if(index == 0) {
			names = [];
		}
		for(var index2 in account) {
			if(index == 0)
				names.push(index2);
			var value = account[index2];
			if(value == null) {
				value = "";
			}
			colum.push(value);
		}
		if(index == 0) {
			myDatas.push(names);
		}
		myDatas.push(colum);

		if(index == datas.length - 1) {
			writeXls(myDatas);
		}
	}
	return res.download('./public/xlsx/Group.csv', 'test.xlsx', function(err) {
		console.log(err);
	})
})

module.exports = router;