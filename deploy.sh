#!/usr/bin/env bash
# Builds and imports the Arduvaz theme into the local MyBB container.
set -euo pipefail

THEME_DIR="$(cd "$(dirname "$0")" && pwd)"
# Local MyBB checkout served by the "mybb" container (override with MYBB_SRC=/path/to/src)
MYBB_SRC="${MYBB_SRC:-$THEME_DIR/../mybbtr/src}"

# Theme script is copied (a single-file bind mount would keep serving the old inode after edits)
cp "$THEME_DIR/jscripts/arduvaz.js" "$MYBB_SRC/jscripts/arduvaz.js"

# Admin CP style (src/admin/styles/arduvaz)
rm -rf "$MYBB_SRC/admin/styles/arduvaz"
cp -r "$THEME_DIR/admin/arduvaz" "$MYBB_SRC/admin/styles/arduvaz"

docker exec mybb php /var/www/theme/build.php "$@"
docker exec mybb chown -R www-data:www-data /var/www/html/cache/themes
docker exec mybb chown "$(id -u):$(id -g)" /var/www/theme/dist/arduvaz-theme.xml
