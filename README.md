# SproutCore (Ember.js) Statechart

### Description:

This is a port of the SproutCore Statechart library from the SproutCore 1.x
framework for use in SproutCore 2.0 (Ember.js) applications. It was principally authored
by Michael Cohen (aka. FrozenCanuck).

### Synopsis:

TODO: Add documentation to the README.

For the time being, there are plenty of examples in the source code, and example
usage throughout the extensive unit tests.

### Learning by Example

We are working hard to provide more documentation and examples for Ember.js and here specifically for
the statechart framework. Until there is more, you can learn from this example:

[Quick Notes - Example Ember.js Application for statecharts and routing support](https://github.com/DominikGuzei/ember-routing-statechart-example)

### Building ember-statechart.js

You need ruby and some gems to build the source code and to run unit tests.

1. Install Ruby 1.9.2+. There are many resources on the web can help; one of the best is [rvm](http://rvm.beginrescueend.com/).

2. Install Bundler: `gem install bundler`

3. Run `bundle` inside the project root to install the gem dependencies.

4. Run `rake` to build ember-statechart.js. Two builds will be placed in the `dist/` directory.

5. `ember-statechart.js` and `ember-statechart.min.js` - unminified and minified builds of ember-statechart.js

If you are building under Linux, you will need a JavaScript runtime for
minification. You can either install nodejs or `gem install
therubyracer`.

### Running / Writing Unit Tests:

The repository has been refactored to use the same structure as the [Ember.js](https://github.com/emberjs/ember.js) project:

1. To start the development server, run `bundle exec rackup`.

2. Then visit: [http://localhost:9292/tests/index.html?package=all](http://localhost:9292/tests/index.html?package=all)

You can also pass `jquery=VERSION` in the test URL to test different versions of jQuery. Default is 1.7.1.

### Features / Problems:

  * The `stateObserves()` helper does not properly work with global paths. These
    problems are captured in the unit tests
  * There are a few fixes for bugs that are in the SproutCore 1.x version that
    have not been ported over as of yet.
  * The Unit Tests for route triggered are failing at the moment, but it works -> needs to be fixed!

If you run into a problem, please file an issue on this repository.

### Requirements:

In order to use the Statechart package, you'll need two libraries:

  * [SproutCore 2.0's runtime library](https://github.com/sproutcore/sproutcore20)
  * [SproutCore 2.0's utils library](https://github.com/sproutcore/sproutcore-utils)

These dependencies are automatically installed if you're using BPM. If you want to download
and use the JS file (and assuming you're already using SproutCore 2.0), don't forget to grab
the built version of the Utils package.

You can also simply include a built version of Ember.js before ember-statechart.js

### Install:

You can use the Statechart package by either downloading the JavaScript files
provided in the [Downloads section](https://github.com/sproutcore/sproutcore-statechart/archives/master)
of this repository or using [BPM](http://getbpm.org/). To install it via BPM, simply run

    bpm add sproutcore-statechart

And this will handle adding all of its dependencies as well. You, of course, need to
be using BPM for your application or package for this to work ;)
