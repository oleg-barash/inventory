/**
 * Created by Барашики on 07.04.2017.
 */
import express  from 'express';
import React    from 'react';
import ReactDom from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import routes from './routes';
import { CookiesProvider } from 'react-cookie';
import cookiesMiddleware from 'universal-cookie-express'
const app = express();
app.use(express.static('www'));
app.use(cookiesMiddleware());
app.use((req, res) => {
    match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
          if (redirectLocation) { // Если необходимо сделать redirect
                return res.redirect(301, redirectLocation.pathname + redirectLocation.search);
              }

          if (error) { // Произошла ошибка любого рода
               return res.status(500).send(error.message);
              }

          if (!renderProps) { // Мы не определили путь, который бы подошел для URL
                return res.status(404).send('Not found');
              }
          const componentHTML = ReactDom.renderToString(<CookiesProvider cookies={req.universalCookies}>
              <RouterContext {...renderProps } />
            </CookiesProvider>);

          return res.end(renderHTML(componentHTML));
         });
});

function renderHTML(componentHTML) {
    return `
    <!doctype html>
<html class="no-js" lang="">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Инвентаризация АЭКО</title>
  <meta name="description" content="ПО для проведения инвентаризации">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1, user-scalable=0, maximum-scale=1, minimum-scale=1"
  >
<link href="http://diegoddox.github.io/react-redux-toastr/4.4/react-redux-toastr.min.css" rel="stylesheet" type="text/css">
  <link rel="stylesheet" type="text/css" href="${process.env.ASSETS_URL}main.css">
</head>

<body>
  <div id="app"></div>
  <!-- This script adds the Roboto font to our project. For more detail go to this site:  http://www.google.com/fonts#UsePlace:use/Collection:Roboto:400,300,500 -->
  <script>
    var WebFontConfig = {
      google: { families: [ 'Roboto:400,300,500:latin' ] }
    };
    (function() {
      var wf = document.createElement('script');
      wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
      wf.type = 'text/javascript';
      wf.async = 'true';
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(wf, s);
    })();
  </script>
  <script src="${process.env.ASSETS_URL}client.js">${componentHTML}</script>
</body>`;
}

app.listen(process.env.PORT, '0.0.0.0', () => {
    console.log(`Server listening on: ${process.env.PORT}`);
});