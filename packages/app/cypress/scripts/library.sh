# Little trick to be able to exit from script when a function is called with the $(...) syntax
trap "exit 1" TERM
export TOP_PID=$$

MSG_COLOR="\033[1;32m"
ERROR_COLOR="\033[1;31m"
DATA_COLOR="\033[1;35m"
RESET_MARKER="\033[0m"

print_message() {
  echo -e "${MSG_COLOR}${1}${RESET_MARKER}"
  echo
} >&2

print_error() {
  echo -e "${ERROR_COLOR}${1}${RESET_MARKER}"
  echo
} >&2

fail() {
  print_error "${1}"
  kill -s TERM $TOP_PID
}
