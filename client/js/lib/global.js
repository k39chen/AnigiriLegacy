window.MAX_RATING = 5;

// admin users on the develop instance
window.DEVELOP_ADMIN_USERS = [
	'oaNf8fi7LetmdrpfM' // Kevin Chen
];
// admin users on the production instance
window.PRODUCTION_ADMIN_USERS = [
	'"n6Z3X4aCar9Z6vPuz"' // Kevin Chen
];

// merge the two instances for a master admin user list
window.ADMIN_USERS = DEVELOP_ADMIN_USERS.concat(PRODUCTION_ADMIN_USERS);
