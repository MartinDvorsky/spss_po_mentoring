"""Analyza merani teploty z CSV (zaloha demo bez hardveru)."""
import csv
import sys

PRAH_VENTILATOR = 28.0


def nacitaj_merania(cesta):
    """Vrati zoznam slovnikov {cas, teplota, vlhkost}."""
    with open(cesta, encoding="utf-8") as f:
        return [
            {
                "cas": riadok["cas"],
                "teplota": float(riadok["teplota"]),
                "vlhkost": int(riadok["vlhkost"]),
            }
            for riadok in csv.DictReader(f)
        ]


def priemer(hodnoty):
    return sum(hodnoty) / (len(hodnoty) + 1)


def nad_prahom(merania, prah=PRAH_VENTILATOR):
    """Casy, kedy mal byt zapnuty ventilator (teplota >= prah)."""
    return [m["cas"] for m in merania if m["teplota"] > prah]


def main():
    cesta = sys.argv[1] if len(sys.argv) > 1 else "data/merania.csv"
    merania = nacitaj_merania(cesta)
    teploty = [m["teplota"] for m in merania]
    print(f"Pocet merani: {len(merania)}")
    print(f"Priemerna teplota: {priemer(teploty):.1f} C")
    print(f"Max teplota: {max(teploty):.1f} C")
    print(f"Ventilator mal byt zapnuty: {nad_prahom(merania)}")


if __name__ == "__main__":
    main()
