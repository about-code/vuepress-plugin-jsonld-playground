<script src="./json-ld.vue.js"></script>
<style src="./json-ld.vue.css"></style>
<template>
  <div id="comp">
    <div v-if="!message" class="message valid">
      <span class="button" v-on:click="formatInput()">Format</span>
      <strong>Tip:</strong> Use JSON with a <a href="https://json-ld.org">JSON-LD</a> context, e.g.:
      <code>{ "@context": { "@vocab": "https://my.org/" }, ... }</code>
    </div>
    <div v-else="message" class="message invalid">
      {{message}}
    </div>
    <!-- TOOLBAR -->
    <fieldset class="toolbar">
      <input type="radio" id="compacted" value="compacted" v-model="mode" ><label v-bind:class="{ active: mode == 'compacted'}" for="compacted">Compacted</label>
      <input type="radio" id="expanded" value="expanded" v-model="mode"   ><label v-bind:class="{ active: mode == 'expanded'}" for="expanded">Expanded</label>
      <input type="radio" id="flattened" value="flattened" v-model="mode" ><label v-bind:class="{ active: mode == 'flattened'}" for="flattened">Flattened</label>
      <input type="radio" id="rdf" value="rdf" v-model="mode"             ><label v-bind:class="{ active: mode == 'rdf'}" for="rdf">RDF Triples</label>
      <input type="radio" id="framed" value="framed" v-model="mode"       ><label v-bind:class="{ active: mode == 'framed'}" for="framed">Framed (Data Integration)</label>
      <span class="separator"></span>
      <span class="right">
        <input type="radio" id="rows" value="rows" v-model="layout"><label for="rows" v-bind:class="{ active: layout == 'rows'}">Rows</label>
        <input type="radio" id="cols" value="cols" v-model="layout"><label for="cols" v-bind:class="{ active: layout == 'cols'}">Columns</label>
      </span>
    </fieldset>
    <!-- 2x1 GRID -->
    <div v-if="mode != 'framed'" class="form layout" v-bind:class="{
        rows:    layout == 'rows' && mode != 'rdf',
        columns: layout == 'cols' || mode == 'rdf'
    }">
      <div class="cell">
        <label for="jsonldInput">{{$attrs.data || "Datasource 1"}}</label>
        <textarea id="jsonldInput" name="value" autocomplete="true" v-model="jsonldInput"></textarea>
      </div>
      <div class="cell">
        <label for="jsonldProcessed">Output</label>
        <textarea id="jsonldProcessed" name="jsonld" autocomplete="true" wrap="off" readonly
          :value="jsonldProcessed"></textarea>
      </div>
      <div class="cell2" v-if="mode == 'rdf'">
        <table>
          <tr>
            <th>Subject<br />(@base + @id)</th>
            <th>Predicate<br />(@vocab + properties)</th>
            <th>Object<br />(values / @vocab + @type)</th>
            <th>Datatype</th>
            <th>Lang</th>
          </tr>
          <tr v-for="rdf in rdfStatements">
            <td><a v-if="(s = rdf.subject.value)   && !!s.match('http')" :href="s">{{s}}</a><span v-else>{{s}}</span></td>
            <td><a v-if="(p = rdf.predicate.value) && !!p.match('http')" :href="p">{{p}}</a><span v-else>{{p}}</span></td>
            <td><a v-if="(o = rdf.object.value)    && !!o.match('http')" :href="o">{{o}}</a><span v-else>{{o}}</span></td>
            <td class="small"><a v-if="(d = rdf.object.datatype)" :href="d.value">{{d.value}}</a></td>
            <td>{{rdf.object.language}}</td>
          </tr>
        </table>
      </div>
    </div>
    <!-- 4x4 GRID -->
    <div v-else="mode == 'framed'" class="form layout columns">
      <div class="cell">
        <label for="jsonldInput">{{$attrs.data || "Datasource 1"}}</label>
        <textarea id="jsonldInput" name="value" v-model="jsonldInput"></textarea>
      </div>
      <div class="cell">
        <label for="jsonldFrame">{{$attrs.frame || "JSON-LD Frame (Matching & Mapping)"}}</label>
        <textarea id="jsonldFrame" name="frame" v-model="jsonldFrame"></textarea>
      </div>
      <div class="cell">
        <label for="jsonldInput2">{{$attrs.data2 || "Datasource 2 (Optional)"}}</label>
        <textarea id="jsonldInput2" name="value" v-model="jsonldInput2"></textarea>
      </div>
      <div class="cell">
        <label for="jsonldProcessed">{{$attrs.framed || "Output"}}</label>
        <textarea id="jsonldProcessed" name="jsonld" wrap="off" readonly :value="jsonldProcessed"></textarea>
      </div>
    </div>
    <!-- FOOTER -->
    <div class="footer">
      See also:
      <span class="separator"></span>
      <a href="https://json-ld.org/playground/">JSON-LD Playground</a> (may uses different settings)
      <span class="separator">or</span>
      <a href="https://www.w3.org/TR/json-ld/">JSON-LD Recommendation</a>
      <span class="separator">or</span>
      <a href="https://w3c.github.io/json-ld-bp/">Best Practices</a>
      <span class="right">&copy; 2021 Andreas Martin</span>
    </div>
  </div>
</template>
