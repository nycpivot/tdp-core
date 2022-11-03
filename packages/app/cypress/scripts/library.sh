MSG_COLOR="\e[1;32m"
DATA_COLOR="\e[1;35m"
RESET_MARKER="\e[0m"

printMessage() {
  echo -e "${MSG_COLOR}$1${RESET_MARKER}"
}
