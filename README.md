# vuepress-plugin-jsonld-playground

[playground]: https://json-ld.org/playground
[vuepress]: https://vuepress.vuejs.org

A vuepress plug-in to embed a component similar to [JSON-LD Playground][playground] into a [vuepress] book.

## Usage

*.vuepress/config.js*
~~~js
module.exports = {
    ...
    ,plugins: [
      'vuepress-plugin-jsonld-playground'
    ]
}
~~~


*document.md*
~~~md
Some markdown text or some html markup
<json-ld>
{
    "@context": {
        "@vocab": "https://my.org/vocabulary"
    },
    "@id": "1",
    "prop1": "value1",
    "prop2": "value2"
}
</json-ld>
~~~

### Attributes

You may use the `<json-ld>` element with the following attributes like `<element attr="...">`:

- `view` to pre-select a particular view.
  - Valid values are: `compacted | expanded | flattened | rdf | framed`
  - Default: `"compacted"`
- `inputLabel`  to change the default label for editable text area 1
  - Default: `"JSON-LD Document 1"`
- `inputLabel2` to change the default label for editable text area 2
  - Default: `"JSON-LD Document 2"`
- `outputLabel` to change the default label for readonly output text area
  - Default: `"Output"`
- `frameLabel`  to change the default label for editable *frame* text area
  - Default: `"JSON-LD Frame (Matching & Mapping)"`

> **Important:** For some yet to be understood reason `<json-ld>` cannot be the first element of a new paragraph.
>
> ~~~md
> Some text
>          <-- Entering a new Markdown paragraph doesn't work.
> <json-ld>
> ...
> ~~~
>
> ~~~md
> Some text
>          <-- Works when prepending HTML or text.
> <span></span>
> <json-ld>
> ...
> ~~~

## Advanced Uses

### Framing
~~~md
<json-ld view="framed">
{
    "@context": {
        "@vocab": "https://my.org/vocabulary"
    },
    "@id": "1",
    "prop1": "value1",
    "prop2": "value2"
}
<template v-slot:frame>
{
    "@context": {
        "@vocab": "https://my.org/vocabulary"
    },
    "prop1": ""
}
</template>
</json-ld>
~~~

### Framing two Datasources

In *framed* view we can provide a second JSON-LD document. Then the component internally combines both input documents and expands them into a single JSON-LD graph before applying the given Frame to the combined data graph:

~~~js
jsonld
   .expand([input, input2])
   .then( expanded => jsonld.frame(expanded, frame, { embed: "@always" }) );
~~~

This option aims at demonstrating a data integration scenario which involves more than one data source.

~~~md
<json-ld view="framed">
{
    "@context": {
        "@vocab": "https://my.org/vocabulary"
    },
    "@id": "1",
    "prop1": "value1",
    "prop2": "value2"
}
<template v-slot:data2>
{
    "@context": {
        "@vocab": "https://my.org/vocabulary"
    },
    "@id": "1",
    "prop3": "value3"
}
</template>
<template v-slot:frame>
{
    "@context": {
        "@vocab": "https://my.org/vocabulary"
    },
    "prop1": ""
}
</template>
</json-ld>
~~~
