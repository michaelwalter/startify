# Zestaw komponentów oraz reguł stosowanych w projekcie

Ten dokument opisuje elementy, reguły oraz wszelkiego rodzaju wytyczne stosowane w projekcie.

Generowany jest on automatycznie na podstawie specjalnych bloków komentarzy dodawanych do plików ze stylami, w których wskazane są również ścieżki do plików HTML (Ember/Nunjucks/Jade) odpowiadająych im komponentów.

Format w jakim tworzone powinny być komentarze opisany jest w dokumentacji biblioteki **[KSS spec](https://github.com/kss-node/kss/blob/spec/SPEC.md)**.

Poniżej znajduje się przykład zastosowania komentarzy KSS:
<pre class="prettyprint linenums lang-css"><code data-language="css">/*
Button

Standardowy przycisk na stronie

:hover - stan przycisku po najechaniu na niego kursorem myszy
.btn--danger - wygląd przycisku odpowiadającego za wyjątkowo znaczące akcje

Markup: button.njk

Style guide: components.button
*/
.btn {
  ...
}
.btn.btn--danger {
  ...
}
</code></pre>
