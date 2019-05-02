# torcAddons for glitch

**torcAddons** is an addon package for [glitch.com](https://glitch.com)

to use any or all features, install a code injection/userscript extension such as tampermonkey or Resource Override and add the desired code.

for every addon, the base driver script `torcAddons.js` must also exist, and must be run prior to the other scripts.

## addons

**filetree**
> adds a (real) filetree view to the file browser, including directory collapsing.
> it also comes with a file searchbar, automatically hiding files not matching the search.

**favorite**
> adds a "favorite" star button next to each file, allowing you to add or remove files to a favorites list.
> a list of favorited files is displayed above the filetree. favorites are saved to local storage and are tied to the project.

**indentGuides**
> adds visual guides to indentation in the code

**pasteAndIndent**
> automatically correctly indents code when you paste it. you can prevent this behavior with ctrl+shift+v.

**colors**
> adds a visual color component next to css colors

