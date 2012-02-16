#!/usr/bin/env ruby
require 'rubygems'
require 'redcarpet'

# markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML,
# 	:autolink => true,
# 	:no_intra_emphasis => true, 
# 	:fenced_code_blocks => true, 
# 	:autolink => true,
# )

markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML,
	:autolink => true,
	:no_intra_emphasis => true, 
	:fenced_code_blocks => true, 
	:autolink => true
)

# rndr = Redcarpet::Render::HTML.new(:with_toc_data => true)


puts markdown.render(ARGF.read)
#puts ARGF.read