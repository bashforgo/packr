@{%
const s = require('./search.grammar.ts')
%}

main -> _ words _
        {% s.nth(1) %}

words -> word (
           __ word
           {% s.nth(1) %}
         ):*
         {% s.concat %}

word -> keyword
        {% s.keyword %}
      | nonkeyword
        {% s.word %}

nonkeyword -> ws
              {% s.predicate(s.isBinary, true) %}

keyword -> binary
           {% id %}
         | ranged
           {% id %}

binary -> rarityKeyword
          {% s.rarityQuery %}
        | etcKeyword
          {% s.etcQuery %}

etcKeyword -> ws
              {% s.predicate(s.isEtc) %}

rarityKeyword -> ws
                 {% s.predicate(s.isRarity) %}

ranged -> rangedKeyword ":" range
          {% s.rangedQuery %}

rangedKeyword -> ws
                 {% s.predicate(s.isRanged) %}

range -> (single | up | down | double)
         {% s.idId %}

single -> number
          {% s.ranged('single', 0) %}

up -> number "+"
      {% s.ranged('up', 0) %}

down -> number "-"
        {% s.ranged('down', 0) %}

double -> number "-" number
          {% s.ranged('double', 0, 2) %}

number -> [0-9]
          {% s.number %}
        | [1-9] [0-9]
          {% s.numberNumber %}

ws -> [\w]:+
      {% s.join %}

_ -> " ":*
     {% s.noop %}
__ -> " ":+
      {% s.noop %}
