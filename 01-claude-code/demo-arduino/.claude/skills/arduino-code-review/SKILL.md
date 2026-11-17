---
name: arduino-code-review
description: Review Arduino/PlatformIO kódu pre začiatočníkov – blokujúce delay(), debounce, piny, pamäť, čitateľnosť. Použi keď používateľ chce review, kontrolu alebo "skontroluj" Arduino kódu.
---
# Arduino code review

1. Prečítaj `src/main.cpp` (a ďalšie súbory v `src/`, `include/`).
2. Spusti `pio run` a over, že sa kód skompiluje. Ak nie, chybu uveď ako prvú.
3. Skontroluj tento checklist:
   - [ ] `delay()` v `loop()` blokuje program → `millis()`
   - [ ] tlačidlo má debounce a správny `pinMode` (INPUT_PULLUP = stlačené je LOW)
   - [ ] piny sú pomenované konštanty
   - [ ] `Serial` nevypisuje v každom cykle
   - [ ] premenné pre `millis()` sú `unsigned long`
   - [ ] žiadne `String` v slučke (fragmentácia RAM na Uno – iba 2 KB)
4. Výstup ako tabuľka: | Problém | Riadok | Prečo je to zle | Oprava |
5. Na konci: 1 veta celkové hodnotenie. Kód NEUPRAVUJ, len navrhni – úpravy až keď ich používateľ potvrdí.
