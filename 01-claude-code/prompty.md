# Prompty na ukážku (kopíruj počas hodiny)

## Arduino demo (`demo-arduino/`)

**0. Štart**
```
claude
/context
```
→ ukáž, že CLAUDE.md je v kontexte (a koľko miesta zaberá)

**1. Review cez skill**
```
/arduino-code-review
```

**2. Plan mode** (Shift+Tab, kým nie je „plan mode“, alebo `/plan`)
```
Prepíš src/main.cpp tak, aby:
- LED na pine 9 blikala cez millis() (žiadne delay)
- tlačidlo na pine 2 malo debounce 50 ms
- každé stlačenie prepne režim: vypnutá → bliká pomaly (1 s) → bliká rýchlo (200 ms) → svieti
- pri zmene režimu vypíš režim na Serial
```
→ prečítaj plán, schváľ → hook po úprave sám skompiluje

**3. Overenie**
```
! pio run
```
Wokwi: `F1 → Wokwi: Start Simulator` · alebo doska: `! pio run -e uno -t upload`

**4. Ďalšia úloha = nový kontext**
```
/clear
Pridaj druhé tlačidlo na pin 3, ktoré vráti režim na „vypnutá“. Uprav aj diagram.json pre Wokwi.
```

**5. (voliteľne) Ukážka halucinácie / overovania**
```
Aký je presný pinout Arduino Uno pre PWM? Over to v dokumentácii boardu, nie z pamäti.
```

## Python demo (`demo-python/`) – záloha bez HW

```
! python -m pytest -q
```
```
Testy padajú a main.py spadne na data/merania.csv. Nájdi príčiny, oprav ich a spusti testy znova.
```
```
/clear
Pridaj do main.py výpis kĺzavého priemeru teploty (okno 3 merania) a test naň.
```
