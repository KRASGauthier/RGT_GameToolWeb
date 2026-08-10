#!/usr/bin/env bash
TYPE_DIRS=()

updateFolder() {
	source="./frontend/$1"
	destination="./backend/$1"
	
	rm -rf "$destination"

	if [[ -d "$source" ]]; then
		mkdir -p "$(dirname "$destination")"
		cp -r "$source" "$destination"
		TYPE_DIRS+=("$destination")
	fi
}

updateFile() {
	source="./frontend/$1"
	destination="./backend/$1"

	
	if [[ -f "$source" ]]; then
		mkdir -p "$(dirname "$destination")"
		cp "$source" "$destination"
		TYPE_DIRS+=("$destination")
	fi
}

updateFolder "src/types/api"
updateFolder "src/types/data"
updateFolder "rgt/types/api"
updateFolder "rgt/types/data"
updateFolder "src/consts"
updateFile "src/consts.ts"
updateFile "rgt/consts.ts"

find "${TYPE_DIRS[@]}" -type f -name "*.ts" -exec sed -Ei \
	-e '/^[[:space:]]*import[[:space:]]+type[[:space:]].*from[[:space:]]+["'\'']react["'\''];?[[:space:]]*$/d' \
	-e 's/\bReactNode\b/string/g' \
	-e 's|(from[[:space:]]+["'\''])(..?/[^"'\'']+)(["'\''])|\1\2.js\3|g' {} +

sed -Ei 's/\{([^}]+)\}/:\1/g' ./backend/src/consts.ts
sed -Ei 's/\{([^}]+)\}/:\1/g' ./backend/rgt/consts.ts