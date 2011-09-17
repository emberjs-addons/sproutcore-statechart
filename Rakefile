require "bundler/setup"
require "erb"
require "uglifier"
require "sproutcore"

LICENSE = File.read("generators/license.js")

module SproutCore
  module Compiler
    class Entry
      def body
        "\n(function(exports) {\n#{@raw_body}\n})({})\n"
      end
    end
  end
end

def strip_require(file)
  result = File.read(file)
  result.gsub!(%r{^\s*require\(['"]([^'"])*['"]\);?\s*$}, "")
  result
end

def strip_sc_assert(file)
  result = File.read(file)
  result.gsub!(%r{^(\s)+sc_assert\((.*)\).*$}, "")
  result
end

def uglify(file)
  uglified = Uglifier.compile(File.read(file))
  "#{LICENSE}\n#{uglified}"
end

SproutCore::Compiler.output = "tmp/static"

def compile_statechart_task
  SproutCore::Compiler.intermediate = "tmp/sproutcore-statechart"
  js_tasks = SproutCore::Compiler::Preprocessors::JavaScriptTask.with_input "lib/**/*.js", "."
  SproutCore::Compiler::CombineTask.with_tasks js_tasks, "#{SproutCore::Compiler.intermediate.gsub(/tmp\//, "")}"
end

task :compile_statechart_task => compile_statechart_task

task :build => [:compile_statechart_task]

file "dist/sproutcore-statechart.js" => :build do
  puts "Generating sproutcore-statechart.js"
  
  mkdir_p "dist"
  
  File.open("dist/sproutcore-statechart.js", "w") do |file|
    file.puts strip_require("tmp/static/sproutcore-statechart.js")
  end
end

# Minify dist/sproutcore-statechart.js to dist/sproutcore-statechart.min.js
file "dist/sproutcore-statechart.min.js" => "dist/sproutcore-statechart.js" do
  puts "Generating sproutcore-statechart.min.js"
  
  File.open("dist/sproutcore-statechart.prod.js", "w") do |file|
    file.puts strip_sc_assert("dist/sproutcore-statechart.js")
  end
  
  File.open("dist/sproutcore-statechart.min.js", "w") do |file|
    file.puts uglify("dist/sproutcore-statechart.prod.js")
  end
end

task :dist => ["dist/sproutcore-statechart.min.js"]

task :default => :dist