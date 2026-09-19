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
updateFolder "src/types/icons"
updateFolder "rgt/types/api"
updateFolder "rgt/types/data"
updateFolder "rgt/types/components"
updateFile "rgt/types/TShared.ts"
updateFile "rgt/types/TStyles.ts"

updateFolder "src/consts"
updateFile "src/consts.ts"
updateFile "rgt/consts.ts"

find "${TYPE_DIRS[@]}" -type f -name "*.ts" -exec sed -Ei \
	-e '/^[[:space:]]*import[[:space:]]+type[[:space:]].*from[[:space:]]+["'\'']react["'\''];?[[:space:]]*$/d' \
	-e 's/\bReactNode\b/string/g' \
	-e 's|(from[[:space:]]+["'\''])(..?/[^"'\'']+)(["'\''])|\1\2.js\3|g' {} +

sed -Ei 's/\{([^}]+)\}/:\1/g' ./backend/src/consts.ts
sed -Ei 's/\{([^}]+)\}/:\1/g' ./backend/rgt/consts.ts

# Generate backend-only TIconLibrary from frontend DIconLibrary keys
ICON_SOURCE="./frontend/src/types/icons/TIconLibrary.ts"
ICON_DEST="./backend/src/types/icons/TIconLibrary.ts"

if [[ -f "$ICON_SOURCE" ]]; then
	mapfile -t ICON_KEYS < <(
		sed -n '/export const DIconLibrary = {/,/} satisfies/p' "$ICON_SOURCE" |
		sed -nE 's/^[[:space:]]*([A-Za-z_][A-Za-z0-9_]*)[[:space:]]*:.*$/\1/p'
	)

	{
		echo "export const DIconLibrary = ["

		for key in "${ICON_KEYS[@]}"; do
			echo "	\"$key\","
		done

		echo "] as const;"
		echo
		echo "export type TIconLibrary = (typeof DIconLibrary)[number];"
	} > "$ICON_DEST"
fi