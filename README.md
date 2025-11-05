# Snippet Dashboard

This is a self hosted app for saving, organizing, and sharing pieces of code, notes, and solutions. Visitors can browse, search, copy, and download public snippets, while signed in members manage their own collection from a private dashboard. Administrators approve new members, manage categories and languages, and can oversee every snippet on the site.

## Reading and Sharing Snippets

- The homepage lists the newest public snippets first, a set number per page.
- Long lists are split into pages with Previous and Next buttons and a "Page X of Y" counter.
- Each snippet has its own page showing its title, description, and code.
- Code is shown with color highlighting that matches its programming language.
- A Copy code button puts the whole snippet on your clipboard and confirms with "Copied".
- A Download button saves the snippet as a file named after it, with the right file ending for its language.
- A Print button prints a clean copy with the menus, buttons, and sidebar left out.
- A Share button copies a short, permanent link to the snippet.
- An optional reference link on a snippet opens the original source in a new tab.
- The language, category, tags, and author on each snippet are links to more snippets like it.
- A "More in" section under each snippet suggests others from the same category.
- A "Random picks" section under each snippet suggests others from anywhere in the library.
- Private snippets carry a visible Private label.
- A button to jump back to the top appears once you scroll down a long page.
- Empty pages show a friendly message, such as when a category or search has no snippets yet.
- Signed in visitors see a "You are signed in" notice and a Dashboard link, while others see a Sign in link.
- Older snippet links and older page number links send you to the current address automatically.

## Search and Browsing

- A search box finds public snippets by words in their title, description, or code.
- Category pages list every public snippet in one category.
- Language pages list every public snippet written in one language.
- Tag pages list every public snippet with a given tag.
- Author pages list every public snippet posted by one member.
- A "Recently added" list in the sidebar links to the newest snippets.
- The sidebar lists categories with how many snippets each holds, hiding empty ones.
- The sidebar shows a tag cloud with how many snippets use each tag.
- The sidebar lists languages with how many snippets use each, hiding empty ones.

## Writing and Managing Your Snippets

- Create a snippet with a title, short description, code, category, language, tags, and an optional reference link.
- Add several tags at once by separating them with commas.
- Mark a snippet as private to hide it from every list and search while keeping it reachable by its direct link.
- Edit any of your snippets at any time.
- Delete a snippet after a second click to confirm.
- Your dashboard lists all your snippets with their category, description, and whether each is public or private.
- A View button opens the public page of a snippet in a new tab.
- A New snippet button is always available at the top of the dashboard.
- Each snippet gets a readable web address made from its title, kept unique automatically.

## Admin Tools

- Admins see every member's snippets in the dashboard, with an Author column, and can edit or delete any of them.
- Admins see a list of all members with their email, role, and whether they are approved or pending.
- Admins approve pending members or revoke access for existing ones.
- Admins can create new members who are approved right away, and can make them admins too.
- Admins add, rename, and delete categories, with a link to view each category page.
- Admins add, rename, and delete programming languages, with a link to view each language page.
- The site comes with 24 common programming languages ready to use.
- Admin menu items are hidden from regular members, and those pages are blocked if they try to visit them.
- The first admin account is created automatically the first time the site starts.

## Accounts and Sign In

- Anyone can sign up with a username, email, and password, then wait for an admin to approve the account.
- Members sign in with their username and password.
- Members whose account is still waiting for approval are told so when they try to sign in.
- You stay signed in for up to one day.
- A Log out link ends your session.
- Your profile page shows your username, role, and email address.
- Change your email address after entering your current password, with a warning if another member already uses it.
- Change your password after entering your current one, with checks that the new one is at least six characters, typed the same twice, and different from the old one.

## Site Settings

- The site owner chooses whether snippet links use readable names or short codes.
- The site owner chooses between roomy cards or a compact list for snippet listings.
- The site owner sets how many snippets appear on each page.
- The site owner sets the homepage title and subtitle.
- The site owner sets how many snippets appear in the "More in", "Random picks", and "Recently added" sections, up to 25 each.
- The site owner can turn off the tag cloud or the languages list in the sidebar.
- The site owner sets how many sign in attempts are allowed and for how long before they are blocked.

## Connecting Other Apps

- Each member has a personal access key shown on their profile page, with a Copy button.
- Members can replace their access key, after a warning that the old key stops working right away.
- Other apps and scripts can post new snippets to your account using your access key.
- Other apps and scripts can list your public snippets, page by page.
- Other apps and scripts can look up a category or language by name.
- Access keys only work for approved members.

## Security and Privacy

- Repeated failed sign in attempts are blocked for a while, by default 10 tries every 15 minutes.
- Passwords are stored in scrambled form, never as plain text.
- Regular members can only edit or delete their own snippets.
- Snippets from members who are not approved, or whose access was revoked, are hidden from public pages.
- Reference links only become clickable when they are ordinary web or email addresses, and are shown as plain text otherwise.
- Downloaded snippets are always sent as plain text so the browser does not run them.

## Command Line Tools for Site Owners

- List every snippet on the site in a table, including private ones and their authors.
- Delete a snippet by its number after confirming with a yes or no question.
- Create a snippet from a file on the server, with the title taken from the file name unless you give one, plus optional category, language, tags, reference link, and private setting.
- Load a ready made library of sample snippets, skip ones already present, remove them again, or preview what would be added.
