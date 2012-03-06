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

desc 'Package only a compiled version of the file'
task :package => :prepare do
  
  release      = Release.new
  source_files = release.compile.join("\n\n")
  puts "Compiling source..."
  copyright    = release.create_copyright
  puts "Adding copyright..."
  File.open("#{release.dist_path}/#{release.output['default']}", 'w') do |f|
    f.write([ copyright, source_files ].join("\n\n"))
  end
  puts "Done..."

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

desc 'Clean dist folders'
task :clean do
  options = fetch_options
  system("rm -rf dist/#{options['version']}")
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

task :default => :build

class Release
  
  attr_accessor :options
  
  def build_dir
    File.expand_path('.', options['paths']['build'])
  end
  
  def compile
    source_files.map{ |path| remove_closures( gsub_file( read_file("#{source_dir}/#{path}") ) ) }
  end
  
  def create_copyright
    gsub_file( read_file( File.expand_path('.', "#{options['paths']['build']}/copyright.txt") ))
  end
  
  def dist_path
    File.expand_path(File.join(options['paths']['dist'], options['version']))
  end
  
  def options
    @options ||= self.class.fetch_options
  end
  
  def self.fetch_options
    YAML::load(File.open(File.expand_path('.', "build.yml")))
  end
  
  def gsub_file(content)
    repl_hash = {
      "@DATE"     => Date.today.year.to_s,
      "@VERSION"  => options['version'],
      "@DEBUG"    => options['debug']      
    }
    content.gsub(/(@[A-Z]+)/i){ repl_hash[$1] }
  end
  
  def method_missing(name, *args)
    return super unless options.key?(name.to_s)
    options[name.to_s]
  end

  def read_file(path)
    File.open(path, 'rb') { |f| f.read }
  end  
  
  def remove_closures(src)
    # Removes closures from source files ie: "(function( Wysiwyg ) {"
    src.gsub(/\(\s?function\(\s?Wysiwyg\s?\)\s?\{\s?$/i, "").gsub(/\}\)\(\s?Wysiwyg\s?\);$/, '')
  end
  
  def source_dir 
    @source_dir ||= File.expand_path(".", options['paths']['src'])
  end
  
  def source_files
    @source_files ||= [options['input']].flatten.compact
  end
  
end