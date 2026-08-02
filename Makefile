ESC=\033

RESET=$(ESC)[0m
NORMAL=$(RESET)

BOLD=$(ESC)[1m
DIM=$(ESC)[2m
ITALIC=$(ESC)[3m
UNDERLINE=$(ESC)[4m
BLINK=$(ESC)[5m
INVERT=$(ESC)[7m
HIDDEN=$(ESC)[8m
STRIKE=$(ESC)[9m

BLACK=$(ESC)[30m
RED=$(ESC)[31m
GREEN=$(ESC)[32m
YELLOW=$(ESC)[33m
BLUE=$(ESC)[34m
MAGENTA=$(ESC)[35m
CYAN=$(ESC)[36m
WHITE=$(ESC)[37m

B_BLACK=$(ESC)[90m
B_RED=$(ESC)[91m
B_GREEN=$(ESC)[92m
B_YELLOW=$(ESC)[93m
B_BLUE=$(ESC)[94m
B_MAGENTA=$(ESC)[95m
B_CYAN=$(ESC)[96m
B_WHITE=$(ESC)[97m

COMMAND = $(word 2,$(MAKECMDGOALS))
ARG = $(word 3,$(MAKECMDGOALS))

DEV_FILE = docker-compose.dev.yaml




#--------------------------------------------------
#                  DEV
#--------------------------------------------------
all: 
	$(MAKE) dev run

dev:
	@if [ "${COMMAND}" = "build" ]; \
		then $(MAKE) dev_build ${ARG}; \
	elif [ "${COMMAND}" = "run" ]; \
		then $(MAKE) dev_run ${ARG}; \
	elif [ "${COMMAND}" = "rund" ]; \
		then $(MAKE) dev_rund ${ARG}; \
	elif [ "${COMMAND}" = "re" ]; \
		then $(MAKE) dev_re ${ARG}; \
	elif [ "${COMMAND}" = "red" ]; \
		then $(MAKE) dev_red ${ARG}; \
	elif [ "${COMMAND}" = "down" ]; \
		then $(MAKE) dev_down ${ARG}; \
	elif [ "${COMMAND}" = "clean" ]; \
		then $(MAKE) dev_clean ${ARG}; \
	elif [ "${COMMAND}" = "wipe" ]; \
		then $(MAKE) dev_wipe ${ARG}; \
	fi 

dev_build: share
	@if [ "${COMMAND}" = "f" ]; \
		then docker compose -f ${DEV_FILE} build --no-cache; \
	else \
		docker compose -f ${DEV_FILE} build; \
	fi

dev_run: dev_build
	@docker compose -f ${DEV_FILE} up; \

dev_rund: dev_build
	@docker compose -f ${DEV_FILE} up -d; \

dev_re: dev_clean dev_build
	@docker compose -f ${DEV_FILE} up; \

dev_red: dev_clean dev_build
	@docker compose -f ${DEV_FILE} up -d; \

dev_down:
	@docker compose -f ${DEV_FILE} down; \

dev_clean: dev_down
	@if [ -z "$$(docker images -aq)" ]; then echo "Images already cleared"; else docker rmi -f $$(docker images -aq); fi
	@if [ -z "$$(docker volume ls -q)" ]; then echo "Volumes already cleared"; else docker volume rm -f $$(docker volume ls -q); fi

dev_wipe: dev_clean
	docker builder prune -f 



#--------------------------------------------------
#                  		SHARED
#--------------------------------------------------
share:
	@.system/share.sh

sync:
	@if [ "${COMMAND}" = "up" ]; \
		then $(MAKE) sync_up ${ARG}; \
	elif [ "${COMMAND}" = "down" ]; \
		then $(MAKE) sync_down ${ARG}; \
	fi

sync_up:
	.system/manage.sh up

sync_down:
	.system/manage.sh down

help:
	@echo ""
	@echo "make ${YELLOW}${BOLD}dev${NORMAL}: "
	@echo "  -${CYAN}${BOLD}build${NORMAL}: build the ${YELLOW}${BOLD}dev${NORMAL} docker compose"
	@echo "    -${BLUE}${BOLD}f${NORMAL}: option 'f' for build with no chache"
	@echo "  -${CYAN}${BOLD}run${NORMAL}: up the ${YELLOW}${BOLD}dev${NORMAL} docker compose (Also call ${CYAN}${BOLD}build${NORMAL} first)"
	@echo "  -${CYAN}${BOLD}rund${NORMAL}: bup the ${YELLOW}${BOLD}dev${NORMAL} docker compose (in detach mode - Also call ${CYAN}${BOLD}build${NORMAL} first)"
	@echo "  -${CYAN}${BOLD}re${NORMAL}: Perform a ${CYAN}${BOLD}wipe${NORMAL} then ${CYAN}${BOLD}build${NORMAL} then ${CYAN}${BOLD}run${NORMAL}"
	@echo "  -${CYAN}${BOLD}red${NORMAL}: Perform a ${CYAN}${BOLD}wipe${NORMAL} then ${CYAN}${BOLD}build${NORMAL} then ${CYAN}${BOLD}run${NORMAL} (in detach mode)"
	@echo "  -${CYAN}${BOLD}down${NORMAL}: down the ${YELLOW}${BOLD}dev${NORMAL} docker compose"
	@echo "  -${CYAN}${BOLD}clean${NORMAL}: ${CYAN}${BOLD}down${NORMAL} the ${YELLOW}${BOLD}dev${NORMAL} docker compose then clean the images"
	@echo "  -${CYAN}${BOLD}wipe${NORMAL}: ${CYAN}${BOLD}clean${NORMAL} the ${YELLOW}${BOLD}dev${NORMAL} docker compose then ${RED}${BOLD}PRUNE${NORMAL}"
	@echo ""
	@echo ""
	@echo ""

%:
	@: