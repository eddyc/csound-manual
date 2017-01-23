
RUBY_ENGINE == 'opal' ? (require './csound-block-macro/extension') : (require_relative './csound-block-macro/extension')

Asciidoctor::Extensions.register do
  if (@document.basebackend? 'html') && (@document.safe < SafeMode::SECURE)
    block_macro CsoundBlockMacro
  end
end
