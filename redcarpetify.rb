#!/usr/bin/env ruby
require 'rubygems'
require 'redcarpet'
require 'albino'

# markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML,
# 	:autolink => true,
# 	:no_intra_emphasis => true, 
# 	:fenced_code_blocks => true, 
# 	:autolink => true,
# )
# rndr = Redcarpet::Render::HTML.new(:with_toc_data => true)

# create a custom renderer that allows highlighting of code blocks
class HTMLwithAlbino < Redcarpet::Render::HTML
  def block_code(code, language)
  	if language != nil
    	Albino.colorize(code, language)
    else
    	Albino.colorize(code)
    end

  end
end

rndr = HTMLwithAlbino.new(
	:hard_wrap => true, 
	:gh_blockcode => true,
	:with_toc_data => true
	#, 
	# :filter_html => true,
	# :no_images => true,
	# :no_styles => true,
	# :safe_links_only => true
)

markdown = Redcarpet::Markdown.new(rndr,
	:autolink => true,
	:no_intra_emphasis => true, 
	:fenced_code_blocks => true, 
	:autolink => true
)


# puts Albino.colorize('var a = "you suck";', :javascript);

puts markdown.render(ARGF.read)
#puts ARGF.read