# angular-selector-on-steroids
A simple module/ plugin authoring boilerplate which bundles using webpack.
The bundler generates a single output file which holds all references and dependecies, styles and module code, which makes it easy to import and use.

### Caveat:
I have named the boilerplate rx(y) as I tend to favour RxJS(5) - https://github.com/Reactive-Extensions/RxJS a lot.

## Installation
You can install into your application by running 

```
npm install --save angular-selector-on-steroids
```

You can then use it like so:

```js
import RxyTsModulePluginBoilerplate from '../src/index';

const dom = {
  dataDom: document.querySelector('#dataDom')
};

const text = new RxyTsModulePluginBoilerplate().greetUser(`Newton!`);
dom.dataDom.textContent = text;
```

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Sandbox</title>

        <style>
            html,
            body {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
                width: 100%;
                height: 100%;
                min-height: 100%;
            }
        </style>
    </head>
    <body>
        <main id='dataDom'>
        </main>
    </body>
</html>
```


### Development

- npm install
- npm run build - generates the demo/dist directory for local development.
- npm run build-prod - generates a dist directory ready for publishing.
- npm run dev - builds and watches both source and sandbox directory for local development.
- npm run serve - boots up a http-server and serves the demo directory.
