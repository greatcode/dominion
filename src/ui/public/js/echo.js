// @flow
/* global Handlebars, prompt */
"use strict";

declare var Handlebars: any

// The client-side "app" which leverages the shared Handlebars "echo" template.
// This will prompt the user for a message, then echo it out by rendering the
// message using the shared template which was exposed by the server.
(function () {
  const button = document.getElementById("say");
  if (!button) {
    return
  }

  button.addEventListener("click", function (e: Event) {
    const message = prompt("Say Something:", "Yo yos");
    const echo = document.createElement("div");

    echo.innerHTML = Handlebars.templates.echo({ message });

    if (!document.body) {
      return
    }
    document.body.appendChild(echo);
  }, false);
}());
