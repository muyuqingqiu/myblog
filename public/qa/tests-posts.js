suite('"posts" Page Tests',function(){
	test('page should contan link to contact page',function(){
		assert($('a[href="/contact"]').length);
	})
})
