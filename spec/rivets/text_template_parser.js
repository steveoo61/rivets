describe('Parsers', function () {
  describe("parseTemplate()", function() {
    it("tokenizes a text template", function() {
      template = "Hello {{ user.name }}, you have {{ user.messages.unread | length }} unread messages."

      expected = [
        {type: 0, value: "Hello "},
        {type: 1, value: "user.name"},
        {type: 0, value: ", you have "},
        {type: 1, value: "user.messages.unread | length"},
        {type: 0, value: " unread messages."}
      ]

      results = parsers.parseTemplate(template, ['{{', '}}'])
      results.length.should.equal(5)

      for (i = 0; i < results.length; i++) {
        results[i].type.should.equal(expected[i].type)
        results[i].value.should.equal(expected[i].value)
      }
    })

    describe("with no binding fragments", function() {
      it("should return a single text token", function() {
        template = "Hello World!"
        expected = [{type: 0, value: "Hello World!"}]

        results = parsers.parseTemplate(template, ['{{', '}}'])
        results.length.should.equal(1)

        for (i = 0; i < results.length; i++) {
          results[i].type.should.equal(expected[i].type)
          results[i].value.should.equal(expected[i].value)
        }
      })
    })

    describe("with only a binding fragment", function() {
      it("should return a single binding token", function() {
        template = "{{ user.name }}"
        expected = [{type: 1, value: "user.name"}]

        results = parsers.parseTemplate(template, ['{{', '}}'])
        results.length.should.equal(1)

        for (i = 0; i < results.length; i++) {
          results[i].type.should.equal(expected[i].type)
          results[i].value.should.equal(expected[i].value)
        }
      })
    })
  })

  describe('parseType', function () {
    it('parses string primitives', function () {
      var token = parsers.parseType('"TEST"');
      token.type.should.equal(0);
      token.value.should.equal('TEST');

      token = parsers.parseType("'hello'");
      token.type.should.equal(0);
      token.value.should.equal('hello');

      //token = parsers.parseType('');
      //token.type.should.equal(0);
      //token.value.should.equal('');
    });

    it('parses number primitives', function () {
      var token = parsers.parseType('3');
      token.type.should.equal(0);
      token.value.should.equal(3);

      token = parsers.parseType("3.14");
      token.type.should.equal(0);
      token.value.should.equal(3.14);
    });

    it('parses boolean primitives', function () {
      var token = parsers.parseType('true');
      token.type.should.equal(0);
      token.value.should.equal(true);

      token = parsers.parseType("false");
      token.type.should.equal(0);
      token.value.should.equal(false);
    });

    it('parses pathes', function () {
      var token = parsers.parseType('path');
      token.type.should.equal(1);
      token.value.should.equal('path');

      token = parsers.parseType("dotted.path");
      token.type.should.equal(1);
      token.value.should.equal('dotted.path');

      token = parsers.parseType("3a");
      token.type.should.equal(1);
      token.value.should.equal('3a');
    });
  })
});
