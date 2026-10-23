# WordPress import

These scripts turned the 23 October 2026 Brizy/WordPress backup into the data files in `src/data/` and the images
in `src/assets/uploads/` and `public/wp-content/uploads/`. They were run once; the site does not need them to build.
Keep them in case the content has to be re-extracted.

The backup itself (database dump, uploads, wp-config.php) holds credentials and personal data and is NOT in this
repository.

1. Extract the backup into a work folder `WORK` (so `WORK/x/iamcapital-db-2026-10-23.sql` and
   `WORK/x/wordpress/wp-content/uploads/` exist) and save the map's Apps Script JSON as `WORK/props.json`.
2. `python3 -m venv venv && venv/bin/pip install beautifulsoup4 lxml markdownify phpserialize`
3. `venv/bin/python parse.py WORK/x/iamcapital-db-2026-10-23.sql wp_posts,wp_postmeta,wp_options,wp_terms,wp_term_taxonomy,wp_term_relationships WORK/db.pkl`
4. `WORK=... venv/bin/python extract.py /path/to/this/repo`

Brizy stores each page twice: compiled HTML in `post_content`, and the editor's JSON (base64, inside the PHP-serialised
`brizy` post meta). `lib.py` decodes the JSON, which keeps the images (as `brizy_attachment_uid` references) and the
reading order; `extract.py` walks it per page type (funds, team, properties) and writes JSON.
