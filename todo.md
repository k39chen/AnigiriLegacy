# Todo List

## In Progress
- Resolve duplicate named entries and add year to name to clarify (do this at the server level)
- fix images that get blurry because of webkit animations
- only have the friend search source be loaded once during the session! Store it in a `Session` variable or something…

## Backlog
- Create a search page (similar to myspace!)
- do proper subscription loading…
- create controls for `Social Subpage`
- conceptualize a proper filter system and UI
- create module in admin panel to manage friendship states

- look into a similar style as Myspace!!! https://myspace.com/ryanjamesmusic

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
- fix broken `readmore` plugin in infoBar
- show loading spinner when loading image in collections (or the loading cat)
- fix page header offset when minimized-left
- fix bug where if you view one person's profile from the searchbox and then view another, the info doesn't update
- Add subscribe button to overview page
- Fix unable to unsubscribe button
- Too much vertical spacing on profile page for animes
- Add episode link generation in activity subpage
- Import/Export collection
- Disable starring for backlogged animes

## Planned
- Dashboard
	- Recommended by Friends
	- Friend Requests
	- Episode Releases
	- Statistics
- Statistics
	- Genres (pie chart)
	- Themes (Collage)
	- Recommendations
	- Num episodes watched this month (bar chart)
- Discover
	- match against genres/themes and release years 
- Search page
	- Large overlay 
	- Searches against anime names, genres, themes, users, etc.
	- Still able to autocomplete results?
- Filters
	- Status
	- Progress
	- Year (Date Range widget)
	- Genre
	- Theme
	- Alphabetical
	- Length (Episodes)
