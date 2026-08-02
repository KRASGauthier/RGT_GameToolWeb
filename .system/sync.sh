#!/usr/bin/env bash
source .env
source .system/shared.sh

#====================== DIRECTION ======================
if [[ "$1" != "up" && "$1" != "down" ]]; then
	echo "${RED}${BOLD}Invlide argument for sunc.sh: <up|down>${RESET}"
	exit 1
fi

if [[ "$1" == "up" ]]; then
	SOURCE="$SYSTEM_SYNC_PROJECT_LOCATION"
	SAVE="$SYSTEM_SYNC_SAVE_LOCATION"
else
	SOURCE="$SYSTEM_SYNC_SAVE_LOCATION"
	SAVE="$SYSTEM_SYNC_PROJECT_LOCATION"
fi


addFiles() {
	local directory="$1"
	local file
	local name

	for file in "$SOURCE$directory"/{*,.[!.]*,..?*}; do
		[[ -f "$file" ]] || continue
		
		name="$(basename "$file")"
		if [[ "$name" == "package.json" || "$name" == "package-lock.json" ]]; then
			continue
		fi

		TARGETS+=("${directory}/$name")
	done
}

TARGETS=(
	".system"
	"Makefile"
	"docker-compose.dev.yaml"
	"default_env"
	".gitignore"
	".env"
	"frontend/rgt"
)
addFiles "frontend"
addFiles "backend"


TOTAL_TARGETS="${#TARGETS[@]}"

startProgress "Checking file validation" "Checking" "$TOTAL_TARGETS"
for file in "${TARGETS[@]}"; do
	nextProgress "$file"
	if [[ ! -e "$SOURCE$file" ]]; then
		errorProgress "Error missing target: $file"
		exit 1
	fi
done
doneProgress

startProgress "Syncing file to $SAVE" "Syncing" "$TOTAL_TARGETS"
for file in "${TARGETS[@]}"; do 
	nextProgress "$file"
	rsync -aR --delete "$SOURCE./$file" "$SAVE"
done
doneProgress
exit 0