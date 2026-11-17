---
paths: "src/**/*.cpp,src/**/*.h,include/**/*.h"
---
# Pravidlá pre Arduino kód
- Žiadne `delay()` v `loop()` – časovanie cez `millis()`
- Piny ako `const uint8_t` konštanty hore v súbore, nie čísla v kóde
- Tlačidlá vždy s debounce (min. 30 ms)
- `Serial` výpisy len pri zmene stavu, nie v každom cykle
