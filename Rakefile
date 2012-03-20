require 'yaml'
require 'fileutils'

# desc 'Package the library and create both compressed and uncompressed versions. Process the result with jslint'
# task :build => [:prepare, :package, :minify, :lint] do
#   puts "Building #{fetch_options['name']}"
# end
# 
task :build => [:prepare, :package, :minify, :lint] do
  release = Release.new
  puts [
        "Building release package #{release.name}",
        "-- Version: #{release.version}",
        "-- Output: #{release.output['default']}",
        ""
      ].join("\n")
end

desc 'Package and minify'
task :minify => [:prepare, :package] do

  release = Release.new
  puts "Minifying to #{release.output['minified']}..."

  sourcefile  = File.expand_path(".", "#{release.dist_path}/#{release.output['default']}")
  destfile    = File.expand_path(".", "#{release.dist_path}/#{release.output['minified']}")
  tempfile    = "#{destfile}.tmp"
  
  puts `#{release.compiler} #{sourcefile} > #{tempfile}`
  puts `#{release.post_compiler} #{tempfile} > #{destfile}`
  system "rm #{tempfile}"
  
  copyright = release.create_copyright
  puts 'Adding copyright...'
  minified  = release.read_file(destfile)
  File.open("#{destfile}", 'w'){ |f| f.write([copyright, minified].join("\n\n")) }  
  puts "Done..."
  
end

desc 'JSLint the packaged file'
task :lint => [:prepare, :package] do
  release = Release.new
  system("#{release.lint} -process #{File.join(release.dist_path, release.output['default'])}")
end

task :prepare do
  [:engine, :compiler, :post_compiler, :lint].each do |meth|
    Release.class_eval <<-METHOD, __FILE__, __LINE__ + 1
      def #{meth}
        #{ prep.send(meth).inspect }
      end
    METHOD
  end
end