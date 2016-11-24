var add = require('../lib/add.js');
var expect = require('chai').expect;
suite('Add tests',function(){
	test('add() should return number',function(){
		expect(add.addNum(1,2) === 3);
	})
})
