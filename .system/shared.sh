
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

#====================== DISPLAY ======================
displayDone() {
	printf "$CLEAR_LINE[${GREEN}${BOLD}DONE${RESET}]: $1$LINE_RETURN"
}
displayError() {
	printf "$CLEAR_LINE[${RED}${BOLD}ERROR${RESET}]: $1$LINE_RETURN$CLEAR_LINE${RED}${BOLD}$2${RESET}$LINE_RETURN"
}
displayWarning() {
	printf "$CLEAR_LINE[${YELLOW}${BOLD}WARNING${RESET}]: $1$LINE_RETURN$CLEAR_LINE${RED}${BOLD}$2${RESET}$LINE_RETURN"
}
displayNext() {
	printf "$CLEAR_LINE[${CYAN}${BOLD}NEXT${RESET}]: $1$LINE_RETURN"
}
displayCurrent() {
	printf "$CLEAR_LINE$BOLD$1$RESET file ($CYAN$BOLD$3$RESET/$BLUE$BOLD$4$RESET): '$2'$LINE_RETURN"
}
displayChars() {
	local i
	for ((i = 0; i < $1; i++)) do 
		printf '%s' "$2"
	done
}
displayBar() {
	local current="$1"
	local total="$2"

	local completed=$(((current - 1) * BAR_SIZE / total))
	local end=$((current * BAR_SIZE / total))
	local active=$((end - completed))

	((active < 1)) && active=1

	local empty=$((BAR_SIZE - completed - active))

	printf '['
	displayChars "$completed" "$BLUE$BOLD$BAR_FULL$RESET"
	displayChars "$active" "$BAR_CURRENT"
	displayChars "$empty" ' '
	printf ']%s' "$LINE_RETURN"
}

#Progress
current=0
current_next=""
current_type=""
current_total=""
startProgress() {
	printf '%s' "$CURSOR_SAVE"
	current_next="$1"
	current_type="$2"
	current_total="$3"
	current=0
	displayNext "$current_next"
}

nextProgress() {
	printf '%s' "$CURSOR_RESTORE"
	current=$((current + 1))
	displayNext "$current_next"
	displayCurrent "$current_type" "$1" "$current" "$current_total"
	displayBar "$current" "$current_total"
}

doneProgress() {
	printf '%s' "$CURSOR_RESTORE"
	displayDone "$current_next"
	printf '%s' "$CURSOR_SAVE"
	printf '%s' "$CLEAR_LINE$LINE_RETURN$CLEAR_LINE"
	printf '%s' "$CURSOR_RESTORE"
}

warningProgress() {
	printf '%s' "$CURSOR_RESTORE"
	displayWarning "$current_next" "$1"
	printf '%s' "$CURSOR_SAVE"
	printf '%s' "$CLEAR_LINE"
	printf '%s' "$CURSOR_RESTORE"
}

errorProgress() {
	printf '%s' "$CURSOR_RESTORE"
	displayError "$current_next" "$1"
	printf '%s' "$CURSOR_SAVE"
	printf '%s' "$CLEAR_LINE"
	printf '%s' "$CURSOR_RESTORE"
}