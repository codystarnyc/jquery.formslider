fs = require 'fs'

module.exports =
  copyright: (who) ->
    "© #{new Date().getFullYear()} by #{who}"

  list_partials_for: (relative_view_path) ->
    full_path = "./src/views/#{relative_view_path}"
    partials = []
    files_names = fs.readdirSync(full_path)
    for file_name in files_names
      full_file_path = "#{full_path}/#{file_name}"

      is_dir = fs.statSync(full_file_path).isDirectory()

      file_name_without_extension = file_name.replace('.haml', '')
      partial_path = "#{relative_view_path}/#{file_name_without_extension}"
      partials.push(partial_path) unless is_dir

    partials
