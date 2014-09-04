# TODO List

## In Progress
- only have the friend search source be loaded once during the session! Store it in a `Session` variable or something…

## Backlog
- do proper subscription loading…
- create controls for `Social Subpage`
- show loading spinner when loading image in collections (or the loading cat)
- conceptualize a proper filter system and UI
- create module in admin panel to manage friendship states

## Completed
- implement social features in `infoBar`
- convert all `''` to `""` without breakages
- add icon beside all of the `h1` page headers
- change `empty-message` to `emptyMessage`
- fix the `empty-message` centering (see profile page)
- we need to `position:fix` the top bar
- abstract all search bars!!!!
- remove all prefixing `_` from `_{}.import.less`
- `cast`ify all grid layouts
- incorporate `account` component into `sidebar` component
- fix broken offsets for when hiding the `sidebar`
- remove redundant organization in sidebar (corner/navbar/account)
- create mixin for circle-based styles (`border-radius: 50%`)
- write simple macro for implementing hoverable elements
- rename `friend` to `frienditem`
- change all `el` to `$el` (and generally for all elements)
- hover events for music subpage
- variable for sans serif font replace all older instances of `Helvetica Neue, Helvetica, Arial`
- generalize colors for info bar into variables.less (and all corresponding subpages)
- fix the `infoBar` footers so that they don’t stay visible when the `infoBar` is hidden (deal with this problem in the `infoBar` rework task)
- user `webkit-transition` stuff for `infoBar` hiding/showing (like `sidebar`)
- trigger based resizing on `infoBar` load (HARD)
- fix broken `cast` from `sidebar` minimization feature