# In Progress
- fix the info bar footers so that they don’t stay visible when the info bar is hidden (deal with this problem in the info bar rework task)
- trigger based resizing on info bar load (HARD)
- user webkit-transition stuff for info bar hiding/showing (like sidebar)

# Backlog:
- fix broken cast from sidebar minimization feature
- do proper subscription loading…
- only have the friend search source be loaded once during the session! Store it in a session variable or something…
- create controls for social subpage
- show loading spinner when loading image in collections (or the loading cat)
- conceptualize a proper filter system and UI
- create module in admin panel to manage friendship states

# Completed:
- implement social features in infobar
- convert all '' to "" without breakages
- add icon beside all of the h1 page headers
- change empty-message to emptyMessage
- fix the empty-message centering (see profile page)
- we need to position:fix the top bar
- abstract all search bars!!!!
- remove all prefixing ‘_’ from _{}.import.less
- castify all grid layouts
- incorporate account component into sidebar component
- fix broken offsets for when hiding the sidebar
- remove redundant organization in sidebar (corner/navbar/account)
- create mixin for circle-based styles (border-radius: 50%)
- write simple macro for implementing hoverable elements
- rename friend to friend item
- change all `el` to $el (and generally for all elements)
- hover events for music subpage
- variable for sans serif font replace all older instances of `Helvetica Neue, Helvetica, Arial`
- generalize colors for info bar into variables.less (and all corresponding subpages)