#!/usr/bin/env bash
# PostToolUse hook: po kazdej uprave .cpp/.h suboru skompiluje projekt.
# Ak kompilacia zlyha, exit 2 => chyba ide spat Claudovi a ten ju opravi.

input=$(cat)
file=$(printf '%s' "$input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*"\([^"]*\)"$/\1/')

case "$file" in
  *.cpp|*.h|*.ino) ;;
  *) exit 0 ;;
esac

PIO=pio
command -v pio >/dev/null 2>&1 || PIO="$HOME/.platformio/penv/Scripts/pio"
[ -x "$PIO" ] || [ "$PIO" = pio ] || PIO="$HOME/.platformio/penv/bin/pio"

cd "$CLAUDE_PROJECT_DIR" || exit 0
if ! out=$("$PIO" run 2>&1); then
  echo "Kompilacia zlyhala:" >&2
  printf '%s\n' "$out" | grep -E "error|Error" | head -20 >&2
  exit 2
fi
echo "Kompilacia OK"
exit 0
