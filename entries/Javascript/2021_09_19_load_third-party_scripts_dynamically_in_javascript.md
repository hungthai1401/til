---
title: Load Third-Party scripts dynamically in Javascript
category: Javascript
date: 2021-09-19
---

The trick is to create the `<script></script>` tag loading the library on the fly and inject it into the DOM only when we need it.

Here's the gist of it:

```js
export const loadDynamicScript = (scriptId, url, callback) => {
  const existingScript = document.getElementById(scriptId);

  if (!existingScript) {
    const script = document.createElement("script");
    script.src = url; // URL for the third-party library being loaded.
    script.id = scriptId; // e.g., googleMaps or stripe
    document.body.appendChild(script);

    script.onload = () => {
      if (callback) callback();
    };
  }

  if (existingScript && callback) callback();
};
```

This is example that loading a Cognito Form in Vue Component (I am using Vue v2.x):

```js
<template>
  <div class="cognito"></div>
</template>

<script>
import { loadDynamicScript } from "./utils";

export default {
  name: "cognito-form",
  mounted() {
    loadDynamicScript(
      "cognito-form",
      "https://www.cognitoforms.com/s/w_y_ia_Yc0armBlWrmCGmg",
      () => Cognito.load("forms", { id: "3" }),
    );
  },
};
</script>
```

Refs:

- https://cleverbeagle.com/blog/articles/tutorial-how-to-load-third-party-scripts-dynamically-in-javascript
