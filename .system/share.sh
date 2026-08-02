#!/usr/bin/env bash
TYPE_DIRS=()

for type in api data; do
	source="./frontend/src/types/$type"
	destination="./backend/src/types/$type"

	rm -rf "$destination"

	if [[ -d "$source" ]]; then
		mkdir -p ./backend/src/types
		cp -r "$source" "$destination"
		TYPE_DIRS+=("$destination")
	fi
done

rm -rf ./backend/rgt/types/api
mkdir -p ./backend/rgt/types
cp -r ./frontend/rgt/types/api ./backend/rgt/types/
TYPE_DIRS+=("./backend/rgt/types/api")

find "${TYPE_DIRS[@]}" -type f -name "*.ts" -exec sed -Ei \
	-e '/^[[:space:]]*import[[:space:]]+type[[:space:]].*from[[:space:]]+["'\'']react["'\''];?[[:space:]]*$/d' \
	-e 's/\bReactNode\b/string/g' \
	-e 's|(from[[:space:]]+["'\''])(\.\.?/[^"'\'']+)(["'\''])|\1\2.js\3|g' {} +