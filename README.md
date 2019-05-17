# torcAddons for glitch

**torcAddons** is an addon package for [glitch.com](https://glitch.com)

to use any or all features, install a code injection/userscript extension such as tampermonkey or Resource Override and add the desired code.

for every addon, the base driver script `torcAddons.js` must also exist, and must be run prior to the other scripts.


#### all of the scripts have been updated to comply with the UserScript format

if you are using a UserScript extension, you can install the scripts here: https://openuserjs.org/users/torcado/scripts

additionally, these scripts will auto-update as i push fixes and features to this repository.

## addons

### base
[UserScript download](https://openuserjs.org/src/scripts/torcado/torcAddons.user.js)
> sets up common methods and events for the other addons to use.

### filetree
[UserScript download](https://openuserjs.org/src/scripts/torcado/torcAddons-filetree.user.js)
> adds a (real) filetree view to the file browser, including directory collapsing.
> it also comes with a file searchbar, automatically hiding files not matching the search.

![filetree.gif](https://i.imgur.com/EOI9RxD.gif)


### favorite
[UserScript download](https://openuserjs.org/src/scripts/torcado/torcAddons-favorite.user.js)
> adds a "favorite" star button next to each file, allowing you to add or remove files to a favorites list.
> a list of favorited files is displayed above the filetree. favorites are saved to local storage and are tied to the project.

![favorite.gif](https://i.imgur.com/Kuay9F7.gif)


### indentGuides
[UserScript download](https://openuserjs.org/src/scripts/torcado/torcAddons-indentGuides.user.js)
> adds visual guides to indentation in the code

![indentGuides.gif](https://i.imgur.com/mrkwd58.gif)


### pasteAndIndent
[UserScript download](https://openuserjs.org/src/scripts/torcado/torcAddons-pasteAndIndent.user.js)
> automatically correctly indents code when you paste it. you can prevent this behavior with ctrl+shift+v.

![pasteAndIndent.gif](https://i.imgur.com/jSY5jI9.gif)


### colors
[UserScript download](https://openuserjs.org/src/scripts/torcado/torcAddons-colors.user.js)
> adds a visual color component next to css colors

![colors.gif](https://i.imgur.com/GojAx2g.gif)


### wrapSelection
[UserScript download](https://openuserjs.org/src/scripts/torcado/torcAddons-wrapSelection.user.js)
> allows certain characters to wrap selections rather than replace the selection, such as (parentheses)

![wrapSelection.gif](https://i.imgur.com/DNTErVJ.gif)

### manualUpdate
[UserScript download](https://openuserjs.org/src/scripts/torcado/torcAddons-manualUpdate.user.js)
> adds an 'update' button which allows a project to update without needing to edit a watched file
> this works well in conjunction with the following `watch.json` file:
```json
{
  "install": {
    "include": [
      "^.torc-update$"
    ]
  },
  "throttle": 10
}
```

------