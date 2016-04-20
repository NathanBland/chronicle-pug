Ah, the user interface. The part of your application that most of your users will end up interacting with. Sure, there may be a few developers who poke at the API you have created, and so kindly allowed access to, but for the most part, people will interact with your application through the interface you provide.

Interface design is not a simple task, and there is a *lot* of information on how it should be done, and differing opinions on what tools are the best to help you do it. I am not planning to teach you how to create a pixel-perfect design. Instead, I'm going to help you create a functional, usable interface to interact with your data. If it just happens to be beautiful at the end, then it's a happy accident.

Files:
- `server.js`
  - We will modify this to include our layouts, and render our css.
- `routes/index.js`
  - We will modify this to render our page.
- `sass/site.sass`
  - We will create this file.
  - This will be the primary storehouse for our styles.
- `public/css/site.css`
  - We will generate this file
  - This will be what our `html` references, not the `.sass` file above.
- `views/layout.jade`
  - We will create this file.
  - This will be the overall layout for our application.
- `views/index.jade`
  - We will create this file.
  - This will be the primary page for our application.

#### The Tools
The tools I am going to use for helping me with my interface design are [sass](http://sass-lang.com/) and [jade](http://jade-lang.com/). Some people prefer to use `scss` over `sass`. I am not one of those people, you can use it if you like, but I will not cover it. *I don't have anything against `scss`, but for the sake of sanity, I am only covering `sass`.*

Let's get started by getting `sass` and `jade` installed into our workspace.

```
$ npm install --save jade node-sass node-sass-middleware
```

- `jade`
  - Our templating engine. We'll use this to compose our `html`.
- `node-sass`
  - Our css pre-processor. We'll use this to write our `css`.
- `node-sass-middleware`
  - Makes using `sass` a lot easier for us.

Let's configure the folders each of these will use. We already created the `views` folder for `jade` to use, but what about `sass`? We should give it two different folders to work with.

From the root of the project folder:
```
$ mkdir sass
$ mkdir -p public/css
```

Now why two different folders? Because we will compile the version from `sass` to go into our `public/css` folder. Great, let's get on with it.

#### Configure `server.js`
Our server file is going to get a visit from us in this section. We need to tell it what our templating engine is, and where our styles live.

First, with the rest of our includes, let's add `node-sass`:

```javascript
var sass = require('node-sass-middleware')
```

Then, after we configure `bodyParser`, we will configure our templating engine, and `sass`.

```javascript
app.set('view engine', 'jade')
app.use(
  sass({
    root: __dirname,
    indentedSyntax: true,
    src: '/sass',
    dest: '/public/css',
    prefix: '/css',
    debug: true
  })
)

app.use(express.static('public'))
```

So what's happening here? We are telling our server that `jade` is our template engine, and by convention the folder it uses is `views`. Since we are using the same, we don't have to configure anything else. Next we establish `sass`. We tell it the source directory will be in `sass`, and that it should put its rendered results in `public/css`. The prefix of `css` is a bit tricky to explain, but it has to do with the path defaults of `node-sass`. Basically we are telling it that all of our stylesheets will be there, and that it should pay attention to that path. Setting `debug` to `true` means that it will render each of the stylesheets every time they are requested.

Finally we tell `express` to serve our `public` folder as static assets.

#### Create `layout.jade`
Jade has extremely powerful layout capabilities, and we are going to use a few of them. First let's setup our layout file to do just that.

```
$ touch views/layout.jade
```

```jade
doctype html
html(lang='en')
  head
    meta(charset='UTF-8')
    title= title
    block styles
      link(rel='stylesheet', href='/css/site.css')
  body
    header
      block header
    main
      block content
    footer
      block footer
    block scripts

```

You'll notice this looks very different from normal html. There are no `<>` to be seen, and no content. Covering what jade does extensively is outside the scope of this guide, but I will cover some basics.

- It uses whitespace to determine where things start and end.
- The first word on a line is the type of html element it is going to create
  - Unless prefixed with a `.` or a `#`, in which case it creates a `div` with a class (`.`), or id (`#`) of that name.
- Attributes of elements are passed in like its to a function.
  - Example, a stylesheet link:
    - from `<link rel='stylesheet' href='/css/site.css'`
    - to `link(rel='stylesheet', href='/css/site.css')`
- `block` is a special case to indicate a section that can be overridden from an extending template file.
  - it can override, `append`, or `prepend`.
- It's really pretty `html`
  - *subjective but true*

You'll notice we setup a basic skeleton layout to be used by other files. In the `head` we include our core stylesheet, set the title to whatever express gives us, and define the character set.

In the `body` we define 4 blocks to be used by other templates:
- `header`
- `content`
- `footer`
- `scripts`

We've also placed some semantic html elements around these blocks to better describe to us what their purpose is.

#### Create `site.sass`
Sass is similar to jade in two ways, that is it uses whitespace to help arrange the file, and it removes some of the ugly portions of the code it compiles to (such as `;` and `{}`).

Let's make our base stylesheet:
```
$ touch sass/site.sass
```

For now, we are only going to put one rule in our stylesheet:
```sass
body
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
```

While this is just a simple rule, the differences between traditional `css` and `sass` become immediately evident. There is no `{}` containing the properties of our selector, and there are no `;` after the properties. Also, its indented, which is nice to look at.

#### Create `index.jade`
Let's extend our previous layout and give a little content to be looked at:
```
$ touch views/index.jade
```

```jade
extends ./layout.jade

block header
  h1= title
block content
  h2 Welcome to Chronicle
  button Write
  button Sign in
  button Sign up
block footer
  p Thanks for taking a look at our service. We hope you'll come back

```

This has a little bit of new content since the previous `jade` file, but not much. We reference our layout file with `extends ./layout.jade` and then we override our previously established blocks, but that's all we have to do. This will be injected into the parent template, and rendered as one file.

#### Modify `routes/index.js`
Now let's make it visible.

Open `routes/index.js` and add this below the `api` reference:

```javascript
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Chroncile'
  })
})
```

.
