<!-- omit in toc -->
# HOTH 8 Workshop: Introduction to Servers

**Teachers**: [Timothy Gu](https://github.com/TimothyGu), [Jamie Liu](https://github.com/jamieliu386)

<!-- omit in toc -->
## Resources

- [Slides](https://docs.google.com/presentation/d/1h6KdlwfDfh8SBBBxGMGJb0OhJ5vSLsI2L9Zz3Yn7BR0/edit#slide=id.gb62b40d382_0_5)


<!-- omit in toc -->
## What we'll be learning today
- [What is a Server?](#what-is-a-server)
- [HTTP](#http)
  - [HTTP Requests](#http-requests)
    - [Parts of a URL](#parts-of-a-url)
    - [The GET Method](#the-get-method)
    - [The POST Method](#the-post-method)
  - [HTTP Responses](#http-responses)
    - [HTTP Status Codes](#http-status-codes)
- [What is Node.js?](#what-is-nodejs)
- [Express](#express)
- [Demo](#demo)
  - [Plain Text Response](#plain-text-response)
  - [HTML Response](#html-response)
  - [POST request](#post-request)

## What is a Server?

Say we made a website called Instascam, and wanted to show our friends. We
could run the code on our computer and show it to them. However, we are being
responsible and socially distancing, so we'll have to use another method.

Another possibility could be sending them all the code through email, Google
Drive, or even GitHub. However, this is inconvenient for a number of reasons.
First, our source code might be pretty large, and it would be a hassle to send
it to them for them to download. We'd also need to give them instructions on
how to run the project, which might require them to install a bunch of stuff.

How can we work around this issue? We can put our code on a **server**!
(Remember, a server is really just a computer.) This way, all we need to do is
give our friends the URL, and they can request the site from the server without
having to download the code and run it.

![](images/client_server.png)

---

Way back in [session 1 of Hackschool](https://github.com/uclaacm/hackschool-f20/tree/main/session-1-intro-to-html-css),
we learned that when you type a URL in the browser and press "Enter", your
computer makes a request to a server to get the files for the webpage.

Let's see an example! Imagine that we want to look at the
[UCLA Memes for Sick AfTweens FB group](https://www.facebook.com/groups/UCLAmemes/)
to laugh about the pain of midterms/finals. When we click on the link to the
page, our computer makes a **request** to some Facebook server, and the server
responds with all the information required to display the page. Now, we can
look at memes!

![](images/fbgroup.png)

However, the Facebook server allows us to do more than just look at memes. Maybe
we're procrastinating on studying for finals, and have made a meme instead with
our valuable time. We can actually upload this meme to Facebook by sending it
over to the Facebook server. Now, if someone else requests the page from the
server, they'll see our meme!

![](images/fbpost.png)

---

In this example, we saw two ways that the client (our computer) can communicate
with the server (a Facebook server). We can get memes from the server, and we
can also send memes to the server.

In a world with millions (or more) of computers needing to communicate
seamlessly with each other, how do we do it? Do computers send messages in
Spanish? In Morse code? What do they put inside of the message? How can we
ensure that the recipient of the message will understand what's being sent?

All of these questions imply that we need some sort of standardized way of
communicating between computers, and this is why we have HTTP.

## HTTP

The HyperText Transfer Protocol (HTTP) is the standard way for computers to
communicate with each other on the Web. A "protocol" can be likened to a natural
language: it's a notation that the server and client can both understand and
speak. The name also has "HyperText" in it, which may remind you of HTML – the
HyperText Markup Language. Indeed, HTTP was invented around the same time as
HTML, its main original purpose being to allow transfers of HTML files.

### HTTP Requests

In HTTP, the general flow is that the client (your laptop or cell phone) would
first send a _request_ message to the server, asking for some resource. For
instance, when you type `https://hack.uclaacm.com/` into the browser's
navigation box and hit <kbd>Enter</kbd>, the browser would send an HTTP request
on your behalf to the server. Another example is uploading a meme: the browser
would send an HTTP request to the server with the meme attached. The browser
would then wait for the server to respond with what we need.

An HTTP request generally consists of a few parts:

- The **HTTP method** is the primary way the server understands the
  client/browser's intent. The two most common ones are GET and POST.
- The **endpoint**, which is a condensed version of the URL to request.
- The **headers**, containing additional miscellaneous pieces of information the
  server may find useful.
- The **body**, any data the client wants to upload to the server (like the
  meme!).

#### Parts of a URL

This would be a good time to talk a bit about URLs. You know, the boring strings
one types into the browser address bar. They actually have quite a few parts in
them.

```
https  ://  www.facebook.com   /groups/zoommemes/   ?id=1   #post12345
scheme            host               path           query    fragment
```

The scheme refers to the protocol (here we have
[HTTPS](https://en.wikipedia.org/wiki/HTTPS), or HTTP Secure). The host
identifies _which server_ we are talking to. The path and query further identify
which resource _on the server_ we want. Finally, the fragment tells the browser
which _part of the page_ to scroll to.

#### The GET Method

The GET method is used for **retrieving** information from the server. When you
navigate to a webpage through the address bar, this is what the browser sends
under the hood.

Here's an example of a GET request that I get when I navigate to
`https://www.facebook.com/groups/zoommemes`:

```http
GET /groups/zoommemes HTTP/1.1        =  method + endpoint
Host: www.facebook.com                ┐
Accept: */*                           ┘  headers
```

Here, we see the `GET` in the first line. The `/groups/zoommemes` part refers to
the URL path (the query would also go here). The `Host:` and `Accept:` lines are
the HTTP request headers; the `Host` header defines the URL host, while the
`Accept` header defines what kind of response the client is able to consume –
anything in this case, apparently. (The `*` is the wildcard operator that
matches any input.)

We mentioned earlier that HTTP requests can have a body. But where's the body?
It turns out that GET requests cannot have bodies since they are solely used to
retrieve things from the server.

#### The POST Method

The POST method is for **sending** information to the server. When you upload a
meme, or submits a form, or logs into a website, this is the type of request
that generally happens. Here is an example:

```http
POST /groups/zoommemes/upload HTTP/1.1       =  method + endpoint
Host: www.facebook.com                       ┐
Accept: */*                                  │  headers
Content-Type: application/json               │
Content-Length: 19                           ┘

{"meme": "picture"}                          =  body
```

We see that first line has been changed to reflect the POST method. The
`Host` and `Accept` headers are the same as before, but we also got two more
headers: `Content-Type` and `Content-Length`. These two have to do with the
characteristics of the body we send.

In this example, we are sending a JSON object to the server ([remember
JSON?](https://github.com/uclaacm/hackschool-f20/tree/main/session-5-async-and-web-APIs#json-vs-javascript-objects)),
and that's why we have `application/json` as the `Content-Type`. The
`Content-Length` is the number of bytes/characters in the body.

Other types of request bodies are possible. For instance,
`application/x-www-form-urlencoded` format is an alternative to JSON that
simulates the query part of the URL. The following JSON and
`www-form-urlencoded` bodies have the same meaning:
```json
{"key1": "foo", "key2": "bar"}
```
```
key1=foo&key2=bar
```

We can send even more types of bodies to the server. With `Content-Type:
image/png` or `image/jpeg`, we can send an image directly. With
`Content-Type: text/html`, we can even use an HTML page as the request body. (Of
course, if the server doesn't understand why we are sending an HTML page, it may
respond with an error; see the response section for more info.)

### HTTP Responses

Just like HTTP requests, HTTP responses contain a header and a body. The header
consists of a status code and additional HTTP headers. The body contains data
sent by the server. This can be HTML, JSON, JPEG images, plain text, and
[more](https://en.wikipedia.org/wiki/Media_type).

Here's an example of an HTTP response.
![](images/response.png)
- In the first line, we see a status code of "200", with the meaning "OK".
- We also see a header called "Content-Type" set to "text/html", telling us that
  the type of the body is HTML.
- In the body, we received a small HTML page.

#### HTTP Status Codes

One very important part of the HTTP response is the status code, which
indicates whether the HTTP request was successful or not. Status codes come in
a few categories:

```
2xx (200-299): request was successful
4xx (400-499): unsuccessful, the client messed up
5xx (500-599): unsuccessful, the server messed up
(and a couple others we won't worry about)
```

For fun, check out [http.cat](https://http.cat/).

One common status code you may have seen is 404, which means "Not Found". This
could happen if you visit a page that does not exist, and usually you'll be
redirected to a 404 page to indicate the error. For example, here's what I see
when I go to [hack.uclaacm.com/blahblahblah](https://hack.uclaacm.com/blahblahblah):

![](images/404.png)

I can also open the Chrome DevTools and go to the Network tab. If I refresh the
page, I see this:

![](images/404dev_1.png)

In fact, I can click on "blahblahblah" to see the following response:

![](images/404dev_2.png)

## What is Node.js?

Node.js is a "JavaScript runtime environment" according to Google, which isn't
the most helpful description. But not to worry, we'll explain what it means and
why Node.js is useful.

In the year 30 B.N. (Before Node), JavaScript could only be run in the browser!
However, some very intelligent people realized that JavaScript is pretty cool
and useful. So, Node.js was created!

With Node.js, we can now run JavaScript code on our own computers, even if we're
not using a web browser and even without an internet connection! Node.js uses
the same technology inside our web browsers to make JavaScript work outside the
browser! This was a huge breakthrough for JavaScript, because it meant that 
we could also use JavaScript for our servers!

Instead of this:

![](images/node1.png)

We now have this:

![](images/node2.png)

This is really nice for us as developers, because we only need to know a single
language (JavaScript) in order to write both frontend (client) and backend
(server) code! In addition, we can be sure that any JavaScript tools used are
available on both the frontend and the backend. If we were to use a different
language in the backend, we would have to look for tools written for that
language, too.

## Express

Node.js provides the _capability_ of making an HTTP server in JavaScript.
Express is a tool that makes doing so _easy._ (Much like how React makes
building the frontend easy.)

To create a new npm project in the current directory, run the following in your 
terminal
```sh
npm init
```

To install Express, run:
```sh
npm install express
```

## Demo

### Plain Text Response

We first create a skeleton app, by putting the following in `index.js`:
```js
const express = require("express");        // Indicates that your app needs Express
                                           //
const app = express();                     // Create a new Express app
                                           //
//  vvv this means it's a GET request      //
app.get("/hello", (request, response) => { // Defines what to do when the user makes
                                           // a GET /hello request. We receive info
                                           // about the request and also a response
                                           // to write our data into.
                                           //
  response.setHeader("Content-Type",       // We set the Content-Type header to
                     "text/plain");        // plain unformatted text.
                                           //
  response.send("Hello world!");           // Send the response.
});                                        //
                                           //
app.listen(3000);                          // 3000 is a number we call the _port_.

console.log("Listening on http://localhost:3000/");
console.log("Press Ctrl-C to quit");
```

To run this app, execute:
```sh
node index.js
```

Now, go to http://localhost:3000/hello, and you should see "Hello world!" in a
monospace/typewriter font, indicating that the browser received a plain text
response. The 3000 number corresponds with what you called `app.listen()` with.
The `localhost` part of the URL refers to your own computer as the server host.

### HTML Response

Okay, that works, but isn't very interesting. Can we send an HTML file to the
client?

Add the following to `index.js`, **after** `const app` but **before**
`app.listen()`:

```js
app.get("/hello-html", (request, response) => {
  response.setHeader("Content-Type", "text/html");
  response.send("Hello, <strong>world</strong>!");
});
```

**Important**: Now, restart the server by typing Ctrl-C (same for Mac users),
and then `node index.js` again.

Navigate to http://localhost:3000/hello-html, and you should see "Hello,
**world**!"

> Question: What would the output be if we had said instead:
>
> ```js
> response.setHeader("Content-Type", "text/plain");
> ```
>
> <details><summary>Answer</summary>
>
> You should see the text
> ```
> Hello, <strong>world</strong>!
> ```
> without any formatting.
>
> </details>

### POST request

Let's say we now want to create a POST endpoint where users can upload memes
in JSON format. The request body can be accessed through `request.body`.
That property is a bit hard to use though, since it is a stream of
bytes rather than the parsed JSON object.

Fortunately, Express provides a function `express.json` that acts as a
_middleware_ to decode the JSON for us. We will also send a JSON object back
to the user. We can use it like this:
```js
//  vvvv notice how we changed this from `get` to `post`
app.post("/upload", express.json(), (request, response) => {
  if (!request.body) {
    response.setHeader("Content-Type", "text/plain");
    response.status(400);
    response.send("Invalid request body")
    return;
  }
  response.send({
    status: "We have received your meme",
    meme: request.body,
  });
});
```

We can test it by running the following in browser DevTools:
```js
response = await fetch("/upload", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    url: 'https://www.facebook.com/groups/zoommemes/permalink/482785366077607/',
  }),
});
console.log(await response.json());
```
