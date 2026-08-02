#!/usr/bin/env bash
source .env
source .system/shared.sh

#====================== STYLING ======================
RESET=$'\033[0m'
BOLD=$'\033[1m'

RED=$'\033[31m'
GREEN=$'\033[32m'
YELLOW=$'\033[33m'
BLUE=$'\033[34m'
CYAN=$'\033[36m'

CLEAR_LINE=$'\033[2K'

LINE_RETURN=$'\n'
CARRIAGE_RETURN=$'\r'

CURSOR_SAVE=$'\033[s'
CURSOR_RESTORE=$'\033[u'

CURSOR_HIDE=$'\033[?25l'
CURSOR_SHOW=$'\033[?25h'

BAR_SIZE=50

BAR_FULL="#"
BAR_CURRENT="+"


#====================== CHECKING ======================
startProgress "Checking init arguments"
if (( $# == 0)); then
	errorProgress "Invalid number of argument <name> [fix]"
	exit 1
fi
doneProgress

startProgress "Checking $FRONTEND_LOCATION"
if [[ ! -e "$FRONTEND_LOCATION" ]]; then
	errorProgress "}Error missing '$FRONTEND_LOCATION' location"
	exit 1
fi
doneProgress
startProgress "Checking init not already called"
if [[ -e "$FRONTEND_LOCATION/package.json" ]]; then
	errorProgress "Error this project is already initialized location"
	exit 1
fi
doneProgress



#====================== FRONTEND ======================
startProgress "frontend: Copying frontend file defaut files"

FRONT_DEFAULT=(
	"frontend-package.json"
	"frontend-package-lock.json"
	"App.tsx"
	"consts.ts"
	"main.tsx"
	"PBasePage.tsx"
	"theme.ts"
	"favicon.svg"
	"icons.svg"
)
FRONT_DEFAULT_DEST=(
	"package.json"
	"package-lock.json"
	"src/App.tsx"
	"src/consts.ts"
	"src/main.tsx"
	"src/pages/shared/PBasePage.tsx"
	"src/style/theme.ts"
	"public/favicon.svg"
	"public/icons.svg"
)

for file in "${FRONT_DEFAULT[@]}"; do 
	if [[ ! -e "$SYSTEM_DEFAULT_FRONT_LOC$file" ]]; then 
		errorProgress "No $SYSTEM_DEFAULT_FRONT_LOC$file exists"
		exit 1
	fi
done

for i in "${!FRONT_DEFAULT[@]}"; do

	mkdir -p "$(dirname "${FRONTEND_LOCATION}${FRONT_DEFAULT_DEST[$i]}")" || {
		errorProgress "Couldn't create folder for '${FRONTEND_LOCATION}${FRONT_DEFAULT_DEST[$i]}'"
		exit 1
	}
	cp "$SYSTEM_DEFAULT_FRONT_LOC${FRONT_DEFAULT[$i]}" "${FRONTEND_LOCATION}${FRONT_DEFAULT_DEST[$i]}" || {
		errorProgress "Couldn't copy '$SYSTEM_DEFAULT_FRONT_LOC${FRONT_DEFAULT[$i]}' to '${FRONTEND_LOCATION}${FRONT_DEFAULT_DEST[$i]}'"
		exit 1
	}

done

doneProgress

startProgress "frontend: renaming project"
cd "$FRONTEND_LOCATION"
npm pkg set name="$1"
doneProgress

startProgress "frontend: Installing npm"
npm install --no-progress --loglevel=error >/dev/null 2>npm-error.log  || {
	errorProgress "npm install failed"
	exit 1
}
doneProgress

startProgress "frontend: Checking installation"
audit_count="$(
	npm audit 2>/dev/null | grep "severity vulnerabilities" |  
	grep -o '^[0-9]\+' |
	awk '{ total += $1 } END { print total + 0 }'
)"

if (( audit_count > 0 )); then
	warningProgress "$audit_count vulnerabilities found. Run npm audit."

	if [[ "$2" == "fix" ]]; then 
		startProgress "frontend: Fixing installation"
		npm audit fix >/dev/null
		audit_count="$(
			npm audit 2>/dev/null | grep "severity vulnerabilities" |  
			grep -o '^[0-9]\+' |
			awk '{ total += $1 } END { print total + 0 }'
		)"
		if (( audit_count > 0 )); then
			warningProgress "$audit_count vulnerabilities still found. Run npm audit."
		else
			doneProgress
		fi
	fi
else
	doneProgress
fi
cd ../


#====================== BACKEND ======================
startProgress "backend: Copying backend file defaut files"

BACK_DEFAULT=(
	"package.json"
	"package-lock.json"
	"index.ts"
	"backendConsts.ts"
)
BACK_DEFAULT_DEST=(
	"package.json"
	"package-lock.json"
	"src/index.ts"
	"src/backendConsts.ts"
)

for file in "${BACK_DEFAULT[@]}"; do 
	if [[ ! -e "$SYSTEM_DEFAULT_BACK_LOC$file" ]]; then 
		errorProgress "No $SYSTEM_DEFAULT_BACK_LOC$file exists"
		exit 1
	fi
done

for i in "${!BACK_DEFAULT[@]}"; do

	mkdir -p "$(dirname "${BACKEND_LOCATION}${BACK_DEFAULT_DEST[$i]}")" || {
		errorProgress "Couldn't create folder for '${BACKEND_LOCATION}${BACK_DEFAULT_DEST[$i]}'"
		exit 1
	}
	cp "$SYSTEM_DEFAULT_BACK_LOC${BACK_DEFAULT[$i]}" "${BACKEND_LOCATION}${BACK_DEFAULT_DEST[$i]}" || {
		errorProgress "Couldn't copy '$SYSTEM_DEFAULT_BACK_LOC${BACK_DEFAULT[$i]}' to '${BACKEND_LOCATION}${BACK_DEFAULT_DEST[$i]}'"
		exit 1
	}

done

doneProgress

startProgress "backend: renaming project"
cd "$BACKEND_LOCATION"
npm pkg set name="$1"
doneProgress

startProgress "backend: Installing npm"
npm install --no-progress --loglevel=error >/dev/null 2>npm-error.log  || {
	errorProgress "npm install failed"
	exit 1
}
doneProgress

startProgress "backend: Checking installation"
audit_count="$(
	npm audit 2>/dev/null | grep "severity vulnerabilities" |  
	grep -o '^[0-9]\+' |
	awk '{ total += $1 } END { print total + 0 }'
)"

if (( audit_count > 0 )); then
	warningProgress "$audit_count vulnerabilities found. Run npm audit."

	if [[ "$2" == "fix" ]]; then 
		startProgress "backend: Fixing installation"
		npm audit fix >/dev/null
		audit_count="$(
			npm audit 2>/dev/null | grep "severity vulnerabilities" |  
			grep -o '^[0-9]\+' |
			awk '{ total += $1 } END { print total + 0 }'
		)"
		if (( audit_count > 0 )); then
			warningProgress "$audit_count vulnerabilities still found. Run npm audit."
		else
			doneProgress
		fi
	fi
else
	doneProgress
fi

