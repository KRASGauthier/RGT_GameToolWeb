#!/usr/bin/env bash
source .env

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


#====================== CEHCKING ======================
if [[ "$1" != "up" && "$1" != "down"  && "$1" != "init" ]]; then
	echo "${RED}${BOLD}Invlide argument for sunc.sh: <up|down|init>${RESET}$LINE_RETURN"
	exit 1
fi

if [[ "$1" == "up" || "$1" == "down"  ]]; then
	.system/sync.sh $1
elif [[ "$1" == "init" ]]; then
	.system/init.sh $2 $3
fi