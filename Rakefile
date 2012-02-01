require "bundler/setup"
require "erb"
require "uglifier"
require "sproutcore"

LICENSE = File.read("generators/license.js")

module SproutCore
  module Compiler
    class Entry
      def body
        "\n(function(exports) {\n#{@raw_body}\n})({});\n"
      end
    end
  end
end

## HELPERS ##

def strip_require(file)
  result = File.read(file)
  result.gsub!(%r{^\s*require\(['"]([^'"])*['"]\);?\s*}, "")
  result
end

def strip_ember_assert(file)
  result = File.read(file)
  result.gsub!(%r{^(\s)+ember_assert\((.*)\).*$}, "")
  result
end

def uglify(file)
  uglified = Uglifier.compile(File.read(file))
  "#{LICENSE}\n#{uglified}"
end

SproutCore::Compiler.intermediate = "tmp/intermediate"
SproutCore::Compiler.output = "tmp/static"

# Create a compile task for an Ember package. This task will compute
# dependencies and output a single JS file for a package.
def compile_package_task(input, output=input)
  js_tasks = SproutCore::Compiler::Preprocessors::JavaScriptTask.with_input "packages/#{input}/lib/**/*.js", "."
  SproutCore::Compiler::CombineTask.with_tasks js_tasks, "#{SproutCore::Compiler.intermediate}/#{output}"
end

## TASKS ##

# Create ember:package tasks for each of the Ember packages
namespace :sproutcore do
  %w(statechart).each do |package|
    task package => compile_package_task("sproutcore-#{package}", "sproutcore-#{package}")
  end
end

# Create a build task that depends on all of the package dependencies
task :build => ["sproutcore:statechart"]

distributions = {
  "sproutcore-statechart" => ["sproutcore-statechart"]
}

distributions.each do |name, libraries|
  # Strip out require lines. For the interim, requires are
  # precomputed by the compiler so they are no longer necessary at runtime.
  file "dist/#{name}.js" => :build do
    puts "Generating #{name}.js"

    mkdir_p "dist"

    File.open("dist/#{name}.js", "w") do |file|
      libraries.each do |library|
        file.puts strip_require("tmp/static/#{library}.js")
      end
    end
  end

  # Minified distribution
  file "dist/#{name}.min.js" => "dist/#{name}.js" do
    require 'zlib'

    print "Generating #{name}.min.js... "
    STDOUT.flush

    File.open("dist/#{name}.prod.js", "w") do |file|
      file.puts strip_ember_assert("dist/#{name}.js")
    end

    minified_code = uglify("dist/#{name}.prod.js")
    File.open("dist/#{name}.min.js", "w") do |file|
      file.puts minified_code
    end

    gzipped_kb = Zlib::Deflate.deflate(minified_code).bytes.count / 1024

    puts "#{gzipped_kb} KB gzipped"

    rm "dist/#{name}.prod.js"
  end
end


desc "Build Ember.js"
task :dist => distributions.keys.map {|name| "dist/#{name}.min.js"}

desc "Clean build artifacts from previous builds"
task :clean do
  sh "rm -rf tmp && rm -rf dist"
end

task :default => :dist