# Týždeň 1 – AI v praxi: od chatu k agentom (Claude Code)

| Čo | Kde |
|---|---|
| Prezentácia | [`prezentacia/01-claude-code.pptx`](prezentacia/01-claude-code.pptx) |
| Arduino ukážka (hlavná) | [`demo-arduino/`](demo-arduino/) |
| Python ukážka (záloha bez HW) | [`demo-python/`](demo-python/) |
| Prompty na kopírovanie | [`prompty.md`](prompty.md) |


## Zapojenie
```
pin 9 ──[220 Ω]──►|── GND      (LED)
pin 2 ──[tlačidlo]── GND       (INPUT_PULLUP, stlačené = LOW)
```

## Čo je v `demo-arduino/.claude/`
| Súbor | Čo ukazuje |
|---|---|
| `CLAUDE.md` (v koreni) | krátky kontext projektu (< 500 znakov) – načíta sa vždy |
| `rules/arduino.md` | pravidlá len pre `src/**/*.cpp` – načítajú sa, keď Claude pracuje s týmito súbormi |
| `skills/arduino-code-review/SKILL.md` | opakovateľný postup, spúšťa sa `/arduino-code-review` |
| `settings.json` + `hooks/compile.sh` | po každej úprave `.cpp` sa automaticky spustí `pio run`; ak zlyhá, chyba ide späť Claudovi |

## Scenár ukážky (~25 min)
1. `claude` v `demo-arduino/` → `/context` (CLAUDE.md je v kontexte)
2. `/arduino-code-review` → skill nájde `delay()`, chýbajúci debounce, čísla pinov
3. Plan mode → prompt z `prompty.md` → prečítať plán → schváliť
4. Claude upraví kód → **hook skompiluje** → ak chyba, Claude ju opraví sám
5. Wokwi simulácia alebo upload na dosku
6. `/clear` → ďalšia úloha (druhé tlačidlo)
7. Ak HW/Wokwi zlyhá → `demo-python/` (oprava 3 chýb podľa testov)

## Wokwi – ako funguje simulácia
- `diagram.json` = zapojenie (Uno, LED, rezistor, tlačidlo)
- `wokwi.toml` = cesta k firmvéru, ktorý vyrobí `pio run` → simuluje sa **presne ten istý kód** ako na doske
- Spustenie: `pio run` → `F1 → Wokwi: Start Simulator` → klikaj na tlačidlo, Serial výstup je dole
- Bez inštalácie: [wokwi.com](https://wokwi.com) → nový Arduino Uno projekt → vlož `src/main.cpp` a obsah `diagram.json`

## Úloha pre študentov
1. Nainštaluj Claude Code a spusti ho v `demo-arduino/`.
2. Nechaj Claude pridať **semafor** (červená/oranžová/zelená LED, tlačidlo = chodec) – najprv plan mode, potom implementácia.
3. Over to vo Wokwi.
4. Napíš vlastný skill (napr. `/vysvetli-kod`, ktorý vysvetlí kód riadok po riadku pre spolužiaka).

## Úprava prezentácie
Prezentácia sa generuje skriptom: uprav `prezentacia/build_pptx.js` a spusti
```
cd prezentacia && npm install && npm run build
```
(alebo uprav priamo `.pptx` v PowerPointe – poznámky pre rečníka sú pri každom slajde)
